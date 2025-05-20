import React, { useEffect, useState } from 'react'
import './coursedescription.css'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CourseData } from '../../context/CourseContext';
import { server } from '../../main';
import { UserData } from '../../context/UserContext';
import axios from 'axios';
import Loading from '../../components/loading/Loading';

const CourseDescription = ({user}) => {
    const params = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const {fetchUser } = UserData();
    const {fetchCourse , course ,fetchCourses, fetchMyCourse} = CourseData();


        useEffect(()=>{
            fetchCourse(params.id)
        },[]);
        const checkoutHandler = async () => {
          // Check if the user is logged in
          const token = localStorage.getItem("token");
          if (!token) {
            // Handle case where the user is not logged in
            toast.error("Please log in to proceed.");
            return;
          }
        
          setLoading(true);
        
          try {
            // If you want to skip payment and just navigate to the study page
            // Directly call the navigation to the course study page
            await fetchCourse(params.id);  // Ensure course is fetched first
            navigate(`/course/study/${params.id}`);  // Navigate to the study page directly
            
            // Optionally, you can fetch user, courses, and myCourses here if needed
            await fetchUser();
            await fetchCourses();
            await fetchMyCourse();
        
            setLoading(false);
          } catch (error) {
            toast.error("An error occurred while redirecting to the course.");
            setLoading(false);
          }
        };
        
        // const checkoutHandler = async()=>{
        //     const token = localStorage.getItem("token");
        //     setLoading(false); // true ka false by Ad
        //     const {
        //         data:{order},
        //     } = await axios.post(`${server}/api/course/checkout/${params.id}`,{},{
        //         headers:{token,

        //         },
        //     });
        //     const options = {
        //         key: "rzp_test_yOMeMyaj2wlvTt", // Enter the Key ID generated from the Dashboard
        //         amount: order.id, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        //         currency: "INR",
        //         name: "E learning", //your business name
        //         description: "Learn with us",
        //         order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          
        //         handler: async function (response) {
        //           const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        //             response;
          
        //           try {
        //             const { data } = await axios.post(
        //               `${server}/api/verification/${params.id}`,
        //               {
        //                 razorpay_order_id,
        //                 razorpay_payment_id,
        //                 razorpay_signature,
        //               },
        //               {
        //                 headers: {
        //                   token,
        //                 },
        //               }
        //             );
          
        //             await fetchUser();
        //             await fetchCourses();
        //             await fetchMyCourse();
        //             toast.success(data.message);
        //             setLoading(false);
        //             navigate(`/payment-success/${razorpay_payment_id}`);
        //           } catch (error) {
        //             toast.error(error.response.data.message);
        //             setLoading(false);
        //           }
        //         },
        //         theme: {
        //           color: "#8a4baf",
        //         },
        //       }; 
        //       const razorpay = new window.Razorpay(option);
        //       razorpay.open();
        // } 
        return (
            <>
              {loading ? (
                <Loading />
              ) : (
                <>
                  {course && (
                    <div className="course-description">
                      <div className="course-header">
                        <img
                          src={`${server}/${course.image}`}
                          alt=""
                          className="course-image"
                        />
                        <div className="course-info">
                          <h2>{course.title}</h2>
                          <p>Instructor: {course.createdBy}</p>
                          <p>Duration: {course.duration} weeks</p>
                        </div>
                      </div>
        
                      <p>{course.description}</p>
        
                      <p>Let's get started with course At ₹{course.price}</p>
        
                      {user && user.subscription.includes(course._id) ? (
                        <button
                          onClick={() => navigate(`/course/study/${course._id}`)}
                          className="common-btn"
                        >
                          Study
                        </button>
                      ) : (
                        <button onClick={checkoutHandler} className="common-btn">
                          Start
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          );
        };
        
        export default CourseDescription;