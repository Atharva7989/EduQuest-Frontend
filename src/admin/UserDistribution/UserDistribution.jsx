import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../main";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Layout from "../Utils/Layout";

const UserDistribution = () => {
  const [userStats, setUserStats] = useState({ students: 0, admins: 0 });

  async function fetchUserStats() {
    try {
      const { data } = await axios.get(`${server}/api/user-distribution`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setUserStats(data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  }

  useEffect(() => {
    fetchUserStats();
  }, []);

  return (
    <Layout>
      <h2 className="text-center text-xl font-semibold my-4" style={{marginLeft:"14px"}}>User Distribution</h2>
      <div className="flex justify-center items-center min-h-[50vh]">
        <PieChart width={400} height={400}>
          <Pie
            data={[
              { name: "Users", value: userStats.students },
              { name: "Admins", value: userStats.admins },
            ]}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label
          >
            <Cell key="Students" fill="#0088FE" />
            <Cell key="Admins" fill="#FF8042" />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </Layout>
  );
};

export default UserDistribution;

