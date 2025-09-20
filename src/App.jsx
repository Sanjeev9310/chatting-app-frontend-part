import Login from './components/Login.jsx'
// import { createBrowserRouter, RouterProvider} from 'react-router'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Register from './components/Register.jsx'
import Chat from './components/Chat.jsx'
// import Chat  from './components/Chat.jsx'


function App() {
  // const router=createBrowserRouter(
  //   [{
  //     path:"/",
  //     element:<Register/>
  //   },
  //   {
  //     path:"/login",
  //     element:<Login/>
  //   },

  // ])
  return(
    <>

      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/chat" element={<Chat/>}/>

      </Routes>
     </BrowserRouter>
  
    
    {/* <RouterProvider router={router}/> */}
    </>
  )
}

export default App
