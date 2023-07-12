import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import LogIn from "./components/login";
import { useCookies } from "react-cookie";
import BasicPlayer from "./components/basicPlayer";

const getHashParams = () => {
  const hashParams = {};
  let e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.search.substring(1);

  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }

  return hashParams;
};

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["name"]);

  const { accessToken, refreshToken, expiresAt, email, displayName } =
    getHashParams();

  if (accessToken && !cookies.accessToken) {
    setCookie("accessToken", accessToken, { path: "/" });
    console.log(`set accessToken: ${accessToken}`);
  }
  if (refreshToken && !cookies.refreshToken) {
    setCookie("refreshToken", refreshToken, { path: "/" });
    console.log(`set refreshToken: ${refreshToken}`);
  }
  if (expiresAt && !cookies.expiresAt) {
    setCookie("expiresAt", expiresAt, { path: "/" });
    console.log(`set expiresAt: ${expiresAt}`);
  }
  if (email && !cookies.email) {
    setCookie("email", email, { path: "/" });
    console.log(`set email: ${email}`);
  }
  if (displayName && !cookies.displayName) {
    setCookie("displayName", displayName, { path: "/" });
    console.log(`set displayName: ${displayName}`);
  }

  if (accessToken || refreshToken || expiresAt || email || displayName) {
    window.location.replace("http://localhost:3000");
  }

  return (
    <div>
      <Routes>
        <Route
          exact
          path="/"
          element={!cookies.accessToken ? <LogIn /> : <BasicPlayer />}
        />
        {/*<Route path="/player" element={<BasicPlayer />} />*/}
        {/*<Route exact path="/" element={<RecordList />} />*/}
        {/*<Route path="/edit/:id" element={<Edit />} />*/}
        {/*<Route path="/create" element={<Create />} />*/}
      </Routes>
    </div>
  );
};

export default App;
