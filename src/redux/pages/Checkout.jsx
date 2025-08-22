import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../store/productSlice";
import { useEffect, useState } from "react";
import { createOrder } from "../../store/orderSlice";
import api from "../../store/api";

const Checkout = () => {
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

  const handleOrder = () => {
    setShowAddressForm(true);
  };
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
    alert("⚠️ Please fill in all required address fields.");
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
    alert("❌ Order failed: " + res.payload);
    return;
  }

  const orderId=res.payload.order.id;
  const result = await fetch("http://localhost:5000/api/payment/razorpay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: totalAmount,
      currency: "INR",
      receipt: "order_" + Date.now(),
    }),
  });

  const data = await result.json();
  if (!data.id) {
    alert("❌ Razorpay order creation failed");
    return;
  }

  const isLoaded = await loadRazorpay();
  if (!isLoaded) {
    alert("❌ Razorpay SDK failed to load. Check internet connection.");
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
    alert("✅ Payment successful!");
    try {
      const res = await api.post("payment/updateorderStatus", {
        orderId:orderId,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });

      console.log("Order Updated:", res.data);
    } catch (err) {
      console.error("❌ Failed to update order:", err);
    }
  },
  prefill: {
    name: address.receivername,
    email: "test@example.com",
    contact: address.mobile_no,
  },
  theme: { color: "#3399cc" },
};
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="bg-white rounded-xl shadow-md p-6 flex gap-6 items-start relative z-10">
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
            <p className="text-lg text-indigo-600 font-bold">
              ₹{product?.price}
            </p>

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
                className="w-24 border rounded-lg px-3 py-2 text-center"
              />
            </div>

            <p className="mt-3 text-lg font-semibold text-gray-800">
              Total: ₹
              {product
                ? (quantity * parseFloat(product.price)).toFixed(2)
                : 0}
            </p>

            <button
              onClick={handleOrder}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>

      {showAddressForm && (
        <div className="absolute inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Enter Shipping Address
            </h2>

            <form className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="receivername"
                placeholder="Receiver Name"
                value={address.receivername}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 col-span-2"
                required
              />
              <input
                type="text"
                name="mobile_no"
                placeholder="Mobile Number"
                value={address.mobile_no}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 col-span-2"
                required
              />
              <input
                type="text"
                name="address_line1"
                placeholder="Address Line 1"
                value={address.address_line1}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 col-span-2"
                required
              />
              <input
                type="text"
                name="address_line2"
                placeholder="Address Line 2 (Optional)"
                value={address.address_line2}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 col-span-2"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="text"
                name="postal_code"
                placeholder="Postal Code"
                value={address.postal_code}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={address.country}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
                required
              />
            </form>

            <button
              onClick={handlePayNow}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700"
            >
              Pay Now
            </button>

            <button
              onClick={() => setShowAddressForm(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
