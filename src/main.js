import Cookies from "jscookie";
import { queryParamsIntoCookies } from "./queryCheck.js";
import { beginSpotifyPolling } from "./spotifyQuery.js";

console.log("starting main.js");

queryParamsIntoCookies();

const accessToken = Cookies.get("accessToken");

// check if they're signed in
if (accessToken) {
  console.log(`signed in with accessToken: ${accessToken}`);
  const signIn = document.querySelector(".sign-in");
  if (signIn) {
    signIn.remove();
    console.log("sign-in removed!");
  }
  beginSpotifyPolling();
} else {
  console.log("no accessToken found");
}
console.log("exiting main.js");
