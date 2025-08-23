import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItem, removeCartItem } from "../../store/cartSlice";
import Header from "../../Components/Header";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const navigate = useNavigate();

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
    navigate(`/checkout/${item.id}`, { state: { type: "single", product: item } });
  };

  if (loading) return <p className="text-center text-gray-500">Loading cart...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">🛒 Your Cart</h2>

        {items.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="w-full text-left border border-gray-200">
              <thead className="bg-gray-100">
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
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                    </td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3 font-medium">₹{item.price}</td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center border rounded overflow-hidden">
                        <button onClick={() => handleDecrease(item)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300">-</button>
                        <span className="px-4 py-1">{item.quantity}</span>
                        <button onClick={() => handleIncrease(item)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300">+</button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">₹{item.price * item.quantity}</td>
                    <td className="px-4 py-3 flex flex-col gap-2">
                      <button onClick={() => handleRemove(item)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Remove</button>
                      <button onClick={() => handleBuySingle(item)} className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Buy Now</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-6 flex flex-col items-end">
            <h3 className="text-xl font-semibold mb-3">
              Total: ₹{items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
            </h3>
            <button onClick={handleBuyCart} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
              Checkout Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
