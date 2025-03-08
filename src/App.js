import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Toaster} from "react-hot-toast"
import {jwtDecode} from "jwt-decode"

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from "../src/Components/Home"
import Event from "../src/Components/Event"
import Admin from "../src/Components/Admin"
import Events from "../src/Components/Events"
import Contact from "../src/Components/contactus"
import IdeaHub from './Components/IdeaHub';
import Login from './Components/login';
import Signup from './Components/Regsistor';
import Hub from './Components/IdeaAdmin'
import axios from 'axios';
import EnrollNow from './Components/EnrollNow';

function App() {

  setInterval(async() => {
    try {
      const response = await axios.get('https://iic-backend-lcp6.onrender.com/login');
    } catch (error) {
      console.error('Error fetching ideas', error);
    } 
  }, 1500000);

  // console.log(localStorage.getItem("token").split("//"))

  if (localStorage.getItem("token") && localStorage.getItem("token").split("//")[1]=="true") {
    localStorage.removeItem("token")
  }

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
  
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
        // console.log(currentTime)
      if (decoded.exp < currentTime) {
        console.log("Token expired! Logging out...");
        localStorage.removeItem("token");
      }
    }
  };

  checkTokenExpiration();

  return (
    <>
    <BrowserRouter>
    <div className='page-container d-flex' style={{flexDirection:"column",minHeight:"100vh"}} >
        <Navbar/>
        <main className='content' style={{flex:1}}>
        <Routes>
          <Route path="/" element={<Home/>} extact></Route>
          <Route path="/events" element={<Event/>} extact></Route>
          <Route path="/idea-sub" element={<IdeaHub/>} extact></Route>
          <Route path="event/:id" element={<Events/>} extact></Route>
          <Route path="/admin" element={<Admin/>} extact></Route>
          <Route path="/contact" element={<Contact/>} extact></Route>
          <Route path="/login" element={<Login/>} extact></Route>
          <Route path="/signup" element={<Signup/>} extact></Route>
          <Route path="/adminidea" element={<Hub/>} extact></Route>
          <Route path="/enrollnow/:id" element={<EnrollNow/>} extact></Route>
         </Routes>
        </main>
    </div>
      <Footer/>
      <Toaster/>
      </BrowserRouter>
      </>
  );
}

export default App;
