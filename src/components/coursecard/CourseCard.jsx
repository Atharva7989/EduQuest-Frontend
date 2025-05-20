import React, { useState } from "react";
import "./courseCard.css";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { CourseData } from "../../context/CourseContext";

const CourseCard = ({ course }) => {
  const { user, isAuth, setUser, fetchUser } = UserData();

  const navigate = useNavigate();
  const { fetchCourses } = CourseData();
  
  //  Add state for button loading
  const [btnLoading, setBtnLoading] = useState(false);

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        const { data } = await axios.delete(`${server}/api/course/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        toast.success(data.message);
        fetchCourses();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  //  Handle course enrollment
  const enrollHandler = async (courseId) => {
    if (btnLoading) return;
    setBtnLoading(true);
  
    try {
      const { data } = await axios.post(
        `${server}/api/enroll/${courseId}`,
        {},
        { headers: { token: localStorage.getItem("token") } }
      );
  
      toast.success(data.message);
      // window.location.reload();
      console.log("Enrollment Success:", data);
      
      console.log("Before setUser:", user);
      
      setUser((prevUser) => {
        console.log("Updating User:", prevUser);
        return {
          ...prevUser,
          subscription: [...prevUser.subscription, courseId],
        };
      });
  
      console.log("After setUser:", user); 
  
    } catch (error) {
      console.error("Error during enrollment:", error);
      toast.error(error.response?.data?.message || "Enrollment failed.");
    }
  
    setBtnLoading(false);
  };

  return (
    <div className="course-card">
      <img src={course.image} alt="Course" className="course-image" />
      <h3>{course.title}</h3>
      <p>Instructor - {course.createdBy}</p>
      <p>Duration - {course.duration} weeks</p>

      {isAuth ? (
        <>
          {user && user.role !== "admin" ? (
            <>
              {user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  Study
                </button>
              ) : (
                <button
                  onClick={() => enrollHandler(course._id)}
                  className="common-btn"
                  disabled={btnLoading} // Disable button when loading
                >
                  {btnLoading ? "Enrolling..." : "Get Started"}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate(`/course/study/${course._id}`)}
              className="common-btn"
            >
              Study
            </button>
          )}
        </>
      ) : (
        <button onClick={() => navigate("/login")} className="common-btn">
          Get Started
        </button>
      )}
      <br />
      {user.role === "admin" && (
        <button
          onClick={() => deleteHandler(course._id)}
          className="common-btn"
          style={{ background: "red" }}
        >
          Delete
        </button>
      )}
    </div>
  );
} ;

export default CourseCard;
