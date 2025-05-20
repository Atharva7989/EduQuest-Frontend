import React, { useEffect, useState } from "react";
import axios from "axios";
import './quiz.css';
import toast from "react-hot-toast";
import { server } from "../../main";

const AdminQuiz = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: {
        option1: "",
        option2: "",
        option3: "",
        option4: "",
      },
      correctAnswer: "",
    },
  ]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(`${server}/api/course/all`, {
                      headers: { token: localStorage.getItem("token") },
          });
        setCourses(data.courses); // assuming data has a "courses" field
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleOptionChange = (e, index) => {
    const { name, value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[name] = value;
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (e, index) => {
    const { value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (e, index) => {
    const { value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswer = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: {
          option1: "",
          option2: "",
          option3: "",
          option4: "",
        },
        correctAnswer: "",
      },
    ]);
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      setMessage("Please select a course.");
      return;
    }

    try {
      const { data } = await axios.post(
  `${server}/api/course/${selectedCourse}/quiz`,
  { questions }, 
  {
    headers: {
      token: localStorage.getItem("token"), // or use Authorization: Bearer <token>
    },
  }
);
      
      toast.success(data.message || "Quiz added successfully!");
      setQuestions([
        {
          question: "",
          options: {
            option1: "",
            option2: "",
            option3: "",
            option4: "",
          },
          correctAnswer: "",
        },
      ]); // Reset questions after submission
    } catch (error) {
      toast.error("Error adding quiz: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="admin-quiz-container">
      <h1 className="htag">Add Quiz</h1>
      
      {message && <p>{message}</p>} 
      
      <label>Select a Course:</label>
      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="">-- Choose Course --</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.title}
          </option>
        ))}
      </select>
      
      <form onSubmit={handleQuizSubmit}>
        {questions.map((questionData, index) => (
          <div key={index} className="question-container">
            <div className="form-group">
              <label>Question {index + 1}:</label>
              <textarea
                value={questionData.question}
                onChange={(e) => handleQuestionChange(e, index)}
                placeholder="Enter the question"
                required
              />
            </div>

            <div className="form-group">
              <label>Option 1:</label>
              <input
                type="text"
                name="option1"
                value={questionData.options.option1}
                onChange={(e) => handleOptionChange(e, index)}
                placeholder="Enter option 1"
                required
              />
            </div>
            <div className="form-group">
              <label>Option 2:</label>
              <input
                type="text"
                name="option2"
                value={questionData.options.option2}
                onChange={(e) => handleOptionChange(e, index)}
                placeholder="Enter option 2"
                required
              />
            </div>
            <div className="form-group">
              <label>Option 3:</label>
              <input
                type="text"
                name="option3"
                value={questionData.options.option3}
                onChange={(e) => handleOptionChange(e, index)}
                placeholder="Enter option 3"
                required
              />
            </div>
            <div className="form-group">
              <label>Option 4:</label>
              <input
                type="text"
                name="option4"
                value={questionData.options.option4}
                onChange={(e) => handleOptionChange(e, index)}
                placeholder="Enter option 4"
                required
              />
            </div>

            <div className="form-group">
              <label>Select Correct Answer:</label>
              <select
                value={questionData.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(e, index)}
                required
              >
                <option value="">-- Select Correct Answer --</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
                <option value="option4">Option 4</option>
              </select>
            </div>
          </div>
        ))}

        <button type="button" className="common-btn" onClick={handleAddQuestion}>
          + Add New Question
        </button>
        <br/>
        <br/>
        <button type="submit" className="common-btn">Submit Quiz</button>
      </form>
    </div>
  );
};

export default AdminQuiz;
