import React, { useState } from "react";
import "../CSS/Navbar.css";
import { Link, Navigate, useNavigate,useLocation} from "react-router-dom";
import iiclogo from "../Images/IIC logo.png";
import AICTClogo from "../Images/AICTC logo.png";
import Innovationlogo from "../Images/innovation cell logo.png";
import TpolyLogo from "../Images/Tpoly logo.png";
import IICM from "../Images/IICM logo.png";
import TsecLogo from "../Images/TsecLogo.png"
import Moe from "../Images/Moe.jpg"
import { Modal } from "react-bootstrap";
import Login from "./login";
import toast from "react-hot-toast";
import { useEffect } from "react";
import {jwtDecode} from "jwt-decode"

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showLoginPopup, setshowLoginPopup] = useState(false);
  const [pathName,setPathName]=useState("/")

  var p=useLocation().pathname
  useEffect(()=>{
    setPathName(p)
  })

  const Navigate = useNavigate();
  // console.log(useLocation())

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  
    const decoded = localStorage.getItem("token")?jwtDecode(localStorage.getItem("token")):" "


  return (
    <div>
      <div
        className="d-flex justify-content-center images mt-2"
        style={{ flexWrap: "wrap" }}
      >
        <a href="https://www.tpolymumbai.in/">
          <img
            className="img3"
            src={TpolyLogo}
            alt="Logo"
            style={{ width: "100px" }}
          />
        </a>
        <a href="https://mic.gov.in/">
          <img
            className="img2"
            src={Innovationlogo}
            alt="Logo"
            style={{ width: "180px" }}
          />
        </a>
        <a href="https://www.aicte-india.org/">
          <img
            className="img1"
            src={AICTClogo}
            alt="Logo"
            style={{ width: "80px" }}
          />
        </a>
        <a href="https://iic.mic.gov.in/">
          <img
            className="img4"
            src={IICM}
            alt="Logo"
            style={{ width: "140px" }}
          />
        </a>
        <a href="https://iic.mic.gov.in/">
          <img
            className="img4"
            src={Moe}
            alt="Logo"
            style={{ width: "140px" }}
          />
        </a>
        <a href="https://tsecmumbai.in">
          <img
            className="img4"
            src={TsecLogo}
            alt="Logo"
            style={{ width: "85px" }}
          />
        </a>
      </div>

      <nav className="navbar">
        <div onClick={() => Navigate("/")}>
          <img
            src={iiclogo}
            style={{ width: "50px", height: "50px", cursor: "pointer" }}
          />
        </div>
        <ul className="navbar-nav">
          <li>
            <Link to="/" style={{color:`${pathName=='/'?"red":"white"}`}}>Home</Link>
          </li>
          <li>
            <Link to="/events" style={{color:`${pathName=='/events'?"red":"white"}`}}>Events</Link>
          </li>
          <li>
            <Link to="/Pastevents" style={{color:`${pathName=='/Pastevents'?"red":"white"}`}}>PastEvents</Link>
          </li>

          {localStorage.getItem("token") ? (
            <li>
              <Link to="/idea-sub" style={{color:`${pathName=='/idea-sub'?"red":"white"}`}}>Idea hub</Link>
            </li>
          ) : null}
          {decoded && decoded.isAdmin ? (
            <li>
              <Link to="/admin" style={{color:`${pathName=='/admin'?"red":"white"}`}}>Admin portal</Link>
            </li>
          ) : null}
        </ul>
        {!localStorage.getItem("token") ? (
          <button
            onClick={() => setshowLoginPopup(true)}
            className="login-button"
          >
            Login
          </button>
        ) : (
          <button
            className="login-button"
            onClick={() => {
              localStorage.removeItem("token");
              toast.success("Logout Sucessfull!!");
              Navigate("/");
            }}
          >
            Logout
          </button>
        )}
        {/* <Link to="/login" className="login-button">Login</Link> */}
        <div className="menu-icon" onClick={toggleDropdown}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </nav>
      <Modal
        show={dropdownVisible}
        className="d-flex justify-content-center align-items-center modal-custom"
      >
        <Modal.Header
          closeButton
          onClick={() => setDropdownVisible(false)}
        ></Modal.Header>
        <Modal.Body className="px-5 py-2 rounded modal-body-custom">
          <ul
            className="navbar-nav2 list-unstyled text-center"
            style={{ padding: "10px" }}
          >
            <li
              className="nav-item-custom"
              onClick={() => setDropdownVisible(false)}
            >
              <Link to="/">Home</Link>
            </li>
            <li
              className="nav-item-custom"
              onClick={() => setDropdownVisible(false)}
            >
              <Link to="/events">Events</Link>
            </li>
            <li
              className="nav-item-custom"
              onClick={() => setDropdownVisible(false)}
            >
              <Link to="/Pastevents">PastEvents</Link>
            </li>
            {localStorage.getItem("token") ? (
              <li
                className="nav-item-custom"
                onClick={() => setDropdownVisible(false)}
              >
                <Link to="/idea-sub">Idea hub</Link>
              </li>
            ) : null}
            {decoded && decoded.isAdmin ? (
              <li
                className="nav-item-custom"
                onClick={() => setDropdownVisible(false)}
              >
                <Link to="/admin">Admin portal</Link>
              </li>
            ) : null}
            <li className="nav-item-custom">
              <div>
                {!localStorage.getItem("token") ? (
                  <button
                    onClick={() => {
                      setshowLoginPopup(true);
                      setDropdownVisible(false);
                    }}
                    className="btn logi-button-custom"
                  >
                    Login
                  </button>
                ) : (
                  <button
                    className="btn logi-button-custom"
                    onClick={() => {
                      localStorage.removeItem("token");
                      toast.success("Logout Successful!!");
                      Navigate("/");
                    }}
                  >
                    Logout
                  </button>
                )}
              </div>
            </li>
          </ul>
        </Modal.Body>
      </Modal>

      <Modal className="loginPopUp" show={showLoginPopup}>
        <div>
          <Modal.Header
            className="py-1 pt-2"
            closeButton
            onClick={() => setshowLoginPopup(false)}
          >
            <h2>Login</h2>
          </Modal.Header>
          <Modal.Body>
            <Login />
          </Modal.Body>
        </div>
      </Modal>
    </div>
  );
}

export default Navbar;
