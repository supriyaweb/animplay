import React from "react";
import HeroSlider, { Slide, Nav } from "hero-slider";
import { FaYoutube } from "react-icons/fa6";
import { Link } from "react-router-dom";
// Images
import "./Recommendation.css";


const Recommendation = () => {


  return (
    <HeroSlider
      height={"100vh"}
      autoplay
      controller={{
        initialSlide: 1,
        slidingDuration: 500,
        slidingDelay: 200,
        onSliding: (nextSlide) =>
          console.debug("onSliding(nextSlide): ", nextSlide),
        onBeforeSliding: (previousSlide, nextSlide) =>
          console.debug(
            "onBeforeSliding(previousSlide, nextSlide): ",
            previousSlide,
            nextSlide
          ),
        onAfterSliding: (nextSlide) =>
          console.debug("onAfterSliding(nextSlide): ", nextSlide)
      }}
    >
      <Slide
        shouldRenderMask
        navDescription="ADP 2022"
        background={{
            backgroundImageSrc: "../../../../assets/lion.jpg",
            backgroundImageStyle: {transform: "scaleX(-1)"},
        }}
      >
        <div className="heroContent  withOverlay">
          <div className="leftContent">
            <h1 className="title">Watch The Lion King</h1>
            <p>"Life's greatest adventure is finding your place in the Circle of Life."</p>
            <div className="buttons">
              <Link to="/">
                <button type="button" className="react-icons mainbtn"> View Details </button>
              </Link>
            </div>
          </div>
        </div>
      </Slide>
      <Slide
        shouldRenderMask
        navDescription="ADP 2022"
        background={{
            backgroundImageSrc: "../../../../assets/punch.webp",
        }}
      >
        <div className="heroContent  withOverlay">
          <div className="leftContent">
            <h1 className="title">Watch One-Punch Man</h1>
            <p>"One-Punch Man is a Japanese animated television series that aired from 2015 to 2019."</p>
            <div className="buttons">
              <Link to="/">
                <button type="button" className="react-icons mainbtn"> View Details </button>
              </Link>
            </div>
          </div>
        </div>
      </Slide>
      <Slide
        shouldRenderMask
        navDescription="ADP 2022"
        background={{
            backgroundImageSrc: "../../../../assets/fight.webp",
            backgroundImageStyle: {transform: "scaleX(-1)"},
        }}
      >
        <div className="heroContent  withOverlay">
          <div className="leftContent">
            <h1 className="title">Watch Street Fighter II</h1>
            <p>"This anime classic follows Ryu, a talented fighter who may be the greatest in all of the world."</p>
            <div className="buttons">
              <Link to="/">
                <button type="button" className="react-icons mainbtn"> View Details </button>
              </Link>
            </div>
          </div>
        </div>
      </Slide>
      <Nav />
    </HeroSlider>
  );
};

export default Recommendation;
