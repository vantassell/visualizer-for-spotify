import Cookies from "jscookie";
import { queryParamsIntoCookies } from "./queryCheck.js";
console.log("starting main.js");

queryParamsIntoCookies();

const accessToken = Cookies.get("accessToken");

// check if they're signed in
if (accessToken) {
  const title = "temp dev title";
  const artist = "temp dev artist";
  const album = "temp dev album";
  const artworkURL =
    "https://i.scdn.co/image/ab67616d0000b2738f82a5c1d701d71ba554e220";

  console.log(`signed in with accessToken: ${accessToken}`);
  document.querySelector(".sign-in").remove();
  document.querySelector(".trackInfo").innerHTML = `
      <p>Track: ${title}</p>
      <p>Artist: ${artist}</p>
      <p>Album: ${album}</p>
  `;

  document.querySelector(".artworkContainer").innerHTML = `
     <img
         class=artwork
         src=${artworkURL}
         alt="album art"
         imageRendering="optimizeQuality"
     />
  `;

  // <div className={styles.container}>
  // </div>

  // Interval(() => {
  //   console.log("internval!");
  // }, 1000);
} else {
  console.log("no accessToken found");
}
console.log("exiting main.js");
