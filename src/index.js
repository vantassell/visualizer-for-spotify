import { star_loop_uri } from "./star_loop.js";
import { getUserData } from "./userData.js";
import { signOutUser } from "./signOut.js";

console.log("starting index.js");

// Add star loop video
const videoSource = document.createElement("source");
videoSource.setAttribute("type", "video/webm");
videoSource.setAttribute("crossOrigin", "anonymous");
videoSource.setAttribute("src", `${star_loop_uri}`);
const videoPlayer = document.getElementById("video-player");
videoPlayer.appendChild(videoSource);

// check localStorage for userData
const { accessToken, displayName } = getUserData();

// check if they're signed in
if (accessToken && displayName) {
  console.log(`signed in with accessToken: ${accessToken}`);

  // NOTE: this baseURL ends with a / because there's nothing to split on.
  const baseURL = window.location.toString();
  const redirectTo = baseURL + "players/basic";

  const playerLink = document.querySelector(".go-to-player");
  playerLink.style.display = "block";
  playerLink.innerHTML = `
      <a href="${redirectTo}">Go to ${displayName}'s <span class=go-to-player__player>Player</span></a>
    `;

  const signOutUserElement = document.querySelector(".sign-out-user");
  signOutUserElement.style.display = "block";
  signOutUserElement.innerHTML = `
      <button class="sign-out-button" id="sign-out-button">Sign Out ${displayName} from this device</button>
  `;
  const signOutButton = document.getElementById("sign-out-button");
  if (signOutButton) {
    signOutButton.addEventListener("click", () => {
      console.log("signout clicked");
      signOutUser();
      window.location.reload();
    });
  }
}
console.log("exiting index.js");
