import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, logout } from "../../store/userSlice";
import { toast } from "react-toastify";


const Profile = () => {
  const [activeTab, setActiveTab] = useState("info");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
  const token = localStorage.getItem("token"); 
  if (!token) {
          toast.error("Please log in to continue"); 
          navigate("/login");
          return;
    }
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6">My Profile</h1>

        {/* Tabs */}
        <div className="flex gap-6 border-b mb-6">
          <button
            className={`pb-2 ${
              activeTab === "info"
                ? "text-indigo-600 border-b-2 border-indigo-600 cursor-pointer"
                : "text-gray-600 cursor-pointer"
            }`}
            onClick={() => setActiveTab("info")}
          >
            Info
          </button>
          <button
            className={`pb-2 ${
              activeTab === "orders"
                ? "text-indigo-600 border-b-2 border-indigo-600 cursor-pointer"
                : "text-gray-600 cursor-pointer"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            My Orders
          </button>
          <button
            className={`pb-2 ${
              activeTab === "contact"
                ? "text-indigo-600 border-b-2 border-indigo-600 cursor-pointer"
                : "text-gray-600 cursor-pointer"
            }`}
            onClick={() => setActiveTab("contact")}
          >
            Contact Us
          </button>
        </div>

        {/* Loader & Error */}
        {loading && <p>Loading profile...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* Tab Content */}
        {activeTab === "info" && user && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Info</h2>
            <p>
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Role:</span> {user.role}
            </p>

            <p>
              <button
                className="flex items-center gap-2 bg-red-700 text-white px-5 py-2 rounded-xl shadow hover:bg-red-800 transition cursor-pointer mt-5"
                onClick={handleLogout}
              >
                Logout
              </button>
            </p>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">My Orders</h2>
            {user?.orders?.length > 0 ? (
              <ul className="space-y-4">
                {user.orders.map((order) => (
                  <li
                    key={order.id}
                    className="p-4 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        Status: {order.payment_status}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {order.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-indigo-600">
                      ₹{order.total_price}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        )}

        {activeTab === "contact" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-2">📧 Email: support@shopapp.com</p>
            <p className="mb-2">📞 Phone: +91 9876543210</p>
            <p>
              💬 Or chat with us from the{" "}
              <span className="text-indigo-600 underline cursor-pointer">
                Help Center
              </span>
              .
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
