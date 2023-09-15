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
videoVisualizer.load();

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
  const basicVisualizerURL =
    window.location.href.toString() + "visualizers/basic";

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

// add key listeners for 4-way button on lg remote
// 37: left
// 38: up
// 39: right
// 40: down
// 13: center-click
document.addEventListener("keydown", function (inEvent) {
  if (
    inEvent.keyCode === 37 ||
    inEvent.keyCode === 38 ||
    inEvent.keyCode === 39 ||
    inEvent.keyCode === 40
  ) {
    console.log("--- direction pressed ---");
    nextFocus();
  }

  if (inEvent.keyCode === 13) {
    // console.log("---center click2--");
    // simulateKeyDown(9);
  }
  // var message = "keycode is " + inEvent.keyCode;
  // console.log(message);
});

function nextFocus() {
  let elementNodes = document.querySelectorAll(".focusable");
  let elementSlice = Array.prototype.slice.call(elementNodes);

  elementSlice.sort(function (a, b) {
    if (a === b) return 0;
    if (a.compareDocumentPosition(b) & 2) {
      // b comes before a
      return 1;
    }
    return -1;
  });
  let focusIdx = 0;

  for (let i = 0; i < elementSlice.length; i++) {
    if (elementSlice[i].hasFocus()) {
      focusIdx = i;
    }
  }
  elementSlice[focusIdx].focus();
  // elementSlice[0].focus();
  // let focusNext = false;
  // elementSlice.forEach((element) => {
  //   if (element.hasFocus) {
  //     console.log("this element has focus");
  //   }
  //   console.log(element);
  //   element.focus();
  // });
}

function simulateKeyDown(key) {
  console.log("simulateKeyDown with: " + key);
  const event = new KeyboardEvent("keydown", { key });
  document.dispatchEvent(event);
}

function focusNextElement() {
  //add all elements we want to include in our selection
  var focussableElements =
    'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
  // if (document.activeElement && document.activeElement.form) {
  var focussable = Array.prototype.filter.call(
    document.querySelectorAll(focussableElements),
    function (element) {
      //check for visibility while always include the current activeElement
      return (
        element.offsetWidth > 0 ||
        element.offsetHeight > 0 ||
        element === document.activeElement
      );
    },
  );
  console.log("number of focusable elements is: " + focussable.length);
  var index = focussable.indexOf(document.activeElement);
  console.log("index of focused element: " + index);
  if (index > -1) {
    var nextElement = focussable[index + 1] || focussable[0];
    nextElement.focus();
  }
  // }
}

console.log("exiting index.js");
