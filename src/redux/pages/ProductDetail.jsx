import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import Header from "../../Components/Header";
import { useEffect } from "react";
import { fetchProductById } from "../../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { ShoppingCart, CreditCard } from "lucide-react";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const decodedId = decodeURIComponent(id);
  const bytes = CryptoJS.AES.decrypt(decodedId, SECRET_KEY);
  const decryptedId = bytes.toString(CryptoJS.enc.Utf8);

  const { product, loading, error } = useSelector((state) => state.product);
  const token = useSelector((state) => state.auth.token); 

  useEffect(() => {
    if (decryptedId) {
      dispatch(fetchProductById(decryptedId));
    }
  }, [dispatch, decryptedId]);

  if (loading)
    return <p className="text-center mt-20 text-lg text-gray-600 animate-pulse">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-20 text-lg font-medium">Error: {error}</p>;
  if (!product)
    return <p className="text-center mt-20 text-lg text-gray-500">No product found</p>;

  const handleAddToCart = () => {
    dispatch(addToCart({ product_id: decryptedId, quantity: 1 }))
      .unwrap()
      .then(() =>{})
      .catch((err) => toast.error("Error: " + err));
  };

  const handleBuySingle = () => {
    if (!token) {
      toast.error("Please log in to continue");
      navigate("/login");
      return;
    }
    navigate(`/checkout?type=single&id=${product.id}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-orange-50 via-rose-50 to-pink-50 py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src={product.image_url}
              alt={product.name}
              className="rounded-2xl shadow-2xl max-h-[450px] object-contain transform hover:scale-105 transition duration-300"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold text-gray-800">{product.name}</h2>
            <p className="text-gray-600 text-lg">{product.description}</p>

            <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500">
              &#8377;{product.price}
            </p>

            <div className="flex gap-4 flex-wrap">
              {/* Buy Now */}
              <button
                onClick={handleBuySingle}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:opacity-90 active:scale-95 transition duration-200 font-semibold cursor-pointer"
              >
                <CreditCard size={20} /> Buy Now
              </button>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-2xl shadow hover:bg-orange-50 active:scale-95 transition duration-200 font-semibold cursor-pointer"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
