import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItem, removeCartItem, fetchCart } from "../../store/cartSlice";
import Header from "../../Components/Header";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleIncrease = (item) => {
    dispatch(updateCartItem({ id: item.id, quantity: item.quantity + 1 }));
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(updateCartItem({ id: item.id, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeCartItem(item.id));
    }
  };

  const handleRemove = (item) => {
    dispatch(removeCartItem(item.id));
  };

  const handleBuyCart = () => {
    navigate("/checkout", { state: { type: "cart" } });
  };

  const handleBuySingle = (item) => {
    navigate(`/checkout?type=single&id=${item.product_id}&qnty=${item.quantity}`);
  };

  if (loading)
    return <p className="text-center text-indigo-600 mt-10 animate-pulse">Loading cart...</p>;
  if (error)
    return <p className="text-center text-red-600 mt-10 font-medium">{error}</p>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-orange-50 via-rose-50 to-pink-50 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-gray-800 text-center">🛒 Your Cart</h2>

          {items.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
          ) : (
            <div className="overflow-x-auto shadow-2xl rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gradient-to-r from-orange-100 via-rose-100 to-pink-100">
                  <tr>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-indigo-50 transition">
                      <td className="px-4 py-3">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl border"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3 font-semibold">₹{item.price}</td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center border rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleDecrease(item)}
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleIncrease(item)}
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 flex flex-col gap-2">
                        <button
                          onClick={() => handleRemove(item)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => handleBuySingle(item)}
                          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-lg hover:opacity-90 transition"
                        >
                          Buy Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-6 flex flex-col md:flex-row justify-end items-center gap-4">
              <h3 className="text-xl font-semibold">
                Total: ₹{items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
              </h3>
              <button
                onClick={handleBuyCart}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Checkout Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
