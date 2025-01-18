import React from 'react';
import '../CSS/Footer.css'; // Import the CSS file for styling
import { FaPhoneAlt, FaInstagram, FaEnvelope, FaFacebook, FaTimes,FaLinkedin } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer className="footer mt-5" style={{bottom:"0px"}}>
      <div className="footer-content d-flex justify-content-between flex-wrap">
        <div className="contact-info">
          <div className="contact-item">
            <FaPhoneAlt className="icon" />
            <span>Dhanesh Shetty:- <a href='tel:+918591604650'> +91 8591604650</a></span>
          </div>
          <div className="contact-item">
            <FaEnvelope className="icon" />
            <span><a href='mailto:iic@tpoly.in'>iic@tpoly.in</a></span>
          </div>
        </div>
        <div className="social-media">
          <a href="https://www.instagram.com/tpolyiic/" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="icon" />
          </a>
          <a href="https://www.instagram.com/tpolyiic/" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="icon" />
          </a>
          <a href="https://www.instagram.com/tpolyiic/" target="_blank" rel="noopener noreferrer">
            <FaTimes className="icon" />
          </a>
          <a href="https://www.instagram.com/tpolyiic/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="icon" />
          </a>
        
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
