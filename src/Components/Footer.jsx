import React from "react";
import "../CSS/Footer.css";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaChevronRight,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  // Scroll to About Us section on Home page
  const goToAbout = () => {
    navigate("/");
    setTimeout(() => {
      const section = document.querySelector(".justified-text");
      section?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <footer className="iic-footer">
      <div className="footer-container">

        {/* Quick Links */}
        <div className="footer-column">
          <h4>Quick Link</h4>
          <ul>
            <li className="footer-link" onClick={goToAbout}>
              <FaChevronRight /> About Us
            </li>

            <li className="footer-link">
              <FaChevronRight />
              <Link to="/Pastevents">Past Events</Link>
            </li>

            <li className="footer-link">
              <FaChevronRight />
              <a href="/hackspark/HackSpark.html">HackSpark-2.0</a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h4>Contact</h4>

          <p>
            <FaMapMarkerAlt />
            ZSCT's Thakur Shyamnarayan Engineering College, <br />
            Thakur Complex, Kandivali (E), Mumbai - 400101
          </p>

          <p>
            <FaPhoneAlt /> Dr. Nirmala Kamble (IIC President): +91 98208 68441
          </p>

          <p>
            <FaPhoneAlt />Ms. Smita Dandge (IIC Vice President): +91 98333 12233
          </p>

          <p>
            <FaEnvelope /> iic@tsecmumbai.in
          </p>

          <div className="footer-social">
            {/* <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
              <FaFacebookF />
            </a> */}
            <a href="https://www.instagram.com/tseciic?igsh=cng5NWM4ZjBoOHEw/" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/in/tsec-iic-422593317/" target="_blank" rel="noreferrer">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="footer-column">
          <h4>How to Reach Us</h4>
          <div className="footer-map">
            <iframe
              title="TSEC Location"
              src="https://www.google.com/maps?q=Thakur%20Shyamnarayan%20Engineering%20College&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>

      {/* Bottom strip */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Institution&apos;s Innovation Council – TSEC.
        All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
