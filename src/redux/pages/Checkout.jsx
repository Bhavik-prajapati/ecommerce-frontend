import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../../Components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import api from "../../store/api";

const Checkout = () => {
  const { items } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const location = useLocation();
  const { type, product } = location.state || { type: "cart", product: null };

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
    .get("/api/shipping")
    .then((res) => {
      console.log("Shipping API Response:", res.data); // 👈 check this
      setAddresses(Array.isArray(res.data) ? res.data : []); // force array
    })
    .catch((err) => console.error("Fetch addresses error:", err));
}, [token]);


  const handleAddNewAddress = async () => {
    try {
      const res = await api.post("shipping", newAddress);
      setAddresses((prev) => [...prev, res.data.address]);
      setUseNew(false);
      setSelectedAddress(res.data.address.id);
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

    // ✅ Here you would call your /api/orders
    // axios.post("/api/orders", { items: checkoutItems, shippingAddress }, { headers: { Authorization: `Bearer ${token}` } });

    alert("Order placed successfully!");
    navigate("/orders");
  };

  const cartTotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <>
      <Header />
      <div style={{ display: "flex", padding: "20px", gap: "40px" }}>
        {/* Left Side - Address */}
        <div style={{ flex: 2 }}>
          <h2>Checkout</h2>
          <h3>Select Address</h3>

          {addresses.map((addr) => (
            <div key={addr.id} style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="radio"
                  name="address"
                  value={addr.id}
                  checked={selectedAddress === addr.id && !useNew}
                  onChange={() => {
                    setSelectedAddress(addr.id);
                    setUseNew(false);
                  }}
                />
                {addr.address_line1}, {addr.address_line2}, {addr.city},{" "}
                {addr.state}, {addr.postal_code}, {addr.country}
              </label>
            </div>
          ))}

          <div style={{ marginTop: "20px" }}>
            <label>
              <input
                type="radio"
                name="address"
                checked={useNew}
                onChange={() => setUseNew(true)}
              />
              Use New Address
            </label>
          </div>

          {useNew && (
            <form style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
              <input
                type="text"
                placeholder="Address Line 1"
                value={newAddress.address_line1}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address_line1: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Address Line 2"
                value={newAddress.address_line2}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address_line2: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={newAddress.postal_code}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, postal_code: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, country: e.target.value })
                }
              />

              <button
                type="button"
                onClick={handleAddNewAddress}
                style={{
                  padding: "8px 16px",
                  background: "blue",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Save Address
              </button>
            </form>
          )}

          <button
            onClick={handlePlaceOrder}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Place Order
          </button>
        </div>

        {/* Right Side - Order Summary */}
        <div style={{ flex: 1, background: "#f9f9f9", padding: "20px", borderRadius: "8px" }}>
          <h3>Order Summary</h3>
          {checkoutItems.map((item) => (
            <p key={item.id}>
              {item.name} × {item.quantity || 1} = ₹{item.price * (item.quantity || 1)}
            </p>
          ))}
          <h3>Total: ₹{cartTotal}</h3>
        </div>
      </div>
    </>
  );
};

export default Checkout;
