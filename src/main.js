import Cookies from "js-cookie";
import { queryParamsIntoCookies } from "./queryCheck.js";
import { beginSpotifyPolling, signOut } from "./spotifyQuery.js";
import { star_loop_uri } from "./star_loop.js";

const INITIAL_POLLING_INTERVAL = 1000;
const API_PLAYERS_URL = "https://avt-sv-api-16ae49589f38.herokuapp.com/players";
const LOGGING_LEVEL = 2; // 1 - minimal, 2 - verbose

console.log(`starting main.js with settings\nINITIAL_POLLING_INTERVAL: ${INITIAL_POLLING_INTERVAL}\nAPI_PLAYERS_URL: ${API_PLAYERS_URL}\nLOGGING_LEVEL: ${LOGGING_LEVEL}`);

queryParamsIntoCookies();

const accessToken = Cookies.get("accessToken");

const sign_in = document.querySelector(".sign-in");
const spotifyLogoContainer = document.querySelector(".spotifyLogoContainer");
const sign_out = document.getElementById("sign-out");

const videoSource = document.createElement("source");
// videoSource.setAttribute("src", `${star_loop_uri}`);
videoSource.setAttribute("type", "video/webm");
videoSource.setAttribute('crossOrigin', 'anonymous');
const videoPlayer = document.getElementById("video-player");
videoPlayer.appendChild(videoSource);
videoSource.setAttribute("src", `${star_loop_uri}`);



// <source src="assets/star_loop_10x.webm" type="video/webm"/>
// if (navigator.serviceWorker) {
//   console.log("supports service workers!");
// }
// TODO: display video poster until video has been saved locally_-> Then start the loop

// check if they're signed in
if (accessToken) {
  console.log(`signed in with accessToken: ${accessToken}`);

  if (sign_in) {
    sign_in.style.display = "none";
  }

  if (spotifyLogoContainer) {
    spotifyLogoContainer.style.display = "flex";
  }

  if (sign_out) {
    sign_out.addEventListener("click", () => {
      console.log("signout clicked");
      signOut();
    });
  }

  beginSpotifyPolling();
} else {
  console.log("no accessToken found");

  if (sign_in) {
    sign_in.style.display = "block";
  }
  if (spotifyLogoContainer) {
    spotifyLogoContainer.style.display = "none";
  }
}
console.log("exiting main.js");
