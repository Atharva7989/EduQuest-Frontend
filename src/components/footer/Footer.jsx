import React from "react";
import "./footer.css";
// import {
//   AiFillFacebook,
//   AiFillTwitterSquare,
//   AiFillInstagram,
// } from "react-icons/ai";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>
          &copy; 2024 Your EduQuest. All rights reserved. <br /> Made by
          <a href=""> G11</a>
        </p>
        {/* <div className="social-links">
          <a href="">
            <AiFillFacebook />
          </a>
          <a href="">
            <AiFillTwitterSquare />
          </a>
          <a href="">
            <AiFillInstagram />
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;