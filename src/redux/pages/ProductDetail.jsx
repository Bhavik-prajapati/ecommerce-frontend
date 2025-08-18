import { useNavigate, useParams } from "react-router-dom"; // ✅ useNavigate instead of Navigate
import CryptoJS from "crypto-js";
import Header from "../../Components/Header";
import { useEffect } from "react";
import { fetchProductById } from "../../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY; 
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ here

  const decodedId = decodeURIComponent(id);
  const bytes = CryptoJS.AES.decrypt(decodedId, SECRET_KEY);
  const decryptedId = bytes.toString(CryptoJS.enc.Utf8);

  const { product, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    if (decryptedId) {
      dispatch(fetchProductById(decryptedId));
    }
  }, [dispatch, decryptedId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>No product found</p>;

  const handleAddToCart = () => {
    dispatch(addToCart({ product_id: decryptedId, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success("Item added to cart!");
      })
      .catch((err) => {
        toast.error("Error: " + err);
      });
  };

  const handleBuySingle = () => {
    navigate("/checkout", { state: { type: "single", product } }); // ✅ use navigate
  };

  return (
    <>
      <Header />
      <div className="product-area-individual">
        <div>
          <img src={product.image_url} alt={product.name} />
        </div>
        <div>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>{product.price}</p>

          <button onClick={handleBuySingle}>Buy</button>
          <button onClick={handleAddToCart}>Add to cart</button>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
