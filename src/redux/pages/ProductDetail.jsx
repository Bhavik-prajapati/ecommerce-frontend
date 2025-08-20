import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import Header from "../../Components/Header";
import { useEffect } from "react";
import { fetchProductById } from "../../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { toast } from "react-toastify";
import { ShoppingCart, CreditCard } from "lucide-react";

const ProductDetail = () => {
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Decode ID
  const decodedId = decodeURIComponent(id);
  const bytes = CryptoJS.AES.decrypt(decodedId, SECRET_KEY);
  const decryptedId = bytes.toString(CryptoJS.enc.Utf8);

  const { product, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    if (decryptedId) {
      dispatch(fetchProductById(decryptedId));
    }
  }, [dispatch, decryptedId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
  if (!product) return <p className="text-center mt-10">No product found</p>;

  // ✅ Handlers
  const handleAddToCart = () => {
    dispatch(addToCart({ product_id: decryptedId, quantity: 1 }))
      .unwrap()
      .then(() => toast.success("Item added to cart!"))
      .catch((err) => toast.error("Error: " + err));
  };

  const handleBuySingle = (productid) => {
    
    navigate(`/checkout/${productid}`, { state: { type: "single", product } });
  };

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Product Image */}
        <div className="flex justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            className="rounded-xl shadow-lg max-h-[400px] object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-2xl font-semibold text-indigo-600">&#8377;{product.price}</p>


          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={()=>handleBuySingle(product.id)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:bg-indigo-700 transition cursor-pointer"
            >
              <CreditCard size={20} /> Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 border border-indigo-600 text-indigo-600 px-5 py-2 rounded-xl shadow hover:bg-indigo-50 transition cursor-pointer"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
