import React, { useEffect } from 'react'
import './Profile.css'

import { useDispatch, useSelector } from 'react-redux';
import { viewProfile } from '../../Redux/AllSlices/AuthSlice';



const Profile = () => {

    const dispatch =useDispatch()

    useSelector(state=>{
      console.log(state);
    })

    const {first_name,last_name,email,profile_pic} = useSelector((state)=>state.auth)
    console.log(first_name, last_name, email, profile_pic)


    useEffect(() => {
        dispatch(viewProfile());
    },[]);


  return (
    <div className='wrap pro_wrap'>
        <div className='add'>
            <h4>Your Profile Info</h4>

            <div className='p_wrap'>
                <div className='p_pic-wrap'>
                    <div className='p_pic'>
                        <img src={profile_pic} alt='profile_pic' />
                    </div>
                </div>
                <div className='p_pic-text'>
                    <div className='txt'>
                        <span> Name :</span>
                        <p> {first_name} {last_name} </p>
                    </div>
                    <br/>
                    <div className='txt txt2'>
                        <span> Email :</span>
                        <p> {email} </p>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Profile