import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from '../Layout/Header/Header'
import Footer from '../Layout/Footer/Footer'
import PNF from '../Layout/PageNotFound/PNF'
import WatchMedia from '../Components/AllMedia/WatchMedia/WatchMedia'
import ViewMedia from '../Components/AllMedia/ViewMedia/ViewMedia'
import About from '../Components/AboutUs/About'
import Contact from '../Components/ContactUs/Contact'
import Home from '../Components/Home/Home'

import Admin from '../Admin/AdminDash/Admin'
// import Add from '../Admin/AllProduct/AddProduct/Add';
// import View from '../Admin/AllProduct/ViewProduct/View'
// import Detail from '../Admin/AllProduct/DetailProduct/Detail'
// import Edit from '../Admin/AllProduct/EditProduct/Edit'

import DetailMedia from '../Components/AllMedia/DetailMedia/DetailMedia'
import DetailMediaUser from '../Components/AllMedia/DetailMedia/DetailMediaUser'
import Review from '../Components/AllMedia/Review/Review'

import Preloader from '../Custom/Preloader/Preloader';
import SignIn from '../Components/Registration/SignIn';
import SignUp from '../Components/Registration/SignUp';
import Profile from '../Components/Registration/Profile';
import ProtectedRoutes from '../ProtectedRoutes/ProtectedRoutes';


const RootRouting = () => {


  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate an asynchronous operation (e.g., fetching data)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);


  return (
    <div>
      <Router>
        <Header/>

        <Routes>
          <Route exact path='' element={isLoading ? <Preloader/> : <Home/>} />

          <Route path='about-us' element={<About/>}/>


          <Route path='sign-up' element={<SignUp/>} />
          <Route path='sign-in' element={<SignIn/>} />
          <Route path='profile' element={<Profile/>} />

          <Route element={<ProtectedRoutes/>}>
            <Route path='anim-list' element={<ViewMedia/>}/>
            <Route path='anim-list/detail-media-user/:id/:dm' element={<DetailMediaUser/>} />
          </Route>

          <Route path='watch-popular' element={<WatchMedia/>} />
          <Route path='detail-media/:id/:dm' element={<DetailMedia/>} />

          <Route path='review/:topic' element={<Review/>} />


          <Route path="/admin/*" element={<Admin />} />
          {/* <Route path='admin' element={<Admin/>} /> */}
          {/* <Route path='admin/add' element={<Add/>} /> */}
          {/* <Route path='admin/view' element={<View/>}  /> */}
          {/* <Route path='view/detail/:id/:sid' element={<Detail/>}  /> */}
          {/* <Route path='edit/:id/:eid' element={<Edit/>} /> */}

          <Route path='contact-us' element={<Contact/>} />

          <Route path='*' element={<PNF/>}  />
        </Routes>

        <Footer/>
      </Router>
    </div>
  )
}

export default RootRouting