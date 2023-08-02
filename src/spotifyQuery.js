import Cookies from "js-cookie";
import { clearCookiesAndResetPath } from "./queryCheck.js";

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
    Cookies.set({
      name: "accessToken",
      value: newAccessToken,
      path: "/",
    });
    console.log(`updated accessToken to: ${newAccessToken}`);
  }

  if (newExpiresAt) {
    Cookies.set({
      name: "expiresAt",
      value: newExpiresAt,
      path: "/",
    });
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

export function stopPollingAndSignOut() {
  if (timeoutID) {
    clearTimeout(timeoutID);
  }
  stopPolling();
  continuePolling = false;
}

function stopPolling() {
  document.querySelector(".trackInfo").innerHTML = ``;
  document.querySelector(".artworkContainer").innerHTML = ``;

  clearCookiesAndResetPath();
}

function increasePollingInterval() {
  pollingInterval = pollingInterval * 2;
}

function decreasePollingInterval() {
  pollingInterval = INITIAL_POLLING_INTERVAL;
}
