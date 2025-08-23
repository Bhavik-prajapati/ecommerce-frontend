import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../store/productSlice";
import { useEffect, useState } from "react";
import { createOrder } from "../../store/orderSlice";
import api from "../../store/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const Checkout = () => {

  const navigate = useNavigate();


  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const dispatch = useDispatch();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");
  const type = query.get("type");

  const [quantity, setQuantity] = useState(1);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const { product, loading: productLoading, error: productError } = useSelector(
    (state) => state.product
  );
  const { order, loading: orderLoading, error: orderError } = useSelector(
    (state) => state.order
  );

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

  useEffect(() => {
    if (type === "single" && id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id, type]);

  const handleOrder = () => setShowAddressForm(true);

  const handlePayNow = async () => {
    if (
      !address.receivername.trim() ||
      !address.mobile_no.trim() ||
      !address.address_line1.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.postal_code.trim() ||
      !address.country.trim()
    ) {
      toast.error("⚠️ Please fill all required fields");
      return;
    }

    const totalAmount = product ? quantity * parseFloat(product.price) : 0;

    const orderData = {
      productId: id,
      product: product?.name,
      quantity,
      total: totalAmount.toFixed(2),
      shippingAddress: { ...address },
    };

    const res = await dispatch(createOrder(orderData));
    if (res.meta.requestStatus !== "fulfilled") {
      toast.error("❌ Order failed: " + res.payload);
      return;
    }

    const orderId = res.payload.order.id;
 
    const result = await api.post("http://localhost:5000/api/payment/razorpay", {
    amount: totalAmount,
    currency: "INR",
    receipt: "order_" + Date.now(),
  });

    const data = result.data;
    console.log(data,"data.......")

    if (!data.id) {
      toast.error("❌ Razorpay order creation failed");
      return;
    }

    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      toast.error("❌ Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.amount,
      currency: data.currency,
      name: "My Shop",
      description: product?.name,
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
      theme: { color: "#4f46e5" },
    };

    console.log(options,"toption,,,,,,,,,,")
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  if (productLoading || orderLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }
  if (productError || orderError) {
    return (
      <p className="text-center text-red-500 mt-10">
        Error: {productError || orderError}
      </p>
    );
  }
  if (!product) {
    return <p className="text-center mt-10">Product not found.</p>;
  }

  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8">Checkout</h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 flex gap-6 items-start border border-indigo-100">
          {product?.image_url && (
            <img
              src={product.image_url}
              alt={product?.name || "Product"}
              className="w-48 h-48 object-contain rounded-lg border"
            />
          )}

          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              {product?.name}
            </h2>
            <p className="text-gray-600">{product?.description}</p>
            <p className="text-lg text-indigo-600 font-bold">₹{product?.price}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>
                ⭐ {product?.average_rating} ({product?.rating_count} reviews)
              </span>
              <span>| Stock: {product?.stock}</span>
            </div>

            <div className="mt-4">
              <label className="block mb-1 text-gray-700 font-medium">
                Quantity
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
                className="w-24 border border-indigo-200 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <p className="mt-3 text-lg font-semibold text-gray-800">
              Total: ₹
              {product ? (quantity * parseFloat(product.price)).toFixed(2) : 0}
            </p>

            <button
              onClick={handleOrder}
              className="cursor-pointer mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg transform transition-all scale-95 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
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
                  className={`border border-indigo-200 rounded-lg px-3 py-2 col-span-2 ${["city", "state", "postal_code", "country"].includes(name)
                      ? "col-span-1"
                      : ""
                    }`}
                />
              ))}
            </form>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handlePayNow}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 transition cursor-pointer"
              >
                Pay Now
              </button>
              
              <button
  onClick={() => {
    setShowAddressForm(false); // close modal
    setAddress({
      receivername: "",
      mobile_no: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    }); // clear fields
  }}
  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg shadow hover:bg-gray-300 transition cursor-pointer"
>
  Cancel
</button>

            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fade-in { from { opacity:0; transform:scale(0.95);} to { opacity:1; transform:scale(1);} }
        .animate-fade-in { animation: fade-in 0.25s ease-out; }
      `}</style>
    </div>
  );
};

export default Checkout;
