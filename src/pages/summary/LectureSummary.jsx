import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../main"; // Ensure this is correctly pointing to your server
import toast from "react-hot-toast";

const LectureSummary = ({ lectureId }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch lecture summary
  const fetchSummary = async () => {
    setLoading(true);
    setError(""); // Reset error message
    try {
      // Use the correct lectureId here in the URL
      const { data } = await axios.get(`${server}/api/lecture/summary/${lectureId}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setSummary(data.summary);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch summary. Please try again.");
      setLoading(false);
      console.error("Error fetching summary:", err);
    }
  };

  // Trigger the summary fetching when the component loads
  useEffect(() => {
    if (lectureId) {
      fetchSummary();
    }
  }, [lectureId]);

  return (
    <div className="summary-container">
      {loading ? (
        <p>Loading summary...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : summary ? (
        <div>
          <h3>Lecture Summary</h3>
          <p>{summary}</p>
        </div>
      ) : (
        <p>No summary available yet.</p>
      )}
    </div>
  );
};

export default LectureSummary;
