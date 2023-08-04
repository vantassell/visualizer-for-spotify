import { INITIAL_POLLING_INTERVAL, API_PLAYERS_URL, LOGGING_LEVEL } from "./globals.js";
import Cookies from "js-cookie";
import { queryParamsIntoCookies } from "./queryCheck.js";
import { beginSpotifyPolling, signOut } from "./spotifyQuery.js";
import { star_loop_uri } from "./star_loop.js";

queryParamsIntoCookies();

const accessToken = Cookies.get("accessToken");

const sign_in = document.querySelector(".sign-in");
const spotifyLogoContainer = document.querySelector(".spotifyLogoContainer");
const sign_out = document.getElementById("sign-out");

// Add star loop video
const videoSource = document.createElement("source");
videoSource.setAttribute("type", "video/webm");
videoSource.setAttribute('crossOrigin', 'anonymous');
videoSource.setAttribute("src", `${star_loop_uri}`);
const videoPlayer = document.getElementById("video-player");
videoPlayer.appendChild(videoSource);


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
