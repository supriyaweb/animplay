import React, { useState, useEffect } from 'react';
import './Admin.css';
import { Route, Routes, NavLink, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AdminData, Sign_Out } from '../../Redux/AllSlices/AuthSlice';
import { BiAddToQueue } from "react-icons/bi";
import { HiMiniViewfinderCircle } from "react-icons/hi2";
import { TbLogout } from "react-icons/tb";
import { FaHamsa } from "react-icons/fa6";

import Add from '../AllProduct/AddProduct/Add'
import View from '../AllProduct/ViewProduct/View';
import Detail from '../AllProduct/DetailProduct/Detail';
import Edit from '../AllProduct/EditProduct/Edit';



const Admin = () => {


  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { first_name, last_name, email, profile_pic } = useSelector((state) => state.auth);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const location = useLocation();


  useEffect(() => {
    dispatch(AdminData());
  }, [dispatch]);


  useEffect(() => {
    // Hide the welcome message if the URL path is not /admin
    if (location.pathname !== '/admin') {
      setShowWelcomeMessage(false);
    }
  }, [location.pathname]);


  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };



    const handleSignOut = () => {
        // Clear token and email from localStorage
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('email');
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('email');

    dispatch(Sign_Out());
    // dispatch(logoutAction());
    alert("Hi, You are Logged Out Now");

    // navigate("/sign-in");
    // Redirect to "/sign-in" after sign-out
    window.location.href = '/sign-in';

    };




  return (
    <div>
      <div className={`admin-panel ${isSidebarVisible ? '' : 'sidebar-collapsed'}`}>

        <div className="sidebar">
          <div className="main-content" style={{marginTop: "50px"}}></div>
          <div className="sidebar-toggle" onClick={toggleSidebar}>
            <div className="hamburger-icon"> <FaHamsa/> </div>
          </div>

          <div className="sidebar_in">
            <div className="profile-info">
              <img src={profile_pic} alt="profile_pic" />
              <h1>{first_name} {last_name}</h1>
              <p>{email}</p>
            </div>

            <div className="sidebar_link">
              <NavLink exact to="/admin/add" activeClassName="active" onClick={() => setShowWelcomeMessage(false)}>
                <BiAddToQueue style={{ position: 'absolute', left: '10px', top: '15px' }} /> Add Product
              </NavLink>
            </div>
            <div className="sidebar_link">
              <NavLink exact to="/admin/view" activeClassName="active" onClick={() => setShowWelcomeMessage(false)}>
                <HiMiniViewfinderCircle style={{ position: 'absolute', left: '10px', top: '15px' }} /> View Product
              </NavLink>
            </div>
            <div className="sidebar_link">
              <Link exact activeClassName="active" onClick={handleSignOut}>
                <TbLogout style={{ position: 'absolute', left: '10px', top: '15px' }} /> Admin Logout
              </Link>
            </div>

          </div>
        </div>

        <div className="content">
          {showWelcomeMessage && (
            <div className='greet'>
              <h2>Hi, {first_name}</h2>
              <p>You are Welcome to the Admin Panel</p>
            </div>
          )}
          <div className="main-content" style={{marginTop: "50px"}}></div>

          <Routes>
            <Route path="add" element={<Add />} />
            <Route path="view" element={<View />} />
            <Route path="view/detail/:id/:sid" element={<Detail />} />
            <Route path="edit/:id/:eid" element={<Edit />} />
          </Routes>

        </div>
      </div>
    </div>
  );
}

export default Admin;
