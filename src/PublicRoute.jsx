import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';

const PublicRoute = ({children}) => {
 const userData=useSelector((state)=>state.userDetails.data);
 if(userData){
    return <Navigate to="/dashboard" replace/>
 }
  return children;
}

export default PublicRoute
