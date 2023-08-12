import { star_loop_uri } from "./star_loop.js";
import { getUserData } from "./userData.js";
import { signOutUser } from "./signOut.js";

console.log("starting index.js");

// Add star loop video
const videoSource = document.createElement("source");
videoSource.setAttribute("type", "video/webm");
videoSource.setAttribute("crossOrigin", "anonymous");
videoSource.setAttribute("src", `${star_loop_uri}`);
const videoVisualizer = document.getElementById("video-player");
videoVisualizer.appendChild(videoSource);

// check localStorage for userData
const { accessToken, displayName } = getUserData();

// check if they're signed in
if (accessToken && displayName) {
  console.log(`signed in with accessToken: ${accessToken}`);

  // NOTE: this baseURL ends with a / because there's nothing to split on.
  const baseURL = window.location.toString();
  const redirectTo = baseURL + "visualizers/basic";

  const visualizerLink = document.querySelector(".go-to-visualizer");
  visualizerLink.style.display = "block";
  visualizerLink.innerHTML = `
      <a href="${redirectTo}">Go to ${displayName}'s <span class=go-to-visualizer__visualizer>Visualizer</span></a>
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
