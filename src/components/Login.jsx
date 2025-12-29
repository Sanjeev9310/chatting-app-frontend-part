import { Link } from 'react-router'
import { useContext, useState } from 'react'
import axios from "axios"
import {useNavigate} from "react-router-dom";
import "./login.css"
import { useRef } from 'react';
import { backendUrl } from '../constantApi.js';
// import { AuthContext } from './AuthContext.jsx';
import { useDispatch } from 'react-redux';
import { loginDetails } from '../redux/userSlice.js';

const Login = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  // const {setIsAuthenticated}=useContext(AuthContext);
  const login=useRef("");
  const [isSubmitting,setIsSubmitting]=useState(false);
  // const [status,setStatus]=useState(false);
  const [loginData,setLoginData]=useState({
     email:"",
     password:""
  })
  const handleChange=(e)=>{
    setLoginData({
      ...loginData,[e.target.id]:e.target.value
  })
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
     login.current.innerText="";
     setIsSubmitting(true);
       try {
        const response=await axios.post(`${backendUrl}/api/v/user/login`,
         loginData,
         {    header:{
                  "Content-Type":"application/json"
              },
             withCredentials:true   
          }
        )
        console.log(response.data.data);
          if(response.data.statusCode===200 || response.data.statusCode===201){
          localStorage.setItem("userinfo",JSON.stringify(response.data.data));
         //  localStorage.setItem("accessToken",JSON.stringify(response.data.accessToken));
          dispatch(loginDetails(response.data.data[0]));
          localStorage.setItem("refreshToken",response?.data?.data[0].refreshToken);
          setIsSubmitting(false)
          // setIsAuthenticated(true);
          navigate("/dashboard");
        }
       else {
             login.current.innerText=response?.data?.message
          }
     }
       catch (error) {
          login.current.innerText=error.response?.data?.message || "unexpected error";
          setIsSubmitting(false)
       }
      }
  return(
    <>
    <div className='login-section'>
     <div className='form'>
        <p className='heading'>Login your details</p>
      <form onSubmit={(e)=>e.key==="Enter"?handleSubmit(e):handleSubmit(e)} className="login-form">
        <div className='form-section'>
           <div>
           <label htmlFor="email">Email</label>
           <input onChange={handleChange} value={loginData.email} type="text" id="email" placeholder='Enter your email address' className='field'/>
           </div>
           <div>
            <label htmlFor="password">Password</label>
            <input  onChange={handleChange} value={loginData.password} type="password" id="password" placeholder='password' className='field'/>
           </div>
           <p ref={login} style={{color:"red"}}></p>
           <button type="submit" className="submit-btn" disabled={isSubmitting}>Submit</button>
          </div>  
       </form> 
           <div className="bottom-text">
             <p>Do you have account? <Link to="/">register</Link></p>
           </div>
      </div>
    </div>
  </>
  )
}

export default Login
