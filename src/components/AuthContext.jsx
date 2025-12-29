// import React, { Children, useEffect, useState } from 'react'
// import { createContext } from 'react'

// export const AuthContext =createContext();

// export function AuthProvider({children}){
//     const [isAuthenticated,setIsAuthenticated]=useState(false);
//     const [loading,setLoading]=useState(true);

//     useEffect(()=>{
//         const token=localStorage.getItem("refreshToken");
//         if(token) setIsAuthenticated(true);
//         setLoading(false);
//     },[])

//     return (
//         <AuthContext.Provider value={{isAuthenticated,setIsAuthenticated}}>
//            {children}
//         </AuthContext.Provider>
//     )
// } 

