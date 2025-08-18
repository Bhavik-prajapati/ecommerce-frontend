import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, removeCartItem } from "../../store/cartSlice";
import Header from "../../Components/Header";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleIncrease = (item) => {
    dispatch(updateCartItem({ id: item.id, quantity: item.quantity + 1 }));
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(updateCartItem({ id: item.id, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeCartItem(item.id));
    }
  };

  const handleRemove = (item) => {
    dispatch(removeCartItem(item.id));
  };

  // Buy whole cart
  const handleBuyCart = () => {
    navigate("/checkout", { state: { type: "cart" } });
  };

  // Buy single product
  const handleBuySingle = (item) => {
    navigate("/checkout", { state: { type: "single", product: item } });
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <Header />
      <div style={{ padding: "20px" }}>
        <h2>🛒 Your Cart</h2>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <table border="1" cellPadding="10" cellSpacing="0" width="100%">
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4" }}>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img src={item.image_url} alt={item.name} width="60" />
                  </td>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <button onClick={() => handleDecrease(item)}>-</button>
                    <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                    <button onClick={() => handleIncrease(item)}>+</button>
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <button
                      style={{
                        background: "red",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => handleRemove(item)}
                    >
                      Remove
                    </button>

                    <button
                      onClick={() => handleBuySingle(item)}
                      style={{
                        marginTop: "10px",
                        padding: "10px 20px",
                        background: "green",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Buy Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Cart Total + Checkout Whole Cart */}
        {items.length > 0 && (
          <>
            <h3 style={{ marginTop: "20px" }}>
              Total: ₹{items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
            </h3>
            <button
              onClick={handleBuyCart}
              style={{
                marginTop: "20px",
                padding: "12px 25px",
                background: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Checkout Whole Cart
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
