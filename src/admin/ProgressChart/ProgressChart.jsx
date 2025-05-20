import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { server } from "../../main";

const COLORS = ["#0088FE", "#FF8042"];

const ProgressChart = () => {
  const [progressStats, setProgressStats] = useState({ completed: 0, inProgress: 0 });

  useEffect(() => {
    async function fetchProgressStats() {
      try {
        const { data } = await axios.get(`${server}/api/progress-stats`, {
          headers: { token: localStorage.getItem("token") },
        });
        setProgressStats(data);
      } catch (error) {
        console.error("Error fetching progress stats:", error);
      }
    }
    fetchProgressStats();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Course Progress Tracking</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={[
            { name: "Completed", value: progressStats.completed },
            { name: "In Progress", value: progressStats.inProgress },
          ]}
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label
        >
          <Cell key="Completed" fill={COLORS[0]} />
          <Cell key="In Progress" fill={COLORS[1]} />
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ProgressChart;
