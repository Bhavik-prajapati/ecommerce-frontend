import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, logout } from "../../store/userSlice";
import { toast } from "react-toastify";
import { Download } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  // Read ?tab= from URL
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "info";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab with URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/profile?tab=${tab}`);
  };

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
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
                onClick={() => handleTabChange(tab)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Loader & Error */}
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
                    const downloadInvoice = async () => {
                      const pdfMakeModule =
                        (await import("pdfmake/build/pdfmake")).default ||
                        (await import("pdfmake/build/pdfmake"));
                      const pdfFontsModule =
                        (await import("pdfmake/build/vfs_fonts")).default ||
                        (await import("pdfmake/build/vfs_fonts"));
                      pdfMakeModule.vfs =
                        pdfFontsModule.pdfMake?.vfs || pdfFontsModule.vfs;

                      const total = order.items.reduce(
                        (acc, i) => acc + i.price * i.quantity,
                        0
                      );
                      const tax = total * 0.0;
                      const grandTotal = total + tax;
                      const orderDate = new Date(
                        order.order_date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                      const dueDate = new Date(
                        new Date().setDate(
                          new Date(order.order_date).getDate() + 7
                        )
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });

                      const docDefinition = {
                        content: [
                          {
                            columns: [
                              { text: "ShopEase", style: "header" },
                              {
                                text: `Invoice #${order.order_id}\nCreated: ${orderDate}\nDue: ${dueDate}`,
                                alignment: "right",
                                margin: [0, 0, 0, 20],
                              },
                            ],
                          },
                          {
                            columns: [
                              {
                                stack: [
                                  "ShopEase Pvt Ltd",
                                  "123 Market Street",
                                  "Ahmedabad, Gujarat, 380001",
                                ],
                                margin: [0, 0, 0, 20],
                              },
                              {
                                stack: [
                                  `Bill To: ${user.name}`,
                                  order.customer_email || "N/A",
                                  order.shipping_address || "N/A",
                                  `Phone: ${order.customer_phone || "N/A"}`,
                                ],
                                alignment: "right",
                                margin: [0, 0, 0, 20],
                              },
                            ],
                          },
                          {
                            columns: [
                              { text: "Payment Method", style: "tableHeader" },
                              {
                                text: order.payment_method || "N/A",
                                style: "details",
                              },
                              {
                                text: `Txn ID: ${
                                  order.transaction_id || "N/A"
                                }`,
                                alignment: "right",
                                style: "details",
                              },
                            ],
                            margin: [0, 0, 0, 20],
                          },
                          {
                            table: {
                              widths: ["*", "auto", "auto", "auto", "auto"],
                              body: [
                                [
                                  { text: "Item", style: "tableHeader" },
                                  { text: "Description", style: "tableHeader" },
                                  { text: "Qty", style: "tableHeader" },
                                  { text: "Unit Price", style: "tableHeader" },
                                  { text: "Total", style: "tableHeader" },
                                ],
                                ...order.items.map((i) => [
                                  i.product_name,
                                  i.description || "-",
                                  {
                                    text: i.quantity.toString(),
                                    alignment: "right",
                                  },
                                  { text: `₹${i.price}`, alignment: "right" },
                                  {
                                    text: `₹${i.price * i.quantity}`,
                                    alignment: "right",
                                  },
                                ]),
                                [
                                  {
                                    text: "Subtotal",
                                    colSpan: 4,
                                    alignment: "right",
                                    bold: true,
                                  },
                                  {},
                                  {},
                                  {},
                                  {
                                    text: `₹${total}`,
                                    alignment: "right",
                                    bold: true,
                                  },
                                ],
                                [
                                  {
                                    text: "GST (0%)",
                                    colSpan: 4,
                                    alignment: "right",
                                    bold: true,
                                  },
                                  {},
                                  {},
                                  {},
                                  {
                                    text: `₹${tax.toFixed(2)}`,
                                    alignment: "right",
                                    bold: true,
                                  },
                                ],
                                [
                                  {
                                    text: "Grand Total",
                                    colSpan: 4,
                                    alignment: "right",
                                    bold: true,
                                  },
                                  {},
                                  {},
                                  {},
                                  {
                                    text: `₹${grandTotal.toFixed(2)}`,
                                    alignment: "right",
                                    bold: true,
                                  },
                                ],
                              ],
                            },
                            layout: "noBorders",
                            margin: [0, 20, 0, 0],
                          },
                          {
                            text: "Thank you for shopping with ShopEase!",
                            style: "footer",
                          },
                          { text: "Visit us at: www.shopease.com", style: "footer" },
                        ],
                        styles: {
                          header: { fontSize: 45, bold: true, color: "#4f46e5" },
                          tableHeader: {
                            bold: true,
                            fontSize: 13,
                            color: "white",
                            fillColor: "#4f46e5",
                            alignment: "center",
                          },
                          details: { fontSize: 12 },
                          footer: {
                            alignment: "center",
                            italics: true,
                            color: "#888",
                            margin: [0, 20, 0, 0],
                          },
                        },
                      };

                      toast.success("Downloading Invoice");
                      pdfMakeModule
                        .createPdf(docDefinition)
                        .download(`invoice_${order.order_id}.pdf`);
                    };

                    return (
                      <li
                        key={order.order_id}
                        className="p-4 border rounded-xl shadow-sm hover:shadow-md transition"
                      >
                        <p className="font-medium mb-2">
                          Order #{order.order_id}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          Order Date:{" "}
                          {new Date(order.order_date).toLocaleString()}
                        </p>
                        <ul className="space-y-2">
                          {order.items.map((item) => (
                            <li
                              key={item.product_id}
                              className="flex items-center gap-4"
                            >
                              <img
                                src={item.image_url}
                                alt={item.product_name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <p className="font-semibold">
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
                        <button
                          onClick={downloadInvoice}
                          className="mt-4 w-40 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl shadow-lg hover:opacity-90 transition font-semibold cursor-pointer"
                        >
                          <Download size={20} /> Invoice
                        </button>
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
