import React from 'react'
import { NavLink } from "react-router-dom";
import './PNF.css'

const PNF = () => {
  return (
    <div className='pnf-page'>
      <div className="main-content" style={{marginTop: "50px"}}></div>
        <img
          className=""
          src="https://www.pagenotfound.ca/img/404_test_1a.gif"
          alt="404 gif"
        />
      <div>
        <div className='pnf-text'>
          {/* <h2>404</h2> */}
          <h1>UH OH! You're lost.</h1>
          <p>
            The page you are looking for does not exist. How you got here is a
            mystery. But you can click the button below to go back to the
            homepage.
          </p>

          <NavLink to="/">
            <button className='mainbtn'>Go Back to Home</button>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default PNF