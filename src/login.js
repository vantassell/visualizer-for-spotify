import Cookies from "js-cookie";
import { queryParamsIntoCookies } from "./queryCheck";

console.log("hello from login.js");

queryParamsIntoCookies();

const accessToken = Cookies.get("accessToken");
const displayName = Cookies.get("displayName");

if (accessToken) {
  // document.querySelector(".login-result").innerHTML = `
  //   Success! Signed in as ${displayName}. Launching your visualizer now!!
  // `;

  const baseURL = window.location.toString().split('/login')[0];
  console.log(`baseURL: ${baseURL}`);

  // setTimeout(() => {
    const redirectTo = baseURL + '/players/basic';
    console.log(`redirecting to: ${redirectTo}`)
    window.location.replace(redirectTo);
  // }, 4000);
} else {
//   document.querySelector(".login-result").innerHTML = `
//     Failed to login, returning to home page.
// `;
//   setTimeout(() => {
    const redirectTo = baseURL + '/';
    console.log(`redirecting to: ${redirectTo}`)
    window.location.replace(redirectTo);
  // }, 2000);
}
