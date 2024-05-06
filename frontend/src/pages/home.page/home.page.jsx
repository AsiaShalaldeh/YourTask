import React from "react";
import { Link } from 'react-router-dom';
import { useInRouterContext, useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import axios from "axios";

function HomePage() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // Make a POST request to the logout endpoint
      await axios.post("http://127.0.0.1:8000/logout/");

      // Redirect to login page after successful logout
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div>
      <nav>
        <div>{/* <img src="/logo.png" alt="Logo" /> */}</div>
        <div>
          {/* <img src="/profile-image.png" alt="Profile" /> */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div>
        {/* Image */}
        {/* <img src="/home.png" alt="Home" /> */}

        <Link to="/tasks">
        <button>
          <FiPlus /> Add Tasks
        </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
