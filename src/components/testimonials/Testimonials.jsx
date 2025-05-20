import React, { useState, useEffect } from "react";
import "./testimonials.css";
import axios from "axios";
import { server } from "../../main"; // Make sure this points to your backend

const Testimonials = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${server}/api/feedback`);
        setFeedbackList(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <section className="testimonials">
      <h2>What our employees say</h2>
      <div className="testimonials-cards">
        {loading ? (
          <p>Loading feedback...</p>
        ) : feedbackList.length === 0 ? (
          <p>No feedback submitted yet.</p>
        ) : (
          feedbackList.map((fb) => (
            <div className="testimonial-card" key={fb._id}>
               <p className="name">— {fb.name} says</p>
              <div className="info">
                <p className="message">"{fb.feedback}"</p>

                {/* Display Rating as Stars */}
                <div className="rating">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      style={{
                        color: index < fb.rating ? "#FFD700" : "#ccc", // Golden stars for rated positions
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Testimonials;
