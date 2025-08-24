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
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition"
              >
                View
              </button>

             <button
  onClick={() => handleAddToCart(product)}
  className="flex items-center gap-2 border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-2xl shadow hover:bg-orange-50 active:scale-95 transition duration-200 font-semibold"
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
