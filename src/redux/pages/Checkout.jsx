import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "../../Components/Header";
import api from "../../store/api";

const Checkout = () => {
    const location = useLocation();

  const { items } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  
  const { id } = useParams(); 
  const { type, product } = location.state || { type: "cart", product: null };
  console.log(type,product,"------")
  
  const checkoutItems = type === "single" && product ? [{ ...product }] : items;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });
  const [useNew, setUseNew] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    api
      .get("shipping")
      .then((res) => {
        setAddresses(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Fetch addresses error:", err));
  }, [token]);

  const handleAddNewAddress = async () => {
    try {
      const res = await api.post("shipping", newAddress);
      setAddresses((prev) => [...prev, res.data.address]);
      setUseNew(false);
      setSelectedAddress(res.data.address);
    } catch (err) {
      console.error("Add address error:", err);
    }
  };

  const handlePlaceOrder = () => {
    const shippingAddress =
      useNew && newAddress.address_line1
        ? newAddress
        : addresses.find((a) => a.id === selectedAddress);

    console.log("Shipping Address:", shippingAddress);
    console.log("Order Items:", checkoutItems);

    alert("Order placed successfully!");
    navigate("/orders");
  };

  const cartTotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handlePayment = async () => {
    console.log(cartTotal,"cart total...")  
  try {
    // const res = await api.post("payments/create-order", { amount: cartTotal,productid:8 });
    const res = await api.post("/payments/create-order", { 
      amount: cartTotal, 
      currency: "INR", 
      // productid: id 
      productDetails:product,
      type:type,
      selectedAddress
    });

    const { id: order_id, amount } = res.data;
    // 2. Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY, // Razorpay key_id
      amount: amount, // amount in paise
      currency: "INR",
      name: "Your Store Name",
      description: "Order Payment",
      order_id,
      handler: function (response) {
        console.log("Payment Successful", response);
        alert("Payment Successful!");
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#4f46e5",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment error:", err);
    alert("Payment failed!");
  }
};




  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white shadow rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Checkout</h2>
          <h3 className="text-lg font-medium mb-3">Select Address</h3>

          {addresses.map((addr) => (
            <div key={addr.id} className="mb-2 flex items-center gap-2">
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedAddress === addr.id && !useNew}
                onChange={() => {
                  setSelectedAddress(addr);
                  setUseNew(false);
                }}
                className="text-indigo-600"
              />
              <span id className="text-gray-700">
                {addr.address_line1}, {addr.address_line2}, {addr.city},{" "}
                {addr.state}, {addr.postal_code}, {addr.country}
              </span>
            </div>
          ))}

          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="address"
                checked={useNew}
                onChange={() => setUseNew(true)}
                className="text-indigo-600"
              />
              <span className="text-gray-700">Use New Address</span>
            </label>
          </div>

          {useNew && (
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {[
                "address_line1",
                "address_line2",
                "city",
                "state",
                "postal_code",
                "country",
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.replace("_", " ").toUpperCase()}
                  value={newAddress[field]}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, [field]: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ))}

              <button
                type="button"
                onClick={handleAddNewAddress}
                className="col-span-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                Save Address
              </button>
            </form>
          )}

          <button
  onClick={handlePayment}
  disabled={
    (!useNew && !selectedAddress) || 
    (useNew && !newAddress.address_line1)
  }
  className={`mt-6 px-6 py-2 rounded-lg text-white 
    ${(!useNew && !selectedAddress) || (useNew && !newAddress.address_line1)
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
    }`}
>
  Place Order
</button>
        </div>

        {/* Right - Order Summary */}
        <div className="bg-gray-50 shadow rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h3>
          {checkoutItems.map((item) => (
            <p key={item.id} className="text-gray-700 mb-1">
              {item.name} × {item.quantity || 1} = ₹
              {item.price * (item.quantity || 1)}
            </p>
          ))}
          <h3 className="mt-4 text-lg font-bold text-indigo-600">
            Total: ₹{cartTotal}
          </h3>
        </div>
      </div>
    </>
  );
};

export default Checkout;
