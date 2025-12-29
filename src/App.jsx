import Login from './components/Login.jsx'
// import { createBrowserRouter, RouterProvider} from 'react-router'
import { BrowserRouter,Routes,Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Register from './components/Register.jsx'
import ChatPage from './components/ChatPage.jsx'
import Home from './components/Home.jsx'
import { useEffect } from 'react'
// import MessageModal from './components/MessageModal.jsx'
// import GroupCreationModal from './components/GroupCreationModal.jsx'
// import Navbar from './components/Navbar.jsx'
// import { AuthContext } from './components/AuthContext.jsx'
import { useSelector } from 'react-redux';
import PublicRoute from './PublicRoute.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

// function ProtectedRoute({children}){
//   const {isAuthenticated}=useContext(AuthContext);
//   return isAuthenticated?children:<Navigate to="/login" replace/>
// }
function App() {
  const navigate=useNavigate();
  const location=useLocation();
  const userData=useSelector((state)=>state.userDetails.data)
  const currentChat=useSelector((state)=>state.userDetails.currentChat);
 // const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(()=>{
    console.log(location)
  },[location.pathname])
 
  return(
    <>
     {/* <Home/> */}
     <Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={
          // <PublicRoute>
            <Login/>
          // </PublicRoute>
        }/>
         <Route path="/dashboard" element={
          // <ProtectedRoute>
             <Home/>
          // </ProtectedRoute>
        }/>
      </Routes>  
        { userData!==null?( <Navigate to="/dashboard" replace/>):(<Navigate to="/login" replace/>)}
        {/* <Route path="/dashboard" element={
          <ProtectedRoute>
           
          </ProtectedRoute>
        }/> */}
       {/* <Route path="*" element={<Home/>}/> */}
     
    </>
  )
}

export default App
