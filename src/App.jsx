import React from 'react'
import { BrowserRouter , Routes , Route } from 'react-router-dom';
import './App.css'
import Home from './pages/home/Home';
import Header from './components/header/header'; 
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Verify from './pages/auth/Verify';
import ResetPassword from './pages/auth/resetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import Footer from './components/footer/Footer';
import About from './pages/about/About';
import Account from './pages/account/Account';
import { UserData  } from './context/UserContext';
import Loading from './components/loading/Loading';
import Courses from './pages/courses/Courses';
import CourseDescription from './pages/coursedescription/CourseDescription';
import Lecture from "./pages/lecture/Lecture";
import PaymentSuccess from "./pages/paymentsuccess/PaymentSuccess";
import Dashbord from "./pages/dashbord/Dashbord";
import CourseStudy from "./pages/coursestudy/CourseStudy";
import AdminDashboard from './admin/Dashboard/AdminDashboard';
import AdminCourses from './admin/Courses/AdminCourses';
import AddCourseForm from './admin/Courses/AddCourseForm';
import AdminUsers from './admin/Users/AdminUsers';
import AdminQuiz from './pages/quiz/Quiz';
import UserQuiz from './pages/quiz/UserQuiz';


const App = () => {
  const {isAuth , user, loading} = UserData();
  return (  
  <>
 { loading ?(<Loading/> ):(<BrowserRouter>
  <Header is={isAuth}/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/courses" element={<Courses/>} />
      <Route path="/account" element={isAuth?<Account user = {user} />:<Login/>} />
       <Route path="/login" element={isAuth?<Home/>:<Login/>} /> 
      <Route path="/register" element={isAuth?<Home/>:<Register/>} /> 
      <Route path="/verify" element={isAuth?<Home/>:<Verify/>} /> 
      <Route path="/forgot" element={isAuth?<Home/>:<ForgotPassword/>} /> 
      <Route path="/reset-password/:token" element={isAuth?<Home/>:<ResetPassword/>} /> 
      <Route path="/course/:id" element={isAuth?<CourseDescription user={user}/>:<Login/>} /> 
      <Route path="/payment-success/:id" element={isAuth ? <PaymentSuccess user={user} /> : <Login />}/>
      <Route path="/:id/dashboard" element={isAuth ? <Dashbord user={user} /> : <Login />}/>
      <Route path="/course/study/:id" element={isAuth ? <CourseStudy user={user} /> : <Login />}/>
      <Route path="/lectures/:id" element={isAuth ? <Lecture user={user} /> : <Login />}/>
      <Route path="/admin/dashboard" element={isAuth ?  <AdminDashboard user={user}  /> : <Login/>} />
      <Route path="/admin/course" element={isAuth ?  <AdminCourses user={user}  /> : <Login/>} />
      <Route path="/admin/users" element={isAuth ?  <AdminUsers user={user}  /> : <Login/>} />
      <Route path="/quiz" element={isAuth ?  <AdminQuiz/> : <Login/>} />
      <Route path="/course/:id/quiz" element={isAuth ? <UserQuiz /> : <Login />} />
      <Route path="/admin/add-course" element={isAuth ? <AddCourseForm  /> : <Login />} />
     


    </Routes>
    <Footer/>
  </BrowserRouter>)}
  </>
  );
};

export default App