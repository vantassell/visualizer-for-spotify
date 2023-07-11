import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import SimpleHome from "./components/basicPlayer";
import LogIn from "./components/login";
import { useCookies } from "react-cookie";
import BasicPlayer from "./components/basicPlayer";

// const [accountToken, setAccountToken] = useState(undefined);
// const [refreshToken, setRefreshToken] = useState(undefined);

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

  // const params = getHashParams();
  const { accessToken, refreshToken, expiresAt, email, displayName } =
    getHashParams();

  if (accessToken) {
    setCookie("accessToken", accessToken, { path: "/" });
    console.log(`set accessToken: ${accessToken}`);
  }
  if (refreshToken) {
    setCookie("refreshToken", refreshToken, { path: "/" });
    console.log(`set refreshToken: ${refreshToken}`);
  }
  if (expiresAt) {
    setCookie("expiresAt", expiresAt, { path: "/" });
    console.log(`set expiresAt: ${expiresAt}`);
  }
  if (email) {
    setCookie("email", email, { path: "/" });
    console.log(`set email: ${email}`);
  }
  if (displayName) {
    setCookie("displayName", displayName, { path: "/" });
    console.log(`set displayName: ${displayName}`);
  }

  return (
    <div>
      <Routes>
        <Route
          exact
          path="/"
          element={!accessToken ? <LogIn /> : <BasicPlayer />}
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
