import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../store/authSlice";
import { toast } from "react-toastify";
import { ShoppingBag, User, Mail, Lock, UserPlus } from "lucide-react";

const Signup = () => {
  const { error, loading } = useSelector((state) => state.auth.signup);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Show toast loader
    const toastId = toast.loading("Signing up...");

    dispatch(signupUser(formdata)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.update(toastId, {
          render: "Signup successful 🎉",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        navigate("/login"); // redirect to login after signup
      } else {
        toast.update(toastId, {
          render: res.payload || "Signup failed",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Left Branding Section */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-orange-600 to-rose-600 text-white p-10">
          <ShoppingBag size={60} className="mb-6" />
          <h2 className="text-3xl font-extrabold mb-2">ShopEase</h2>
          <p className="text-lg text-white/90 text-center">
            Join thousands of happy shoppers ✨ <br />
            Create your free account today and unlock exclusive deals!
          </p>
        </div>

        {/* Right Signup Form */}
        <div className="p-10">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Create Your Account
          </h1>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center font-medium">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                value={formdata.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90 active:scale-95 transition duration-200 disabled:opacity-50"
            >
              <UserPlus size={20}/> {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-orange-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
