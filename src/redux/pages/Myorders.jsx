import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../store/orderSlice";
import Header from "../../Components/Header";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8">My Orders</h1>

        {/* Loading */}
        {loading && (
          <p className="text-center text-indigo-600 mt-10">Loading your orders...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-600 mt-10">Error: {error}</p>
        )}

        {/* No Orders */}
        {!loading && !error && orders?.length === 0 && (
          <p className="text-center text-gray-600 mt-10">You have no orders yet.</p>
        )}

        {/* Orders List */}
        {!loading && !error && orders?.length > 0 && (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Order #{order.id}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.payment_status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </div>

                {/* Product Section */}
                <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                  <img
                    src={order.image_url}
                    alt={order.name}
                    className="w-40 h-40 object-contain rounded-lg border"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{order.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{order.description}</p>
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

                {/* Payment Info */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                  <h4 className="font-medium text-gray-800 mb-1">Payment Info</h4>
                  <p className="text-gray-600 text-sm">Order ID: {order.razorpay_order_id}</p>
                  <p className="text-gray-600 text-sm">Payment ID: {order.razorpay_payment_id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
