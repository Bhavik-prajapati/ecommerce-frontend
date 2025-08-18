import { Provider } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Dashboard from "./redux/pages/Dashboard"
import Login from "./redux/pages/Login"
import Signup from "./redux/pages/Signup"
import ProtectedRoute from "./Components/ProtectedRoute"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetail from "./redux/pages/ProductDetail"
import Cart from "./redux/pages/Cart"
import Checkout from "./redux/pages/Checkout"


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard/> </ProtectedRoute>}/>
        <Route path="/cart" element={<ProtectedRoute> <Cart/> </ProtectedRoute>}/>
        <Route path="/checkout" element={<ProtectedRoute> <Checkout/> </ProtectedRoute>}/>
        <Route path="*" element={<p>error...</p>} />
      </Routes>

    <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  )
}
export default App