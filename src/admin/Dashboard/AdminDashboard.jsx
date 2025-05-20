import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./dashboard.css";

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  const [stats, setStats] = useState({});
  const [userStats, setUserStats] = useState({ students: 0, admins: 0 });

  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      // console.log("User Distribution Response:", userDistribution.data);

      setStats(data.stats);
      setUserStats({
        users: userDistribution.data.students, 
        admins: userDistribution.data.admins,
      });
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="main-content">
        <div className="box">
          <p>Total Courses</p>
          <p>{stats.totalCourses}</p>
        </div>
        <div className="box">
          <p>Total Lectures</p>
          <p>{stats.totalLectures}</p>
        </div>
        <div className="box">
          <p>Total Users</p>
          <p>{stats.totalUsers}</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
