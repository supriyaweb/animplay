import React, {useState} from 'react'
import './SignIn.css'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from "react-router-dom";
import { Sign_In } from '../../Redux/AllSlices/AuthSlice';


const SignIn = () => {

    const {isLoading, status}=useSelector(state=> state.auth)  //createSlice name
    console.log("UseSelector inPost :", isLoading, status);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    let [user, setUser]=useState({
        mail:"", pwd:""
    });

    let changeHandler=(event)=>{
        event.persist();
        let{name,value}= event.target;
        setUser({...user, [name]:value})
    }


    let submitHandler=(event)=>{
        event.preventDefault();
        console.log("Data submit :", user)

    let formData = new FormData();  // don't need if we use same api used names in input name
        formData.append("email", user.mail);
        formData.append("password", user.pwd);

        dispatch(Sign_In(formData))
        .then((res) => {
            console.log("status now: ", res.payload.status);
      
            if (res.payload.status === 200) {
              // Redirect based on whether it's an admin or not
              if (res.payload.data.email === 'adminsupriya@gmail.com') {
                navigate("/admin", { replace: true });
              } else {
                navigate("/anim-list", { replace: true });
                // Reload the page if it's in the else block
                window.location.reload();
              }
            } else {
              document.getElementById("loginForm").reset();
            }
        })
        .catch((err) => {
            document.getElementById("loginForm").reset();
        });
    }


    // const authToken = localStorage.getItem("token");
    // console.log("Token data :", authToken);
    // // Redirect logic based on the authenticated state
    // if (authToken !== 0) {
    //     navigate('/your-profile'); // Redirect to the profile page
    // }



  return (
    <div className='wrap-login'>
    <div className='wrap-register'>
      <div className='wrapper'>
        <div className='wrap_form'>
          <div className='card_form'>
            <h1 className='card_title'>Login Yourself</h1>
            <p className='card_title-info'>Animplay Unlimited</p>

            <form action='' onSubmit={submitHandler} id="loginForm">

                <div className='my_input'>
                    <input  className='input_field' type="email" name="mail" id="" placeholder='Your Email' onChange={changeHandler} required/> <br />
                </div>

                <div className='my_input'>
                    <input  className='input_field' type="password" name="pwd" id="" placeholder='Your Password' onChange={changeHandler} required/> <br />
                </div>

                <input  className='card_button' type="submit" value="LogIn" />

            </form>
            <div className='card_info'>
                <p>Not registered? &nbsp;
                  <Link to="/sign-up" >Create An Account</Link>
                </p>
            </div>
            {/* {authenticated && authenticated===true? <Navigate to="/your-profile"></Navigate>: null} */}
            {/* {authToken && authToken !==0 ? <Navigate to="/your-profile"></Navigate>: null} */}
            {/* {status && status ===200 ? <Navigate to="/your-profile"></Navigate>: null} */}
            </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default SignIn
