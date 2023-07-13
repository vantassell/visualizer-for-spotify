import React, { useEffect, useState } from "react";

export default function Login() {
  // useEffect(() => {
  //   async function getData() {
  //     const response = await fetch(`http://localhost:8888/api/login`);
  //
  //     if (!response.ok) {
  //       const message = `An error occurred: ${response.statusText}`;
  //       window.alert(message);
  //       return;
  //     }
  //
  //     // const data = await response.json();
  //     const data = await response.json();
  //     console.log("ran useEffect");
  //     console.log(data);
  //   }
  //
  //   getData();
  // }, []);

  return (
    <div>
      <a href="http://localhost:8888/api/login">Sign in w/ Spotify</a>
    </div>
  );
}
