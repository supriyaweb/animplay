import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {

    const isAuth = window.localStorage.getItem("token")
    console.log("Value of isAuth: ", isAuth);

  return isAuth ? <Outlet/> : <Navigate to = "/sign-In" />;
}

export default ProtectedRoutes
