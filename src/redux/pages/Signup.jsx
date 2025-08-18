import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signupUser } from "../../store/authSlice";
import { toast } from "react-toastify";


const Signup = () => {

    const {user,loading,error}=useSelector(state=>state.auth.signup);
    const dispatch=useDispatch();


    const [formdata,setFormdata]=useState({
        name:"",
        email:"",
        password:""
    });
    const handleChange=(e)=>{
        setFormdata({...formdata,[e.target.name]:e.target.value});
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
      dispatch(signupUser(formdata)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
          toast.success("Signup successful 🎉");
      }else{
          toast.warning(res.payload);
      }
    });
    }

  return (
    <div>
    <h1>Signup</h1>
    <p> {error ? error :""}</p>
        <form onSubmit={handleSubmit}>
        <input name="name" value={formdata.name} onChange={handleChange}/>
        <br/>
        <input name="email" value={formdata.email} onChange={handleChange}/>
        <br/>
        <input name="password" value={formdata.password} onChange={handleChange}/>
        <br/>

        <button type="submit">Signup</button>
    </form>

          <p>
        Already have an account{" "}
        <Link to="/login">Login here</Link>
      </p>


    </div>
  )
}

export default Signup