import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./nav.component.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    console.log(image);
    const img = localStorage.getItem("user_image");
    if (img !== null) setImage(img);
  }, []);

  const handleLogout = async () => {
    try {
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
        <div style={{ position: "relative" }} className="profile-container">
          {image === "" ? (
            <img
              className="user-image"
              src={process.env.PUBLIC_URL + "/images/profile.png"}
              alt="User Profile"
              style={{ cursor: "pointer" }}
            />
          ) : (
            <img
              src={image}
              alt="Profile"
              className="user-image"
              style={{ cursor: "pointer" }}
            />
          )}
          <span className="arrow" onClick={() => setShowLogout(!showLogout)}>
            &#11167;
          </span>
          {showLogout && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
                zIndex: 1,
              }}
            >
              <button
                className="logout"
                onClick={handleLogout}
                style={{ padding: "8px 12px" }}
              >
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
