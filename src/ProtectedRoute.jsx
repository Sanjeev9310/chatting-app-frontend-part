import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';

const ProtectedRoute = ({children}) => {
  const userData=useSelector((state)=>state.userDetails.data);
  if(userData){
    return children;
  }
  return <Navigate to="/login" replace/>
}

export default ProtectedRoute
