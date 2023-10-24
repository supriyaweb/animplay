import React, { useState, useEffect } from 'react';
import './Header.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { AdminData, Sign_Out, viewProfile } from '../../Redux/AllSlices/AuthSlice';
import { FaUserCircle } from "react-icons/fa";
import CustomTooltip from '../../Styles/MuiCustomStyles/CustomTooltip';
import Fade from '@mui/material/Fade';


const Header = () => {

    const [navActive, setNavActive] = useState(false);
      
    const toggleNav = () => {
        setNavActive((prevNavActive) => !prevNavActive);
    }

    const closeNav = () => {
        setNavActive(false);
    }
//----------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------
    const authToken1 = sessionStorage.getItem("token");
    const authemail1 = sessionStorage.getItem("email");
    const authToken2 = localStorage.getItem("token");
    const authemail2 = localStorage.getItem("email");
    console.log("Token data :", authToken1);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignOut = () => {
        // Clear token and email from localStorage
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('email');
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('email');

    dispatch(Sign_Out());
    // dispatch(logoutAction());
    alert("Hi, You are Logged Out Now");
    navigate("/sign-in");
    };

//--------------------------------------------for image user ac and admin panel link---------------------------------------------
    // const authToken1 = useSelector(state => state.auth.authToken1);
    // const authemail1 = useSelector(state => state.auth.authemail1);
    // const authToken2 = useSelector(state => state.auth.authToken2);
    // const authemail2 = useSelector(state => state.auth.authemail2);

    const { profile_pic } = useSelector((state) => state.auth);

    useEffect(() => {
        if (authToken1 && authemail1) {
            
            dispatch(AdminData());
        } else if (authToken2 && authemail2) {
            
            dispatch(viewProfile());
        } else {
            return null; // Or return your regular component content
        }
    }, [dispatch]);






  return (
    <header className={`my-header ${navActive ? 'nav-active' : ''}`}>

            <div className="header-wrapper">
                <div className="logo-wrap">
                    <NavLink to={"/"} className="logos">
                        <span>
                            <img src='../../../../assets/brand/logos.svg' alt='animplaylogo'/>
                        </span>
                        <p> animplay </p>
                    </NavLink>
                </div>
                <div className="nav-but-wrap">
                    <div className="menu-icon" onClick={toggleNav}>
                        <span className="menu-icon_line menu-icon_line-left"></span>
                        <span className="menu-icon_line"></span>
                        <span className="menu-icon_line menu-icon_line-right"></span>
                    </div>
                </div>
            </div>

            <div className={`my-nav ${navActive ? 'nav-active' : ''}  dis-none`}>
                <nav className="nav-content">
                    <ul className="nav-list">
                        <li className="nav-list_item">
                            <NavLink to={"/"}  onClick={closeNav}> Home </NavLink>
                        </li>
                        <li className="nav-list_item">
                            <NavLink to={"/watch-popular"}  onClick={closeNav}> Popular </NavLink>
                        </li>
                        <li className="nav-list_item">
                            <NavLink to={"/anim-list"}  onClick={closeNav}> Animlist </NavLink>
                        </li>
                        
                        <li className="nav-list_item li-off">
                            <span>Unlimited Animplay Movies</span>
                            <span>Unlimited Animplay Movies</span>
                            <NavLink to={"/sign-up"} className="mainbtn"> Join Now </NavLink>
                        </li>



                        <li className="nav-list_item li-off">
                            
                        {(authToken1 && authemail1) && !authToken2 ? (
                            <NavLink to="/admin/*" onClick={closeNav}> 
                            <CustomTooltip title="Admin Panel" placement="bottom" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow>
                                <img src={profile_pic} alt="profile_pic" style={{width:"22px", height:"22px", borderRadius:"20px"}} />
                            </CustomTooltip>
                            </NavLink>
                        ) : null}

                        {(authToken2 && authemail2) && !authToken1 ? (
                            <NavLink to="/sign-in" onClick={handleSignOut}> 
                            <CustomTooltip title="Sign-out" placement="bottom" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow>
                                <img src={profile_pic} alt="profile_pic" style={{width:"22px", height:"22px", borderRadius:"20px"}} />
                            </CustomTooltip>
                            </NavLink>
                        ) : null}

                        {/* Show "Sign-in" only when neither admin nor user is signed in */}
                        {!(authToken1 && authemail1) && !(authToken2 && authemail2) ? (
                            <NavLink to={"/sign-in"} onClick={closeNav}> 
                            <CustomTooltip title="Sign-in" placement="bottom" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow>
                                <FaUserCircle style={{width:"22px", height:"22px"}} />
                            </CustomTooltip>
                            </NavLink>
                        ) : null}

                        </li>



                        {/* <li className="nav-list_item toggle-nav">
                            <NavLink to={"#"}  onClick={closeNav}> Sign In </NavLink>
                        </li> */}
                        
                        <li className="nav-list_item toggle-nav">
                            {(authToken1 && authemail1) || (authToken2 && authemail2) ? (
                                <NavLink onClick={handleSignOut}> Sign-Out </NavLink>
                            ) : (
                                <NavLink to="/sign-in"  onClick={closeNav}> Sign-in </NavLink>
                            )}
                        </li>

                        <li className="nav-list_item toggle-nav">
                            <NavLink to={"/about-us"}  onClick={closeNav}> About Us </NavLink>
                        </li>
                        <li className="nav-list_item toggle-nav">
                            <NavLink to={"/contact-us"}  onClick={closeNav}> Contact Us </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>

    </header>
  )
}

export default Header