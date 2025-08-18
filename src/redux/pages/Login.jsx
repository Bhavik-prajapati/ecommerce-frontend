import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../store/authSlice";
import { toast } from "react-toastify";


const Login = () => {
  const { user, error, loading } = useSelector(state => state.auth.login)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    email: "",
    password: ""
  });
  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formdata)).then((res) => {

      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Login successful 🎉");
        navigate("/dashboard");

      } else {
        toast.warning(res.payload);
      }
    });

  }

  return (
    <div>

    
    <h1>Login</h1>
    <p> {error ? error :""}</p>
      <form onSubmit={handleSubmit}>
        <input name="email" value={formdata.email} onChange={handleChange} />
        <br />
        <input name="password" value={formdata.password} onChange={handleChange} />
        <br />

        <button type="submit">Login</button>
      </form>

      <p>
        Don’t have an account?{" "}
        <Link to="/signup">Signup here</Link>
      </p>

    </div>
  )
}

export default Login;