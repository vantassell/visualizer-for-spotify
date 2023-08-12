import { replaceToBeforeSplitToken } from "./navigator";
import { beginSpotifyPolling } from "./spotifyQuery";
import { star_loop_uri } from "./star_loop";
import { getUserData } from "./userData";

console.log("starting players_basic.js");

const { accessToken, refreshToken } = getUserData();

if (!accessToken) {
  console.log("No accessToken found");
  console.log("exiting login.js");
  replaceToBeforeSplitToken("/visualizers/basic");
}

if (!refreshToken) {
  console.log("No refreshToken found");
  console.log("exiting login.js");
  replaceToBeforeSplitToken("/visualizers/basic");
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
