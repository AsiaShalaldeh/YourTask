import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useInRouterContext, useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import "./home.page.css";
import Navbar from "../../components/nav.component/nav.component";

function HomePage() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");

  useEffect(() => {
    setImage(localStorage.getItem("user_image"));
  }, []);

  return (
    <div className="home-container">
      <Navbar/> 
      <div className="body">
        <h2>
          لا يوجد مهام حتى الآن
          <br /> دعنا نقوم بإضافة مهام جديدة
        </h2>
        <Link to="/tasks" className="link">
          <button className="add-task">
            <FiPlus /> Add Tasks
          </button>
        </Link>
        <div className="image">
          <img src={process.env.PUBLIC_URL + "images/empty.png"} alt="Home" />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
