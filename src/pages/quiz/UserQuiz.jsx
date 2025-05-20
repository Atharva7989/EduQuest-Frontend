import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./quiz.css";
import toast from "react-hot-toast";
import { server } from "../../main";
const UserQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  const goToCourse = () => {
    navigate(`/lectures/${id}`); 
  };
  useEffect(() => {
    if (!token) {
      setError("You need to be logged in to take the quiz.");
      return;
    }

    const fetchQuiz = async () => {
      try {
        const { data } = await axios.get(`${server}/api/${id}/quiz`, {
          headers: { token },
        });
    
        if (data.questions.length === 0) {
          setError("Quiz not available for this course.");
          setQuestions([]); // still set it explicitly
        } else {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Could not load the quiz. Please try again later.");
      }
    };
    

    fetchQuiz();
  }, [id, token]);

  const downloadCertificate = async () => {
    try {
      const response = await axios.get(
        `${server}/api/course/${id}/certificate`, 
        {
          headers: { token },
          responseType: "blob",
        }
      );
  
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "certificate.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading certificate:", err);
      toast.error("Failed to download certificate.");
    }
  };
  
  
  
  const handleOptionChange = (questionId, selected) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selected,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer all the questions before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selected]) => ({
        questionId,
        selected,
      }));

      const { data } = await axios.post(
        `${server}/api/${id}/quiz/submit`,
        {
          courseId: id,
          answers: formattedAnswers,
        },
        {
          headers: { token },
        }
      );

      setResult(data);
      if (data.passed) {
        toast.success("You passed the quiz!");
      } else {
        toast.error("You did not pass. Try again.");
      }

      
      if (data.attempts >= 3) {
        setError("You have reached the maximum number of attempts.");
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        console.error("Error submitting quiz:", err);
        setError("There was an error submitting your quiz. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="quiz-container">
      <h2>Quiz</h2>

      {error && error !== "Quiz not available for this course." && (
  <div className="error-message">
    <p>{error}</p>
  </div>
)}

{questions.length === 0 && error === "Quiz not available for this course." ? (
  <>
    <p>{error}</p>
    <button className="certificate-btn" onClick={downloadCertificate}>
      Download Certificate
    </button>
  </>
) : questions.length === 0 ? (
  <p>Loading questions...</p>
) : (

        <>
          {questions.map((q, idx) => (
            <div key={q._id} className="question-block">
              <p>
                <strong>Q{idx + 1}:</strong> {q.question}
              </p>
              {Object.entries(q.options).map(([key, option]) => (
                <label key={key} className="option-label">
                  <input
                    type="radio"
                    name={q._id}
                    value={key}
                    checked={answers[q._id] === key}
                    onChange={() => handleOptionChange(q._id, key)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}

{!result && questions.length > 0 && (
  <button
    className="common-btn"
    onClick={handleSubmit}
    disabled={isSubmitting || result?.attempts >= 3}
  >
    {isSubmitting ? "Submitting..." : "Submit Quiz"}
  </button>
)}


          {result && (
            <div className="result-block">
              <h3>Your Score: {result.score}%</h3>
              {result.passed ? (
                <>
                  <p className="pass">Congratulations! You passed the quiz.</p>
                  <button className="certificate-btn" onClick={downloadCertificate}>
  Download Certificate
</button>


                </>
              ) : (
                <>
                  <p className="fail">Sorry, you didn't pass. Try again.</p>
                  <button className="go-to-course-btn" onClick={goToCourse}>Go to Course</button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserQuiz;
