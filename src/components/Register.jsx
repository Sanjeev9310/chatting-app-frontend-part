import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import "./register.css"
import { backendUrl } from "../constantApi.js";

const Register = () => {
  const register=useRef("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate=useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    pic: "",
  });
  const handleChange = async (e) => {
    if (e.target.type === "file") {
      setForm({ ...form, pic: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.id]: e.target.value });
    }
  };
   const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // document.getElementsByClassName("registerbtn").
    try {
       const formData = new FormData();
       formData.append("username", form.username);
       formData.append("email", form.email);
       formData.append("password", form.password);
       formData.append("pic", form.pic);
       const response = await axios.post(
         `${backendUrl}/api/v/user/register`,
         formData,
         {
           header: {
             "content-Type": "multipart/form-data",
           },
           withCredentials:true
         }
       );
      //  if(response.status===200 || response.status===201 ){
        
      if(response.data.statusCode===200 || response.data.statusCode===201){
           console.log(response.data.data);
           setIsSubmitting(false);
           navigate("/login");
        }
    } 
    catch (error) {
      if(error.response && error.response.data){
        //  const p=document.getElementsByClassName("warning")
         register.current.innerText=error.response.data.message;
         setIsSubmitting(false);
        //  setStatus(true);
        }
    }
    
   }
   
  return (
    <div className="register flex flex-col justify-center items-center">
      <h2 className="title">Live Chatting App</h2>
      <div className="form-sectionR">
        <div className="formR">
          <p className="form-headingR">Please fill the form to register</p>
          <form onSubmit={handleSubmit} className="form-inputR">
            <label className="label" htmlFor="username">
              <b>Fullname</b>
            </label>
            <input
              onChange={handleChange}
              value={form.username}
              type="text"
              placeholder="Enter your fullname"
              id="username"
              name="username"
              className="inputR"
              
            />

            <label className="label" htmlFor="email">
              <b>Email</b>
            </label>
            <input
              onChange={handleChange}
              value={form.email}
              type="text"
              placeholder="Enter Email"
              id="email"
              name="email"
              className="inputR"
              
            />

            <label className="label" htmlFor="password">
              <b>Password</b>
            </label>
            <input
              onChange={handleChange}
              value={form.password}
              type="password"
              placeholder="create Password"
              id="password"
              name="password"
              className="inputR"
              
            />

            <label className="label" htmlFor="pic">
              <b>Profile photo</b>
            </label>
            <input onChange={handleChange} type="file" id="pic" name="pic" />
            <p ref={register} style={{color:"red"}}></p>
            <button type="submit" className="registerbtn" disabled={isSubmitting}>
              Register
            </button>
          </form>
          <div>
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      
        
      </div>
    </div>
      
  
)};

export default Register;



     