import React, { JSX } from 'react'
import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom';

const ProtectRoute = ({children}: {children: JSX.Element}) => {

    const {user,loading} = useAuth()

    if(loading) return <div className="flex justify-center items-center my-4">
    <div className="h-6 w-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  </div>;

    if(!user){
        return <Navigate to="/login"></Navigate>
    }

  return children
}

export default ProtectRoute