import { useState } from "react";
import starsPoster from "./assets/star_loop_frame0.png";
import starsVideoWEBM from "./assets/star_loop_10x.webm";
// import starsVideoMP4 from "./assets/star_loop_10x.mp4";
import "./App.css";
import Dashboard from "./Dashboard.jsx";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <video
        muted
        autoPlay
        loop
        className="video-player"
        id="video-player"
        crossOrigin="anonymous"
        poster={starsPoster}
      >
        <source src={starsVideoWEBM} type="video/webm" />{" "}
      </video>
      <Outlet />
    </>
  );
}

export default App;
