import Cookies from "js-cookie";
import { queryParamsIntoCookies } from "./queryCheck";

console.log("hello from login.js");

queryParamsIntoCookies();

const accessToken = Cookies.get("accessToken");
// const refereshToken = Cookies.get("refreshToken");
// const expiredAt = Cookies.get("expiresAt");
// const email = Cookies.get("email");
const displayName = Cookies.get("displayName");

if (accessToken) {
  document.querySelector(".login-result").innerHTML = `
    Success! Signed in as ${displayName}. Launching your visualizer now!!
  `;

    const currentURL = window.location.toString().replace("login", "players/basic")
    console.log(currentURL);
  setTimeout(() => {
    window.location.replace(currentURL);
  }, 4000);
} else {
  document.querySelector(".login-result").innerHTML = `
    Failed to login, returning to home page.
`;
  setTimeout(() => {
    // window.location.replace("/spotify-visualizer-webapp/");
  }, 2000);
}
