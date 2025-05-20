import React, { useState } from "react";
import "./courses.css";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";

const Courses = () => {
  const { courses } = CourseData();
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  // console.log("All Courses:", courses);

  const categories = ["All", ...new Set(courses.map(course => course.category))];
 
  const filteredCourses = selectedCategory === "All"
    ? courses
    : courses.filter(course => course.category === selectedCategory);
  console.log("Filtered Courses:", filteredCourses);

  return (
    <div className="courses">
      <h2>Available Courses</h2>
      <div className="filter-container">
        <label htmlFor="categoryFilter">Filter by Category
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            console.log("Selected Category:", e.target.value);
          }}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
       </label>
        
      </div>

      {/* Course List */}
      <div className="course-container">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        ) : (
          <p>No Courses Available!</p>
        )}
      </div>
    </div>
  );
};

export default Courses;



// import React from "react";
// import "./courses.css";
// import { CourseData } from "../../context/CourseContext";
// import CourseCard from "../../components/coursecard/CourseCard";

// const Courses = () => {
//   const { courses } = CourseData();

//   console.log(courses);
//   return (
//     <div className="courses">
//       <h2>Available Courses</h2>
       
//       <div className="course-container">
//         {courses && courses.length > 0 ? (
//           courses.map((e) => <CourseCard key={e._id} course={e} />)
//         ) : (
//           <p>No Courses Yet!</p>
//         )}
//         </div>
//     </div>
//   );
// };

// export default Courses;