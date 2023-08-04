import { beginSpotifyPolling, signOut } from "./spotifyQuery";

console.log("starting players_basic.js");

const accessToken = Cookies.get("accessToken");

if (!accessToken) {
  window.location.replace("/");
}

const sign_out = document.getElementById("sign-out");

// Add star loop video
// const videoSource = document.createElement("source");
// videoSource.setAttribute("type", "video/webm");
// videoSource.setAttribute("crossOrigin", "anonymous");
// videoSource.setAttribute("src", `${star_loop_uri}`);
// const videoPlayer = document.getElementById("video-player");
// videoPlayer.appendChild(videoSource);
const videoSource = document.getElementById("video-source");
videoSource.setAttribute("src", `${star_loop_uri}`);

console.log(`signed into players_basic with accessToken: ${accessToken}`);


if (sign_out) {
  sign_out.addEventListener("click", () => {
    console.log("signout clicked");
    signOut();
  });
}
beginSpotifyPolling();

console.log("leaving players_basic.js");
