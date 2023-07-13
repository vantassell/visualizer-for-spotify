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

  const test = "fuckmylife";
  return (
    <div>
      {/*<a href="http://localhost:8888/api/login">Sign in w/ Spotify</a>*/}
      {/*<a href="https://avt-sv-api-16ae49589f38.herokuapp.com/api/login">*/}
      <a href={`${process.env.REACT_APP_SERVER_DOMAIN}/api/login`}>
        Sign in w/ Spotify
      </a>
    </div>
  );
}
