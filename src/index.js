import Cookies from "js-cookie";
import { star_loop_uri } from "./star_loop.js";

console.log("starting index.js");

const accessToken = Cookies.get("accessToken");
const displayName = Cookies.get("displayName");
// const sign_in = document.querySelector(".sign-in");

// Add star loop video
const videoSource = document.createElement("source");
videoSource.setAttribute("type", "video/webm");
videoSource.setAttribute("crossOrigin", "anonymous");
videoSource.setAttribute("src", `${star_loop_uri}`);
const videoPlayer = document.getElementById("video-player");
videoPlayer.appendChild(videoSource);


// check if they're signed in
if (accessToken && displayName) {
  console.log(`signed in with accessToken: ${accessToken}`);
  const baseURL = window.location.toString();
  // NOTE: this baseURL ends with a / because there's nothing to split on.
  const redirectTo = baseURL + "players/basic";
  console.log(`redirectTo: ${redirectTo}`);
  // window.location.replace(redirectTo);


  const playerLink = document.querySelector(".go-to-player");
  playerLink.style.display = "block";
  playerLink.innerHTML = `
      <a href="${redirectTo}">Go to ${displayName}'s <span class=go-to-player__player>Player</span></a>
`;
}

console.log("exiting index.js");
