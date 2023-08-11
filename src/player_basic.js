import { beginSpotifyPolling } from "./spotifyQuery";
import { star_loop_uri } from "./star_loop";
import { getUserData } from "./userData";

console.log("starting players_basic.js");

const { accessToken, refreshToken } = getUserData();

if (!accessToken) {
  console.log("No accessToken found");
  window.location.replace("/");
}

if (!refreshToken) {
  console.log("No refreshToken found");
  window.location.replace("/");
}

// Add star loop video
const videoSource = document.createElement("source");
videoSource.setAttribute("type", "video/webm");
videoSource.setAttribute("crossOrigin", "anonymous");
videoSource.setAttribute("src", `${star_loop_uri}`);
const videoPlayer = document.getElementById("video-player");
videoPlayer.appendChild(videoSource);
// const videoSource = document.getElementById("video-source");
// videoSource.setAttribute("src", `${star_loop_uri}`);


console.log(
  `signed into players_basic with accessToken: ${accessToken}\n and refreshToken: ${refreshToken}`,
);

// const sign_out = document.getElementById("sign-out");
// if (sign_out) {
//   sign_out.addEventListener("click", () => {
//     console.log("signout clicked");
//     signOut();
//   });
// }

beginSpotifyPolling(accessToken, refreshToken);

console.log("leaving players_basic.js");
