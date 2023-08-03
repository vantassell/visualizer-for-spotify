import Cookies from "js-cookie";
import { INITIAL_POLLING_INTERVAL, API_PLAYERS_URL, LOGGING_LEVEL } from "./globals.js";
import { clearCookiesAndResetPath } from "./signOut.js";

let pollingInterval = INITIAL_POLLING_INTERVAL;
let continuePolling = false;
let timeoutID = undefined;

function encodeParamsForQuery(params) {
  var queryString = Object.keys(params)
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");

  return queryString;
}

export async function getCurrentTrackFromSpotify() {
  if (LOGGING_LEVEL === 2) {
    console.log("starting getCurrentTrackFromSpotify");
  }

  const params = {
    accessToken: Cookies.get("accessToken"),
    refreshToken: Cookies.get("refreshToken"),
  };

  const queryParams = encodeParamsForQuery(params);

  const query = `${API_PLAYERS_URL}?${queryParams}`;
  if (LOGGING_LEVEL === 2) {
    console.log(`query: ${query}`);
  }

  const response = await fetch(query).catch((err) => {
    console.log(`ERROR failed fetch !!!\nError: ${JSON.stringify(err)}`);
  });

  if (!response) {
    console.log(`response from api was undefined`);
    return;
  }
  if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    console.log(`no response from server, tell AVT!\t${message}`);
    return;
  }

  const {
    title,
    artist,
    album,
    artworkURL,
    backOff,
    newAccessToken,
    newExpiresAt,
  } = await response.json();

  // check for backoff from Spotify (could be 429, or another error)
  if (backOff) {
    pollingInterval *= 2;
  } else {
    pollingInterval = INITIAL_POLLING_INTERVAL;
  }

  // check if we got a new accessToken
  if (newAccessToken) {
    Cookies.remove("accessToken");
    Cookies.set("accessToken", newAccessToken);
    console.log(`updated accessToken to: ${newAccessToken}`);
  }

  if (newExpiresAt) {
    Cookies.remove("expiresAt");
    Cookies.set("expiresAt", newExpiresAt);
    console.log(`updated expiredAt to: ${newExpiresAt}`);
  }

  let error;

  if (LOGGING_LEVEL === 2) {
    console.log("exiting getCurrentTrackFromSpotify");
  }
  return { title, artist, album, artworkURL, error };
}

export function updateTrackInfoTo({ title, artist, album, artworkURL }) {
  console.log("updating Track Info");

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
     />
  `;
  console.log("done updating Track Info");
}

function removeTrackInfo() {
  document.querySelector(".trackInfo").innerHTML = ``;
  document.querySelector(".artworkContainer").innerHTML = ``;
}

export function beginSpotifyPolling() {
  continuePolling = true;
  pollSpotify({ prevTitle: "", prevArtist: "", prevAlbum: "" });
}

function pollSpotify({ prevTitle, prevArtist, prevAlbum }) {
  console.log("polling api");

  setTimeout(async () => {
    if (!continuePolling) {
      return;
    }

    const { title, artist, album, artworkURL, error } =
      await getCurrentTrackFromSpotify();

    if (error) {
      console.log(`ERROR getting currentTrack: ${error}`);
    }

    if (title !== prevTitle || artist !== prevArtist || album !== prevAlbum) {
      updateTrackInfoTo({ title, artist, album, artworkURL });
    }

    // keep the polling going
    timeoutID = setTimeout(() => {
      pollSpotify({ prevTitle: title, prevArtist: artist, prevAlbum: album });
    }, pollingInterval);
  }, pollingInterval);
}


function stopPolling() {
  if (timeoutID) {
    clearTimeout(timeoutID);
  }
  continuePolling = false;
}

export function signOut() {
  stopPolling();
  removeTrackInfo();
  clearCookiesAndResetPath();
}

