import React, { useState, useEffect } from 'react';
import { MdDashboard } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import "./account.css";
import toast from 'react-hot-toast';
import { UserData } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from "../../main";
import { FaStar } from "react-icons/fa";
const Account = ({ user }) => {
  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const submitted = localStorage.getItem(`feedbackSubmitted_${user._id}`) === 'true';
      setFeedbackSubmitted(submitted);
    }
  }, [user]);

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };

    const submitFeedback = async () => {
      if (!rating) {
        toast.error("Please select a rating.");
        return;
      }

    setIsLoading(true);

    console.log("Submitting feedback:", {
      comments: feedback,
      rating
    });
    try {
      const response = await axios.post(
        `${server}/api/user/feedback`,
        { comments: feedback, rating },
        { headers: { token: localStorage.getItem("token") } }
      );
      console.log('Feedback submitted:', response.data);
      setFeedbackSubmitted(true);
      localStorage.setItem(`feedbackSubmitted_${user._id}`, 'true');
      toast.success("Feedback submitted!");
      setShowFeedbackForm(false);
      setFeedback('');
      setRating(null);
    } catch (error) {
      console.error('Error submitting feedback:', error.response ? error.response.data : error.message);
      if (error.response?.data?.message === "You have already submitted feedback.") {
        toast.error('You have already submitted feedback.');
      } else {
        toast.error('Error submitting feedback.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {user && (
        <div className="profile">
          <h2>My Profile</h2>
          <div className="profile-info">
            <p><strong>Name - {user.name}</strong></p>
            <p><strong>Email - {user.email}</strong></p>

            <button onClick={() => navigate(`/${user._id}/dashboard`)} className='common-btn'>
              <MdDashboard /> Dashboard
            </button>
            <br />

            {user.role === "admin" && (
              <button onClick={() => navigate(`/admin/dashboard`)} className='common-btn'>
                <MdDashboard /> Admin Dashboard
              </button>
            )}

            {user.role !== "admin" && (
              <button
                onClick={() => setShowFeedbackForm(true)}
                className='common-btn'
                disabled={feedbackSubmitted}
                style={{ 
                  opacity: feedbackSubmitted ? 0.6 : 1,
                  cursor: feedbackSubmitted ? 'not-allowed' : 'pointer'
                }}
              >
                {feedbackSubmitted ? 'Feedback Submitted' : 'Give Feedback'}
              </button>
            )}
            <br />

            <button
              onClick={logoutHandler}
              className='common-btn'
              style={{ background: "red" }}
            >
              <IoMdLogOut /> Logout
            </button>
            <br />

            {showFeedbackForm && (
              <div className="feedback-popup">
                <h3>Give Your Feedback</h3>
                
                
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <FaStar
                          key={num}
                          size={30}
                          color={num <= rating ? "#ffc107" : "#e4e5e9"}
                          onClick={() => setRating(num)}
                          style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                        />
                      ))}
                    </div>


                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Enter your feedback here"
                  required
                />

                <button
                
                  onClick={submitFeedback}
                  className='common-btn'
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Feedback'}
                </button>
                <button
                  onClick={() => setShowFeedbackForm(false)}
                  className='common-btn'
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;


// import React, { useState, useEffect } from 'react';
// import { MdDashboard } from "react-icons/md";
// import { IoMdLogOut } from "react-icons/io";
// import "./account.css";
// import toast from 'react-hot-toast';
// import { UserData } from '../../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { server } from "../../main";

// const Account = ({ user }) => {
//   const { setIsAuth, setUser } = UserData();
//   const navigate = useNavigate();

//   const [feedback, setFeedback] = useState('');
//   const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
//   const [showFeedbackForm, setShowFeedbackForm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [rating, setRating] = useState(null);
//   // Check localStorage for feedback flag on load
//   useEffect(() => {
//     if (user) {
//       const submitted = localStorage.getItem(`feedbackSubmitted_${user._id}`) === 'true';
//       setFeedbackSubmitted(submitted);
//     }
//   }, [user]);

//   const logoutHandler = () => {
//     localStorage.clear();
//     setUser([]);
//     setIsAuth(false);
//     toast.success("Logged Out");
//     navigate("/login");
//   };

//   const submitFeedback = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         `${server}/api/user/feedback`,
//         { comments: feedback },
//         { headers: { token: localStorage.getItem("token") } }
//       );
//       console.log('Feedback submitted:', response.data);
//       setFeedbackSubmitted(true);
//       localStorage.setItem(`feedbackSubmitted_${user._id}`, 'true');
//       toast.success("Feedback submitted!");
//       setShowFeedbackForm(false);
//       setFeedback('');
//     } catch (error) {
//       console.error(
//         'Error submitting feedback:',
//         error.response ? error.response.data : error.message
//       );
//       if (error.response?.data?.message === "You have already submitted feedback.") {
//         toast.error('You have already submitted feedback.');
//       } else {
//         toast.error('Error submitting feedback.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       {user && (
//         <div className="profile">
//           <h2>My Profile</h2>
//           <div className="profile-info">
//             <p><strong>Name - {user.name}</strong></p>
//             <p><strong>Email - {user.email}</strong></p>

//             <button onClick={() => navigate(`/${user._id}/dashboard`)} className='common-btn'>
//               <MdDashboard /> Dashboard
//             </button>
//             <br />

//             {user.role === "admin" && (
//               <button onClick={() => navigate(`/admin/dashboard`)} className='common-btn'>
//                 <MdDashboard /> Admin Dashboard
//               </button>
//             )}
//             {/* <br /> */}

//             {user.role !== "admin" && (
//                 <button
//                     onClick={() => setShowFeedbackForm(true)}
//                     className='common-btn'
//                     disabled={feedbackSubmitted}
//                     style={{ 
//                     opacity: feedbackSubmitted ? 0.6 : 1,
//                     cursor: feedbackSubmitted ? 'not-allowed' : 'pointer'
//                     }}
//                 >
//                     {feedbackSubmitted ? 'Feedback Submitted' : 'Give Feedback'}
//                 </button>
//                 )}
//             <br />

//             {/* Logout Button */}
//             <button
//               onClick={logoutHandler}
//               className='common-btn'
//               style={{ background: "red" }}
//             >
//               <IoMdLogOut /> Logout
//             </button>
//             <br />

//             {/* Feedback Form Pop-Up */}
//             {showFeedbackForm && (
//               <div className="feedback-popup">
//                 <h3>Give Your Feedback</h3>
//                 <textarea
//                   value={feedback}
//                   onChange={e => setFeedback(e.target.value)}
//                   placeholder="Enter your feedback here"
//                   required
//                 />
//                 <button
//                   onClick={submitFeedback}
//                   className='common-btn'
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Submitting...' : 'Submit Feedback'}
//                 </button>
//                 <button
//                   onClick={() => setShowFeedbackForm(false)}
//                   className='common-btn'
//                 >
//                   Cancel
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Account;
