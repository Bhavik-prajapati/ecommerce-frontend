import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../store/productSlice";
import { useEffect, useState } from "react";
import { createOrder } from "../../store/orderSlice";
import api from "../../store/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");
  const type = query.get("type");
  const qnty = query.get("qnty") ? query.get("qnty") : 1;

  const [quantity, setQuantity] = useState(qnty ? qnty : 1);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState({
    receivername: "",
    mobile_no: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  const { product, loading: productLoading, error: productError } = useSelector(
    (state) => state.product
  );
  const { order, loading: orderLoading, error: orderError } = useSelector(
    (state) => state.order
  );
  const { items } = useSelector((state) => state.cart); // ✅ changed: added cart items

  useEffect(() => {
    if (type === "single" && id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id, type]);

  const totalAmount = product ? quantity * parseFloat(product.price) : 0;


  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleOrder = () => setShowAddressForm(true);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayNow = async () => {
    if (
      Object.values(address).some(
        (v) => !v.trim() && v !== address.address_line2
      )
    ) {
      toast.error("⚠️ Please fill all required fields");
      return;
    }

    // ✅ changed: calculate totalAmount differently for cart/single
    const totalAmount =
      type === "single"
        ? quantity * parseFloat(product?.price || 0)
        : items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

    // ✅ changed: build orderData differently for cart/single
    const orderData =
      type === "single"
        ? {
            productId: id,
            product: product?.name,
            quantity,
            total: totalAmount.toFixed(2),
            shippingAddress: { ...address },
          }
        : {
            products: items.map((item) => ({
              productId: item.product_id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            total: totalAmount.toFixed(2),
            shippingAddress: { ...address },
          };

    const res = await dispatch(createOrder(orderData));
    if (res.meta.requestStatus !== "fulfilled") {
      toast.error("❌ Order failed: " + res.payload);
      return;
    }

    const orderId = res.payload.orders[0].id;

    const data = (
      await api.post("http://localhost:5000/api/payment/razorpay", {
        amount: totalAmount,
        currency: "INR",
        receipt: "order_" + Date.now(),
      })
    ).data;

    if (!data.id) return toast.error("❌ Razorpay order creation failed");
    const isLoaded = await loadRazorpay();
    if (!isLoaded) return toast.error("❌ Razorpay SDK failed to load");

    // ✅ changed: description depends on checkout type
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.amount,
      currency: data.currency,
      name: "ShopEase",
      description: type === "single" ? product?.name : "Cart Checkout",
      order_id: data.id,
      handler: async function (response) {
        toast.success("✅ Payment successful!");
        setShowAddressForm(false);
        try {
          await api.post("payment/updateorderStatus", {
            orderId: orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
          navigate("/myorders");
        } catch (err) {
          toast.error("❌ Failed to update order");
        }
      },
      prefill: {
        name: address.receivername,
        email: data.email,
        contact: address.mobile_no,
      },
      theme: { color: "#fb923c" },
    };

    new window.Razorpay(options).open();
  };

  if (productLoading || orderLoading)
    return (
      <p className="text-center mt-20 text-lg animate-pulse">Loading...</p>
    );
  if (productError || orderError)
    return (
      <p className="text-center mt-20 text-red-500 text-lg font-medium">
        Error: {productError || orderError}
      </p>
    );

  // ✅ changed: conditionally check product only if single mode
  if (type === "single" && !product)
    return (
      <p className="text-center mt-20 text-gray-500">
        Product not found.
      </p>
    );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-orange-50 via-rose-50 to-pink-50 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-extrabold text-indigo-600 mb-8 text-center">
            Checkout
          </h1>

          {/* ✅ changed: conditional UI for single vs cart */}
          {type === "single" ? (
            <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row gap-6 border border-indigo-100">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full md:w-48 h-48 object-contain rounded-xl shadow hover:scale-105 transform transition duration-300"
              />

              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {product.name}
                </h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500">
                  ₹{product.price}
                </p>
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <span>
                    ⭐ {product?.average_rating} (
                    {product?.rating_count} reviews)
                  </span>
                  <span>| Stock: {product?.stock}</span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <label className="font-medium text-gray-700">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    max={product?.stock || 1}
                    onChange={(e) =>
                      setQuantity(
                        Math.min(
                          product?.stock || 1,
                          Math.max(1, Number(e.target.value))
                        )
                      )
                    }
                    className="w-20 border border-indigo-200 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <p className="text-lg font-semibold text-gray-800">
                  Total: ₹
                  {(quantity * parseFloat(product.price)).toFixed(2)}
                </p>

                <button
                  onClick={handleOrder}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow hover:opacity-90 transition"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-indigo-100">
              <h2 className="text-xl font-bold mb-4">Cart Items</h2>
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between py-3"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₹{item.price * item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-lg font-bold mt-4">
                Total: ₹{totalAmount.toFixed(2)}
              </p>

              <button
                onClick={handleOrder}
                className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow hover:opacity-90 transition"
              >
                Confirm Order
              </button>
            </div>
          )}
        </div>

        {/* Address Modal */}
        {showAddressForm && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg transform transition-all scale-95 animate-fade-in">
              <h2 className="text-2xl font-bold mb-4 text-indigo-600">
                Shipping Address
              </h2>
              <form className="grid grid-cols-2 gap-4">
                {[
                  ["receivername", "Receiver Name"],
                  ["mobile_no", "Mobile Number"],
                  ["address_line1", "Address Line 1"],
                  ["address_line2", "Address Line 2 (Optional)"],
                  ["city", "City"],
                  ["state", "State"],
                  ["postal_code", "Postal Code"],
                  ["country", "Country"],
                ].map(([name, placeholder], idx) => (
                  <input
                    key={idx}
                    type="text"
                    name={name}
                    placeholder={placeholder}
                    value={address[name]}
                    onChange={handleChange}
                    className={`border border-indigo-200 rounded-lg px-3 py-2 col-span-2 ${
                      ["city", "state", "postal_code", "country"].includes(
                        name
                      )
                        ? "col-span-1"
                        : ""
                    } focus:ring-2 focus:ring-orange-400`}
                  />
                ))}
              </form>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handlePayNow}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow hover:opacity-90 transition"
                >
                  Pay Now
                </button>
                <button
                  onClick={() => {
                    setShowAddressForm(false);
                    setAddress({
                      receivername: "",
                      mobile_no: "",
                      address_line1: "",
                      address_line2: "",
                      city: "",
                      state: "",
                      postal_code: "",
                      country: "",
                    });
                  }}
                  className="flex-1 py-3 rounded-2xl bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in { from { opacity:0; transform:scale(0.95);} to { opacity:1; transform:scale(1);} }
        .animate-fade-in { animation: fade-in 0.25s ease-out; }
      `}</style>
    </>
  );
};

export default Checkout;
