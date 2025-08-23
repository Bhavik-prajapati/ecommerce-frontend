import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../store/orderSlice";
import Header from "../../Components/Header";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const handleBuySingle = (id) => {
    navigate(`/checkout?type=single&id=${id}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-orange-50 via-rose-50 to-pink-50 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-indigo-600 mb-10">
            My Orders
          </h1>

          {/* Loading */}
          {loading && (
            <p className="text-center text-indigo-600 mt-10 animate-pulse">
              Loading your orders...
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-center text-red-600 mt-10 font-medium">{error}</p>
          )}

          {/* No Orders */}
          {!loading && !error && orders?.length === 0 && (
            <p className="text-center text-gray-600 mt-10">
              You have no orders yet.
            </p>
          )}

          {/* Orders List */}
          {!loading && !error && orders?.length > 0 && (
            <div className="space-y-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition duration-300"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Order #{order.id}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.payment_status === "paid"
                          ? "bg-gradient-to-r from-green-200 to-green-300 text-green-800"
                          : "bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-800"
                      }`}
                    >
                      {order.payment_status.toUpperCase()}
                    </span>
                  </div>

                  {/* Product Section */}
                  <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                    <img
                      src={order.image_url}
                      alt={order.name}
                      className="w-full md:w-40 h-40 object-contain rounded-xl border hover:scale-105 transform transition duration-300"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {order.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{order.description}</p>
                      <p className="text-gray-700">
                        <span className="font-medium">Price:</span> ₹{order.price}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Quantity:</span> {order.quantity}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Total Paid:</span> ₹{order.total_price}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Rating: ⭐ {order.average_rating} ({order.rating_count} reviews)
                      </p>
                    </div>
                  </div>

                  {/* Payment Info / Action */}
                  <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                    {order.payment_status === "pending" ? (
                      <button
                        onClick={() => handleBuySingle(order.id)}
                        className="py-2 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow hover:opacity-90 transition"
                      >
                        Complete Payment
                      </button>
                    ) : (
                      <div className="flex flex-col text-sm text-gray-600">
                        <span>Order ID: {order.razorpay_order_id}</span>
                        <span>Payment ID: {order.razorpay_payment_id}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyOrders;
