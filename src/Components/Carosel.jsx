import React, { useState, useEffect } from "react";
import "../CSS/Home.css"; // Import the CSS file for styling
import Event from "../Images/Events.png";
const Carosel = () => {
  const images = [`${Event}`];

  const totalImages = images.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalImages]);
  return (
    <div className="">
      <div
        id="carouselExampleIndicators"
        className="carousel slide containe m-3"
      >
        <div className="carousel-indicators">
          {/* <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button> */}
          {images.map((_, index) => (
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to={index}
              className={index === currentIndex ? "active" : ""}
              aria-label={`Slide ${index + 1}`}
              key={index}
            ></button>
          ))}
        </div>
        <div
          className="carousel-inner shadow-lg p-3 mb-5 bg-body roundedd"
          style={{ borderRadius: "20px" }}
        >
          {images.map((element, index) => (
            <>
              <div
                className={`carousel-item ${
                  index === currentIndex ? "active" : ""
                }`}
                key={index}
              >
                <img src={element} className="d-block w-100" alt="..." />
              </div>
            </>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            style={{ backgroundColor: "black", borderRadius: "13px" }}
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            style={{ backgroundColor: "black", borderRadius: "13px" }}
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Carosel;
