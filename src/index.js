import { star_loop_uri } from "./star_loop.js";
import { getUserData } from "./userData.js";
import { signOutUser } from "./signOut.js";

console.log("starting index.js");

// Add star loop video
const videoSource = document.createElement("source");
videoSource.setAttribute("type", "video/webm");
videoSource.setAttribute("crossOrigin", "anonymous");
// videoSource.setAttribute("src", `${star_loop_uri}`);
videoSource.setAttribute("src", "./assets/star_loop_10x.webm");
const videoVisualizer = document.getElementById("video-player");
videoVisualizer.appendChild(videoSource);

// check localStorage for userData
const { accessToken, displayName } = getUserData();

if (!accessToken) {
  const newSignIn = document.querySelector(".new-sign-in");
  newSignIn.style.display = "block";
  newSignIn.innerHTML = `
      <a class="focusable" tabindex="0" href="https://avt-sv-api-16ae49589f38.herokuapp.com/api/login">
      Sign a new user into <span class="new-sign-in__spotify">Spotify</span></a>
    `;
}

// check if they're signed in
if (accessToken) {
  console.log(`signed in with accessToken: ${accessToken}`);

  // NOTE: this baseURL ends with a / because there's nothing to split on.
  const basicVisualizerURL = window.location.href.toString() + "visualizers/basic";

  const visualizerLink = document.querySelector(".go-to-visualizer");
  visualizerLink.style.display = "block";
  visualizerLink.innerHTML = `
      <a class="focusable" tabindex="0" href="${basicVisualizerURL}">Go to ${displayName}'s <span class="go-to-visualizer__visualizer focusable">Visualizer</span></a>
    `;

  const signOutUserElement = document.querySelector(".sign-out-user");
  signOutUserElement.style.display = "block";
  signOutUserElement.innerHTML = `
      <button class="sign-out-button focusable" id="sign-out-button" tabindex="0">Sign Out ${displayName} from this device</button>
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
