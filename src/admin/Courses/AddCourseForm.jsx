import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import { CourseData } from "../../context/CourseContext";
import Layout from "../Utils/Layout";
import "./addourses.css";


const categories = [
  "Web Development",
  "App Development",
  "Game Development",
  "Data Science",
  "Artificial Intelligence",
  "Other",
];

const AddCourseForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const { fetchCourses } = CourseData();

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("file", image);

    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      await fetchCourses();
      setImage("");
      setTitle("");
      setDescription("");
      setDuration("");
      setImagePrev("");
      setCreatedBy("");
      setPrice("");
      setCategory("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <Layout>
    <div className="add-course">
      <div className="course-form">
        <h2>Add Course</h2>
        <form onSubmit={submitHandler}>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />

          <label>Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

          <label>Created By</label>
          <input type="text" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} required />

          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            {categories.map((e) => (
              <option value={e} key={e}>{e}</option>
            ))}
          </select>

          <label>Duration (in hrs)</label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />

          <label>Course Thumbnail</label>
          <input type="file" required onChange={changeImageHandler} />
          {imagePrev && <img src={imagePrev} alt="Preview" width={300} />}

          <button type="submit" className="common-btn" disabled={btnLoading}>
            {btnLoading ? "Please Wait..." : "Add Course"}
          </button>
        </form>
      </div>
    </div>
    </Layout>
  );
};

export default AddCourseForm;
