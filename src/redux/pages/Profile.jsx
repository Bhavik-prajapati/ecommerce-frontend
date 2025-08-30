import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, logout } from "../../store/userSlice";
import { Download } from "lucide-react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "info";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Generate Invoice
  const downloadInvoice = (order) => {
    const gstRate = 0; // For now GST is 0%
    const items = order.items.map((item) => {
      const subtotal = item.price * item.quantity;
      const gstAmount = subtotal * gstRate;
      return [
        item.product_name,
        item.quantity,
        `₹${item.price}`,
        `₹${subtotal}`,
        `₹${gstAmount.toFixed(2)}`,
        `₹${(subtotal + gstAmount).toFixed(2)}`,
      ];
    });

    const grandTotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const docDefinition = {
      content: [
        { text: "ShopEase Invoice", style: "header", alignment: "center" },
        {
          columns: [
            [
              { text: "From:", bold: true },
              { text: "ShopEase Pvt Ltd" },
              { text: "123, Main Street, Ahmedabad" },
              { text: "support@ShopEase.com" },
            ],
            [
              { text: "Bill To:", bold: true, alignment: "right" },
              { text: `${user?.name}`, alignment: "right" },
              { text: `${user?.email}`, alignment: "right" },
              { text: `${user?.role}`, alignment: "right" },
            ],
          ],
        },
        { text: " ", margin: [0, 10] },

        {
          columns: [
            { text: `Order ID: ${order.order_id}`, bold: true },
            {
              text: `Order Date: ${new Date(order.order_date).toLocaleDateString()}`,
              alignment: "right",
            },
          ],
        },
        {
          text: `Expected Delivery: ${new Date(
            order.expected_delivery_date
          ).toLocaleDateString()}`,
          margin: [0, 5, 0, 15],
        },

        {
          table: {
            widths: ["*", "auto", "auto", "auto", "auto", "auto"],
            body: [
              [
                { text: "Product", style: "tableHeader" },
                { text: "Qty", style: "tableHeader" },
                { text: "Price", style: "tableHeader" },
                { text: "Subtotal", style: "tableHeader" },
                { text: "GST", style: "tableHeader" },
                { text: "Total", style: "tableHeader" },
              ],
              ...items,
            ],
          },
          layout: "lightHorizontalLines",
        },

        {
          text: `Grand Total: ₹${grandTotal.toFixed(2)}`,
          style: "grandTotal",
          margin: [0, 15, 0, 0],
        },

        { text: "Thank you for shopping with ShopEase!", style: "thanks" },
      ],
      styles: {
        header: { fontSize: 22, bold: true, margin: [0, 0, 0, 15] },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: "white",
          fillColor: "#4F46E5",
        },
        grandTotal: { fontSize: 14, bold: true, alignment: "right" },
        thanks: {
          fontSize: 12,
          italics: true,
          alignment: "center",
          margin: [0, 30, 0, 0],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download(`invoice-${order.order_id}.pdf`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-orange-50 via-rose-50 to-pink-50 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl font-extrabold text-gray-800">My Profile</h1>

          {/* Tabs */}
          <div className="flex justify-center gap-6 border-b border-indigo-200 mb-8">
            {[
              ["info", "Info"],
              ["orders", "My Orders"],
              ["contact", "Contact Us"],
            ].map(([tab, label]) => (
              <button
                key={tab}
                className={`pb-2 px-2 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "text-indigo-600 border-b-4 border-gradient-to-r from-orange-500 to-pink-500"
                    : "text-gray-600 hover:text-indigo-500 cursor-pointer"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Loader */}
          {loading && (
            <p className="text-center text-indigo-600 animate-pulse">
              Loading profile...
            </p>
          )}
          {error && (
            <p className="text-center text-red-600 font-medium">{error}</p>
          )}

          {/* Info Tab */}
          {activeTab === "info" && user && (
            <div className="bg-white shadow-2xl rounded-2xl p-6 max-w-xl mx-auto space-y-4">
              <h2 className="text-xl font-semibold mb-2">Personal Info</h2>
              <p>
                <span className="font-medium">Name:</span> {user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Role:</span> {user.role}
              </p>
              <button
                onClick={handleLogout}
                className="mt-4 w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl shadow-lg hover:opacity-90 transition font-semibold"
              >
                Logout
              </button>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="bg-white shadow-2xl rounded-2xl p-6 max-w-3xl mx-auto space-y-4">
              <h2 className="text-xl font-semibold mb-4">My Orders</h2>
              {user?.orders?.length > 0 ? (
                <ul className="space-y-4">
                  {user.orders.map((order) => {
                    const expectedDelivery = new Date(
                      order.expected_delivery_date
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });

                    return (
                      <li
                        key={order.order_id}
                        className="p-5 border rounded-2xl shadow-md hover:shadow-lg transition bg-gradient-to-br from-orange-50 to-pink-50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-semibold text-lg text-gray-800">
                            Order #{order.order_id}
                          </p>
                          <span className="text-sm px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                            Placed on{" "}
                            {new Date(order.order_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        <ul className="space-y-3 mb-4">
                          {order.items.map((item) => (
                            <li
                              key={item.product_id}
                              className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm"
                            >
                              <img
                                src={item.image_url}
                                alt={item.product_name}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {item.product_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity} | ₹
                                  {item.price * item.quantity}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <button
                            onClick={() => downloadInvoice(order)}
                            className="flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl shadow-lg hover:opacity-90 transition font-semibold cursor-pointer"
                          >
                            <Download size={18} /> Download Invoice
                          </button>

                          <p className="text-sm text-gray-700 font-medium">
                            🚚 Expected Delivery:{" "}
                            <span className="text-green-600 font-semibold">
                              {expectedDelivery}
                            </span>
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">
                  You have no orders yet.
                </p>
              )}
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="bg-white shadow-2xl rounded-2xl p-6 max-w-xl mx-auto space-y-3">
              <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
              <p className="text-gray-700">📧 Email: support@shopapp.com</p>
              <p className="text-gray-700">📞 Phone: +91 9876543210</p>
              <p className="text-gray-700">
                💬 Or chat with us via{" "}
                <span className="text-indigo-600 underline cursor-pointer">
                  Help Center
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
