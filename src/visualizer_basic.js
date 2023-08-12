import { beginSpotifyPolling } from "./spotifyQuery";
import { star_loop_uri } from "./star_loop";
import { getUserData } from "./userData";

console.log("starting players_basic.js");

const { accessToken, refreshToken } = getUserData();

if (!accessToken) {
  console.log("No accessToken found");
  const baseURL = window.location.href.toString().split("/visualizers/basic")[0];
  console.log(`baseURL: ${baseURL}`);

  const redirectTo = baseURL + "/";
  console.log(`redirecting to: ${redirectTo}`);

  console.log("exiting login.js");
  window.location.replace(redirectTo);
}

if (!refreshToken) {
  console.log("No refreshToken found");
  const baseURL = window.location.href.toString().split("/visualizers/basic")[0];
  console.log(`baseURL: ${baseURL}`);

  const redirectTo = baseURL + "/";
  console.log(`redirecting to: ${redirectTo}`);

  console.log("exiting login.js");
  window.location.replace(redirectTo);
}

// Add star loop video
const videoSource = document.createElement("source");
videoSource.setAttribute("type", "video/webm");
videoSource.setAttribute("crossOrigin", "anonymous");
videoSource.setAttribute("src", `${star_loop_uri}`);
const videoPlayer = document.getElementById("video-player");
videoPlayer.appendChild(videoSource);

console.log(
  `signed into players_basic with accessToken: ${accessToken}\n and refreshToken: ${refreshToken}`,
);

beginSpotifyPolling(accessToken, refreshToken);

console.log("leaving players_basic.js");
