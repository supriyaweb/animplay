import React,{useState} from 'react'
import './SignUp.css'
import { useDispatch, useSelector } from 'react-redux'
import { Sign_Up } from '../../Redux/AllSlices/AuthSlice';
import { Link, Navigate } from 'react-router-dom';


const SignUp = () => {

    const {isLoading, status}=useSelector(state=> state.auth)  //createSlice name
    console.log("UseSelector inPost :", isLoading, status);

    let dispatch = useDispatch();
    
    let [inputState, setInput]=useState({
        fname:"", lname:"", emails:"", pwd:""
    });

    let [imgState,setImgState]=useState();
    
    let changeHandler=(event)=>{
        event.persist();
        let{name,value}= event.target;
        setInput({...inputState, [name]:value})
    }


    let submitHandler=(event)=>{
        event.preventDefault();
        console.log("Data submit :", inputState)
        console.log("img Data :", imgState);

        let formData = new FormData();
        formData.append("first_name", inputState.fname);
        formData.append("last_name", inputState.lname);
        formData.append("email", inputState.emails);
        formData.append("password", inputState.pwd);
        formData.append("profile_pic", imgState);
        
        dispatch(Sign_Up(formData));
    }


  return (
    <div className='wrap-register'>
      <div className='wrapper'>
        <div className='wrap_form'>
          <div className='card_form'>
            <h1 className='card_title'>Register Yourself</h1>
            <p className='card_title-info'>Explore Top Animplay</p>

            <form action='' className='my_form' onSubmit={submitHandler}>

                <div className='my_input'>
                    <input className='input_field' type="text" name="fname" id="" placeholder='First Name' onChange={changeHandler} required/> <br />
                </div>

                <div className='my_input'>
                    <input className='input_field' type="text" name="lname" id="" placeholder='Last Name' onChange={changeHandler} required/> <br />
                </div>

                <div className='my_input'>
                    <input className='input_field' type="email" name="emails" id="" placeholder='Your Email' onChange={changeHandler} required/> <br />
                </div>

                <div className='my_input'>
                    <input className='input_field' type="password" name="pwd" id="" placeholder='Your Password' onChange={changeHandler} required/> <br />
                </div>

                <div className='my_input'>
                    <input className='input_field loff' type="file" name="pic" id="" onChange={(e)=> setImgState(e.target.files[0])} accept='image/*'/> <br />
                </div>

                <input className='card_button' type="submit" value="Register" />

            </form>
            <div className='card_info'>
                <p>Already registered? &nbsp;
                  <Link to="/sign-in" >Please Login Here</Link>
                </p>
            </div>
            {status && status===200? <Navigate to="/sign-in"></Navigate>:null}
            {/* {status && status===200? <Navigate to="/sign-in"></Navigate>: <p>Registration Error</p>} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp