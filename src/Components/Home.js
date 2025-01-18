import React, { useEffect, useRef, useState } from "react";
import "../CSS/Home.css"; // Import the CSS file for styling
import Carosel from "./Carosel";

const Home = () => {
  const textRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.4, // Trigger when 10% of the element is visible
      }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div class="alert alert-info text-center mb-0 mt-2 animate__animated animate__pulse animate__infinite mx-5" role="alert">
    <span class="">
      Note:- 
    </span> Registration for Fiesta is started.To Enroll <a href="https://fiesta.tpolymumbai.in">Click Here !</a>
  </div>
      <Carosel />
      <div className="mt-3">
        <div className="d-flex justify-content-center fs-3">
          <strong>About Us</strong>
        </div>
        <div
          className={`justified-text container ${isVisible ? "visible" : ""}`}
          ref={textRef}
        >
          The *Institution’s Innovation Council (IIC), established by the **All
          India Council for Technical Education (AICTE)* and the *Ministry of
          Education's Innovation Cell (MIC)*, aims to foster a culture of
          innovation and entrepreneurship in higher education institutions
          (HEIs). It encourages students and faculty to engage in innovative
          thinking, problem-solving, and research activities. By establishing
          IICs in institutions, the goal is to create a dynamic and vibrant
          local ecosystem where innovation can flourish. Through the IIC
          framework, institutions are guided in organizing regular workshops,
          hackathons, and innovation-based competitions that challenge students
          to address real-world problems. These activities help students gain
          practical experience and develop entrepreneurial mindsets, preparing
          them to contribute meaningfully to India's growing innovation
          landscape. Faculty members are also encouraged to mentor and
          collaborate with students, ensuring a supportive environment for
          innovation. In addition, IICs serve as a bridge between academia,
          industry, and government. They facilitate knowledge exchange, provide
          incubation support, and create opportunities for startups to grow and
          scale. By encouraging collaboration and the development of novel
          solutions, IICs aim to produce future-ready graduates who can
          contribute to India's socio-economic development through innovation
          and entrepreneurship.
        </div>
      </div>
    </div>
  );
};

export default Home;
