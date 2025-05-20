// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import Layout from "../Utils/Layout";
// import { server } from "../../main";

// const CourseEngagement = () => {
//   const [courseStats, setCourseStats] = useState([]);

//   useEffect(() => {
//     const fetchCourseStats = async () => {
//       try {
//         const { data } = await axios.get(`${server}/api/course-enrollment`, {
//           headers: {
//             token: localStorage.getItem("token"),
//           },
//         });
//         setCourseStats(data.courseStats); // Make sure this matches your backend response
//       } catch (error) {
//         console.error("Error fetching course stats:", error);
//       }
//     };

//     fetchCourseStats();
//   }, []);

//   return (
//     <Layout>
//       <h2 className="text-xl font-semibold text-center my-4">Course Engagement</h2>
//       <div className="flex justify-center items-center min-h-[60vh] px-4">
//         {courseStats.length > 0 ? (
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart
//               data={courseStats}
//               margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis allowDecimals={false} />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="enrolled" fill="#82ca9d" name="Enrolled Users" />
//             </BarChart>
//           </ResponsiveContainer>
//         ) : (
//           <p className="text-gray-500 text-lg">No course data available.</p>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default CourseEngagement;
