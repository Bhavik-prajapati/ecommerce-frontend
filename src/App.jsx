import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./redux/pages/Dashboard";
import Login from "./redux/pages/Login";
import Signup from "./redux/pages/Signup";
import ProtectedRoute from "./Components/ProtectedRoute";
import ProductDetail from "./redux/pages/ProductDetail";
import Cart from "./redux/pages/Cart";
import Checkout from "./redux/pages/Checkout";
import Profile from "./redux/pages/Profile";
import { ToastContainer } from "react-toastify"; // ✅ only once
import "react-toastify/dist/ReactToastify.css";    // ✅ only once

const App = () => {
  return (
    <BrowserRouter>
      {/* Toast container should be outside Routes */}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
        limit={5}
      />



      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Protected Routes */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
