import React from 'react'
import './Home.css'
import Recommendation from './Slider/Recommendation'
import JustFilms1 from '../AllMedia/Just/JustFilms1'
import JustFilms2 from '../AllMedia/Just/JustFilms2'
import JustFilms3 from '../AllMedia/Just/JustFilms3'



const Home = () => {
  return (
    <div>
        {/* <div className="main-content" style={{marginTop: "67px"}}></div> */}
        <Recommendation/>

        <JustFilms1/>
        <JustFilms2/>
        <JustFilms3/>
        

    </div>
  )
}

export default Home