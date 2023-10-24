import React from 'react'
import './Footer.css'
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { FaYoutube } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa6";



const Footer = () => {

  return (
    <footer className="footer">

      <Container className="container footer-top">
        <Row className="row gy-4">
          <Col className="footer-about" lg={5} md={12} sm={12} xs={12}>
            <Link to={"/"} className="logo d-flex align-items-center">
              <span>Animplay</span>
            </Link>
            <p>Cras fermentum odio eu feugiat lide par naso tierra. Justo eget nada terra videa magna derita valies darta donna mare fermentum iaculis eu non diam phasellus.</p>
            <div className="social-links d-flex mt-4">
              <Link to={"/"}> <button type="button" className="react-icons btn-ico"> <FaYoutube/> </button> </Link>
              <Link to={"/"}> <button type="button" className="react-icons btn-ico"> <FaInstagram/> </button> </Link>
              <Link to={"/"}> <button type="button" className="react-icons btn-ico"> <FaFacebook/> </button> </Link>
              <Link to={"/"}> <button type="button" className="react-icons btn-ico"> <FaTwitter/> </button> </Link>
            </div>
          </Col>

          <Col className="footer-links" lg={2} md={6} sm={6} xs={12}>
            <h4>Useful Links</h4>
            <ul>
              <Link to={"/"}> Home </Link>
              <Link to={"#"}> About us </Link>
              <Link to={"#"}> Contact us </Link>
            </ul>
          </Col>

          <Col className="footer-links" lg={2} md={6} sm={6} xs={12}>
            <h4>Extra Links</h4>
            <ul>
              <Link to={"#"}> Sign In </Link>
              <Link to={"#"}> Terms of service </Link>
              <Link to={"#"}> Privacy policy </Link>
            </ul>
          </Col>

          <Col className="footer-contact text-center text-md-start" lg={3} md={12} sm={12} xs={12}>
            <h4>Contact Us</h4>
            <p>143 Pakhi Street, Kol- 700002, India</p>
            <p className="mt-4"><strong>Phone:</strong> <span>+91 9889544635</span></p>
            <p><strong>Email:</strong> <span>Supriya@gmail.com</span></p>
          </Col>

        </Row>
      </Container>

      <Container className="container copyright text-center">
        <p>&copy; <span>Copyright</span> <strong className="px-1">Animplay</strong> <span>All Rights Reserved</span></p>
        <div className="credits">
          Designed by <Link to={"#"}>Supriya Adhikary</Link>
        </div>
      </Container>

    </footer>
  )
}

export default Footer