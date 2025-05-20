import React from "react";
import "./common.css";
import { Link } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { FaBook, FaUserAlt, FaChartPie, FaEdit } from "react-icons/fa"; // Import Pie Chart icon
import { UserData } from "../../context/UserContext";

const Sidebar = () => {
  const { user } = UserData();
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to={"/admin/dashboard"}>
            <div className="icon">
              <AiFillHome />
            </div>
            <span>Home</span>
          </Link>
        </li>

        <li>
          <Link to={"/admin/course"}>
            <div className="icon">
              <FaBook />
            </div>
            <span>Courses</span>
          </Link>
        </li>

        {user && user.role === "admin" && (
          <>
            <li>
              <a 
                href="https://theharshpatil09.grafana.net/public-dashboards/74607d9f2cbd43c8a0736b602c942b95" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="icon">
                  <FaChartPie />
                </div>
                <span>User Distribution</span>
              </a>
            </li>
          </>
        )}
        {user && user.role === "admin" && (
  <li>
    <Link to={"/admin/add-course"}>
      <div className="icon">
        <FaBook />
      </div>
      <span>Add Course</span>
    </Link>
  </li>
)}
  {user && user.role ==="admin" &&(
        <li>
          <Link to={"/quiz"}>
            <div className="icon">
              <FaEdit />
            </div>
            <span>Add Quiz</span>
          </Link>
        </li>
        )}
        <li>
          <Link to={"/account"}>
            <div className="icon">
              <AiOutlineLogout />
            </div>
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
