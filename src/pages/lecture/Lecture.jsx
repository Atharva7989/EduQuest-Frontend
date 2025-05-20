import React, { useEffect, useState } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { MdDelete } from "react-icons/md";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState({});
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [summary, setSummary] = useState(""); 
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(true);

  const fetchLectures = async () => {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLectures(data.lectures);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchLecture = async (id) => {
    console.log("Fetching lecture with id:", id);
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLecture(data.lecture);
      setLecLoading(false);

      // Fetch summary for the lecture (API call or AI-based logic)
      const summaryData = await axios.get(`${server}/api/lecture/summary/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
       console.log("Fetched summary:", summaryData.data.summary);
      setSummary(summaryData.data.summary); // Set the summary
    } catch (error) {
      setLecLoading(false);
    }
  };

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setVideo(file);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);

    try {
      const { data } = await axios.post(
        `${server}/api/course/${params.id}`,
        myForm,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      toast.success(data.message);
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setVideo("");
      setVideoPrev("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      try {
        const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
          headers: { token: localStorage.getItem("token") },
        });

        toast.success(data.message);
        fetchLectures();

        if (lecture._id === id) {
          setLecture({});
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete lecture");
      }
    }
  };

  const [completed, setCompleted] = useState("");
  const [completedLec, setCompletedLec] = useState("");
  const [lectLength, setLectLength] = useState("");
  const [progress, setProgress] = useState([]);

  const fetchProgress = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/user/progress?course=${params.id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setCompleted(data.courseProgressPercentage);
      setCompletedLec(data.completedLectures);
      setLectLength(data.allLectures);
      setProgress(data.progress);
    } catch (error) {
      console.log(error);
    }
  };

  const addProgress = async (id) => {
    try {
      const { data } = await axios.post(
        `${server}/api/user/progress?course=${params.id}&lectureId=${id}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      fetchProgress();
    } catch (error) {
      console.log(error);
    }
  };

  const generateCertificate = async () => {
    try {
      const { data } = await axios.get(`${server}/api/user/certificate?course=${params.id}`, {
        headers: { token: localStorage.getItem("token") },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "certificate.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate certificate.");
    }
  };


  useEffect(() => {
    fetchLectures();
    fetchProgress();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="progress">
            Lecture completed - {completedLec} out of {lectLength} <br />
            <progress value={completed} max={100}></progress> {Math.round(completed)} %
          </div>

          <div className="lecture-page">
            <div className="left">
              {lecLoading ? (
                <Loading />
              ) : lecture.video ? (
                <video
                  src={lecture.video}
                  width="100%"
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  disableRemotePlayback
                  autoPlay
                  onEnded={() => addProgress(lecture._id)}
                ></video>
              ) : (
                <h1>Please Select a Lecture</h1>
              )}
            </div>

            <div className="right">
              {user && user.role === "admin" && (
                <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                  <button className="common-btn" onClick={() => setShow(!show)}>
                    {show ? "Close" : "Add Lecture +"}
                  </button>
                </div>
              )}

              {show && (
                <div className="lecture-form">
                  <h2>Add Lecture</h2>
                  <form onSubmit={submitHandler}>
                    <label htmlFor="text">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />

                    <label htmlFor="text">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />

                    <input type="file" onChange={changeVideoHandler} required />
                    {videoPrev && <video src={videoPrev} width={300} controls></video>}

                    <button disabled={btnLoading} type="submit" className="common-btn">
                      {btnLoading ? "Please Wait..." : "Add"}
                    </button>
                  </form>
                </div>
              )}

{summary && (
              <div className="lecture-summary">
                <h3>Lecture Summary</h3>
                <p>{summary}</p>
              </div>
            )}


              {lectures.map((e, i) => (
                <div
                  key={e._id}
                  className={`lecture-number ${lecture._id === e._id ? "active" : ""}`}
                  onClick={() => fetchLecture(e._id)}
                >
                  {i + 1}. {e.title}
                  {user?.role === "admin" && (
                    <MdDelete
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteHandler(e._id);
                      }}
                      className="delete-icon"
                    />
                  )}
                </div>
              ))}



          {user?.role === "admin" || completed === 100 && (
            <div className="assessment-section">
              <button
                className="common-btn"
                onClick={() => navigate(`/course/${params.id}/quiz`)}
              >
                Take Assessment
              </button>
            </div>
          )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Lecture;
