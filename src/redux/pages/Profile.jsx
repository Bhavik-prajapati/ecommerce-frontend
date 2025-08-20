import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { data, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../store/authSlice";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("info");
  const navigate=useNavigate();
  const dispatch=useDispatch();

  
  const { data: profile, loading, error } = useSelector(
    (state) => state.auth.profile
  );

  console.log(data,profile,loading,error)

  useEffect(() => {
    dispatch(fetchUserProfile()); // 🔹 Fetch profile when component loads
  }, [dispatch]);

  const fakeUser = {
    name: "Jatin Birbal",
    email: "jatin@example.com",
    address: "123 Main Street, New Delhi, India",
    orders: [
      { id: 1, item: "Nike Shoes", price: "₹3999", status: "Delivered" },
      { id: 2, item: "Apple AirPods", price: "₹14999", status: "Shipped" },
    ],
  };

  const handleLogout=()=>{
    localStorage.clear();
    navigate("/login");
  }

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
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("info")}
          >
            Info
          </button>
          <button
            className={`pb-2 ${
              activeTab === "orders"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            My Orders
          </button>
          <button
            className={`pb-2 ${
              activeTab === "contact"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("contact")}
          >
            Contact Us
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "info" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Info</h2>
            <p>
              <span className="font-medium">Name:</span> {fakeUser.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {fakeUser.email}
            </p>
            <p>
              <span className="font-medium">Address:</span> {fakeUser.address}
            </p>

            <p>
                  <button className="flex items-center gap-2 bg-red-700 text-white px-5 py-2 rounded-xl shadow hover:bg-red-700 transition cursor-pointer mt-5" onClick={handleLogout}>Logout</button>
            </p>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">My Orders</h2>
            {fakeUser.orders.length > 0 ? (
              <ul className="space-y-4">
                {fakeUser.orders.map((order) => (
                  <li
                    key={order.id}
                    className="p-4 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{order.item}</p>
                      <p className="text-sm text-gray-500">{order.status}</p>
                    </div>
                    <span className="font-semibold text-indigo-600">
                      {order.price}
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
