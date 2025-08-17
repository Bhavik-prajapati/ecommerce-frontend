import { Provider } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Dashboard from "./redux/pages/Dashboard"
import Login from "./redux/pages/Login"
import Signup from "./redux/pages/Signup"
import ProtectedRoute from "./Components/ProtectedRoute"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard/> </ProtectedRoute>}/>
        <Route path="*" element={<p>error...</p>} />
      </Routes>
    </BrowserRouter>
  )
}
export default App