import {
  API_PLAYERS_URL,
  INITIAL_POLLING_INTERVAL,
  LOGGING_LEVEL,
} from "./globals.js";
import { clearCookiesAndResetPath } from "./signOut.js";
import { updateUserData } from "./userData.js";

let pollingInterval = INITIAL_POLLING_INTERVAL;
let continuePolling = false;
let timeoutID = undefined;
let accessToken;
let refreshToken;

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

  const queryParams = encodeParamsForQuery({ accessToken, refreshToken });

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
  } // else {
  //   pollingInterval = Math.max(pollingInterval * 0.95, INITIAL_POLLING_INTERVAL);
  // }

  // check if we got a new accessToken
  if (newAccessToken) {
    console.log(`recieved updated accessToken: ${newAccessToken}`);
    updateUserData({ accessToken: newAccessToken });

    // save the accessToken locally to avoid calling localstorage on every call
    accessToken = newAccessToken;
  }

  if (newExpiresAt) {
    console.log(`received updated expiredAt: ${newExpiresAt}`);
    updateUserData({ expiredAt: newExpiresAt });
  }

  let error;

  if (LOGGING_LEVEL === 2) {
    console.log("exiting getCurrentTrackFromSpotify");
  }
  return { title, artist, album, artworkURL, error };
}

export function updateTrackInfoTo({ title, artist, album, artworkURL }) {
  console.log(
    `Updating Track Info to\n--\n\t${title}\n\t${artist}\n\t${album}\n\t${artworkURL}\n--`,
  );

  if (title && artist && album) {
    document.querySelector(".trackInfo").innerHTML = `
      <p>Track: ${title}</p>
      <p>Artist: ${artist}</p>
      <p>Album: ${album}</p>
  `;
  } else {
    document.querySelector(".trackInfo").innerHTML = "";
  }

  if (artworkURL) {
    document.querySelector(".artworkContainer").innerHTML = `
     <img
         class=artwork
         src=${artworkURL}
         alt="album art"
     />
  `;
  } else {
    document.querySelector(".artworkContainer").innerHTML = "";
  }
}

function removeTrackInfo() {
  document.querySelector(".trackInfo").innerHTML = "";
  document.querySelector(".artworkContainer").innerHTML = "";
}

export function beginSpotifyPolling(initialAccessToken, initialsRefreshToken) {
  console.log("init accessToken", initialAccessToken);
  console.log("init refreshTOken", initialsRefreshToken);
  // const { accessTokenFromStorage, refreshTokenFromStorage } = getUserData();
  // accessToken = accessTokenFromStorage;
  // refreshToken = refreshTokenFromStorage;
  accessToken = initialAccessToken;
  refreshToken = initialsRefreshToken;
  continuePolling = true;
  pollSpotify({ prevTitle: "", prevArtist: "", prevAlbum: "" });
}

async function pollSpotify({ prevTitle, prevArtist, prevAlbum }) {
  if (LOGGING_LEVEL === 2) console.log("polling api");
  console.log("accessToken", accessToken);
  console.log("refreshTOken", refreshToken);

  if (!continuePolling) {
    console.log("continuePolling is false");
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
