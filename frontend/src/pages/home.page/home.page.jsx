import React from "react";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import "./home.page.css";
import Navbar from "../../components/nav.component/nav.component";

function HomePage() {

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
