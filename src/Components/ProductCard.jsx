import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { toast } from "react-toastify";


const ProductCard = ({ products }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

  const handleAddToCart = (product) => {
    const token = localStorage.getItem("token"); // ✅ get token from localStorage (or Redux if you store it there)

    if (!token) {
      toast.error("Please log in to continue"); 
      navigate("/login");
      return;
    }

    dispatch(addToCart({ product_id: product.id, quantity: 1 }));
    toast.success("Item added to cart!");
  };

  return (
    <>
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col"
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-60 object-cover rounded-lg"
          />

          <div className="mt-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 flex-grow">
              {product.description}
            </p>
            <p className="text-indigo-600 font-bold mt-2">₹{product.price}</p>

            <div className="mt-4 flex space-x-3">
              <button
                onClick={() =>
                  navigate(
                    `/product/${encodeURIComponent(
                      CryptoJS.AES.encrypt(
                        product.id.toString(),
                        SECRET_KEY
                      ).toString()
                    )}`
                  )
                }
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
              >
                View
              </button>

              <button
                onClick={() => handleAddToCart(product)}
                className="flex-1 border border-indigo-600 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductCard;
