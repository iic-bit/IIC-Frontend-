import React from 'react';
import '../CSS/Footer.css'; // Import the CSS file for styling
import { FaPhoneAlt, FaInstagram, FaWhatsapp, FaEnvelope, FaFacebook, FaTwitter } from 'react-icons/fa';
import { FaI, FaX } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="footer mt-5" style={{bottom:"0px"}}>
      <div className="footer-content d-flex justify-content-between">
        <div className="contact-info">
          <div className="contact-item">
            <FaPhoneAlt className="icon" />
            <span><a href='tel:+919665348677'>9665348677</a></span>
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
            <FaTwitter className="icon" />
          </a>
        
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
