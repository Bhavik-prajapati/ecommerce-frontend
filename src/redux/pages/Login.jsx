import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../store/authSlice";
import { toast } from "react-toastify";
import { ShoppingBag, Mail, Lock, LogIn } from "lucide-react";

const Login = () => {
  const { error, loading } = useSelector((state) => state.auth.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formdata)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Welcome back! 🛍️");
        navigate("/");
      } else {
        toast.warning(res.payload);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-orange-600 to-rose-600 text-white p-10">
          <ShoppingBag size={60} className="mb-6" />
          <h2 className="text-3xl font-extrabold mb-2">ShopEase</h2>
          <p className="text-lg text-white/90 text-center">
            Your one-stop destination for premium shopping.  
            Sign in and grab the best deals today!
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-10">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Sign in to ShopEase
          </h1>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center font-medium">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formdata.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                value={formdata.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90 active:scale-95 transition duration-200 disabled:opacity-50"
            >
              {loading ? "Signing in..." : <> <LogIn size={20}/> Login</>}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-gray-600 mt-6 text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-semibold text-orange-600 hover:underline">
              Signup here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
