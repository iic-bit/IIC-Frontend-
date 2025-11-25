// src/App.js
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode"; // named import — works with current jwt-decode versions
import axios from 'axios';

// Components (consistent relative paths)
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Event from './Components/Event';
import Admin from './Components/Admin';
import Events from './Components/Events';
import Contact from './Components/contactus';
import IdeaHub from './Components/IdeaHub';
import Login from './Components/login';
import Signup from './Components/Regsistor';
import Hub from './Components/IdeaAdmin';
import EnrollNow from './Components/EnrollNow';

// <-- IMPORTANT: import your PastEvents page so /pastevents route works -->
import PastEvents from './pages/PastEvents';

function App() {
  // periodic keep-alive / heartbeat (unchanged)
  setInterval(async () => {
    try {
      await axios.get('https://iic-backend-lcp6.onrender.com/login');
    } catch (error) {
      console.error('Error fetching ideas', error);
    }
  }, 1500000);

  // quick cleanup token flag logic (unchanged)
  if (localStorage.getItem("token") && localStorage.getItem("token").split("//")[1] === "true") {
    localStorage.removeItem("token");
  }

  // token expiry check
  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded && decoded.exp && decoded.exp < currentTime) {
          localStorage.removeItem("token");
        }
      } catch (err) {
        // invalid token — remove it
        localStorage.removeItem("token");
      }
    }
  };
  checkTokenExpiration();

  return (
    <>
      <BrowserRouter>
        <div className='page-container d-flex' style={{ flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          <main className='content' style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Event />} />
              <Route path="/pastevents" element={<PastEvents />} />   {/* <<-- added route */}
              <Route path="/idea-sub" element={<IdeaHub />} />
              <Route path="/event/:id" element={<Events />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/adminidea" element={<Hub />} />
              <Route path="/enrollnow/:id" element={<EnrollNow />} />
            </Routes>
          </main>
        </div>

        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
