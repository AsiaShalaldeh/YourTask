import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./nav.component.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");

  useEffect(() => {
    console.log(image)
    setImage(localStorage.getItem("user_image"));
  }, []);

  const handleLogout = async () => {
    try {
      // Make a POST request to the logout endpoint
      await axios.post(
        "http://127.0.0.1:8000/logout/",
        {
          refresh_token: localStorage.getItem("refresh_token"),
        },
        { headers: { "Content-Type": "application/json" } },
        { withCredentials: true }
      );
      localStorage.clear();
      axios.defaults.headers.common["Authorization"] = null;
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <nav>
      <div>
        <img src={process.env.PUBLIC_URL + "/images/logo.svg"} alt="Logo" />
      </div>
      <div>
        {image === "" ? (
          <img
            width={70}
            height={70}
            src={process.env.PUBLIC_URL + "images/profile.jpg"}
            alt="User Profile"
          />
        ) : (
          <img src={image} alt="Profile" />
        )}
      </div>
      <div>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
