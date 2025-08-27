import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import Header from "../../Components/Header";
import { useEffect, useState } from "react";
import { fetchProductById } from "../../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { fetchReviews, addReview } from "../../store/reviewSlice";
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
  const { items: feedbacks, loading: reviewsLoading, error: reviewsError } = useSelector((state) => state.reviews);

  const [newFeedback, setNewFeedback] = useState("");
  const [rating, setRating] = useState(5); // default 5 stars

  useEffect(() => {
    if (decryptedId) {
      dispatch(fetchProductById(decryptedId));
      dispatch(fetchReviews(decryptedId));
    }
  }, [dispatch, decryptedId]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product_id: decryptedId, quantity: 1 }))
      .unwrap()
      .then(() => toast.success("Added to cart"))
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

  const handleSubmitFeedback = () => {
    if (!newFeedback.trim()) return;
    if (!token) {
      toast.error("Please log in to add a review");
      navigate("/login");
      return;
    }

    dispatch(addReview({ productId: decryptedId, rating, comment: newFeedback.trim(), token }))
      .unwrap()
      .then(() => {
        setNewFeedback("");
        setRating(5); // reset rating
        toast.success("Feedback added!");
      })
      .catch((err) => toast.error("Error: " + err));
  };

  if (loading) return <p className="text-center mt-20 text-lg text-gray-600 animate-pulse">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-20 text-lg font-medium">Error: {error}</p>;
  if (!product) return <p className="text-center mt-20 text-lg text-gray-500">No product found</p>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-rose-50 to-pink-50 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-10">

          {/* Product Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <div className="flex justify-center">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                <img src={product.image_url} alt={product.name} className="object-contain max-h-[500px] transition-transform duration-300 hover:scale-105"/>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4 mt-30">
              <h2 className="text-5xl font-extrabold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 text-lg">{product.description}</p>
              <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500">
                &#8377;{product.price}
              </p>

              <div className="flex gap-4 flex-wrap mt-4">
                <button onClick={handleBuySingle} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-3xl shadow-lg hover:opacity-90 active:scale-95 transition font-semibold">
                  <CreditCard size={20} /> Buy Now
                </button>
                <button onClick={handleAddToCart} className="flex items-center gap-2 border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-3xl shadow hover:bg-orange-50 active:scale-95 transition font-semibold">
                  <ShoppingCart size={20} /> Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h3>

            {/* Feedback Input + Rating */}
            <div className="flex flex-col md:flex-row gap-3 mb-6 items-center">
              <input
                type="text"
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                placeholder="Write your feedback..."
                className="flex-1 border border-gray-300 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                {[5,4,3,2,1].map((r) => (
                  <option key={r} value={r}>{r}★</option>
                ))}
              </select>
              <button
                onClick={handleSubmitFeedback}
                className="flex items-center gap-2 border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-2xl shadow hover:bg-orange-50 active:scale-95 transition font-semibold"
              >
                Submit
              </button>
            </div>

            {reviewsLoading && <p>Loading reviews...</p>}
            {reviewsError && <p className="text-red-500">{reviewsError}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbacks.length > 0 ? (
                feedbacks.map((fb, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 shadow-md rounded-2xl p-5 hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-gray-800">{fb.user_name || 'You'}</p>
                      <p className="text-yellow-500 font-bold">{fb.rating || 5}★</p>
                    </div>
                    <p className="text-gray-600">{fb.comment || fb.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full">No reviews yet. Be the first to add one!</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProductDetail;
