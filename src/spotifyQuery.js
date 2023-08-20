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

  // const response = await fetch(query, {mode: "no-cors"}).catch((err) => {
  const response = await fetch(query).catch((err) => {
    console.log(`ERROR failed fetch !!!\nError: ${JSON.stringify(err)}`);
    return { error: true, title: "Failed to fetch" };
  });

  if (!response) {
    console.log(`response from api was undefined`);
    return { error: true, title: "Failed to fetch" };
  }

  if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    console.log(`no response from server, tell AVT!\t${message}`);
    return { error: true, title: "Failed to fetch" };
  }

  const {
    title,
    artist,
    album,
    artworkURL,
    spotifyTrackLink,
    backOff,
    currentlyPlayingNothing,
    newAccessToken,
    newExpiresAt,
    error,
  } = await response.json();

  if (currentlyPlayingNothing) {
    return { artworkURL, currentlyPlayingNothing };
  }

  if (error) {
    // general error, probably becuase Spotify thinks nothing is playing
    // (becuase the track recently changed and hasn't propogated internally throughout their API)
    return { error };
  }

  // check for backoff from Spotify (could be 429, or another error)
  if (backOff) {
    pollingInterval *= 2;
  } else {
    pollingInterval = Math.max(
      pollingInterval * 0.95,
      INITIAL_POLLING_INTERVAL,
    );
  }

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

  if (LOGGING_LEVEL === 2) {
    console.log("exiting getCurrentTrackFromSpotify");
  }
  return { title, artist, album, artworkURL, spotifyTrackLink };
}

export function updateTrackInfoTo({
  title,
  artist,
  album,
  artworkURL,
  spotifyTrackLink,
  currentlyPlayingNothing,
}) {
  console.log(
    `Updating Track Info to\n--\n\t${title}\n\t${artist}\n\t${album}\n\t${artworkURL}\n--`,
  );

  if (title && artist && album) {
    document.querySelector(".trackInfo").innerHTML = `
      <p id="track_title">Track: ${title}</p>
      <p id="track_artist">Artist: ${artist}</p>
      <p id="track_album">Album: ${album}</p>
  `;
  } else {
    document.querySelector(".trackInfo").innerHTML = "";
  }

  if (currentlyPlayingNothing) {
    document.querySelector(".trackInfo").innerHTML = `
      <p>${currentlyPlayingNothing}
    `;
  }

  if (artworkURL) {
    document.querySelector(".artworkContainer").innerHTML = `
        <img
           class="artwork"
           id="track_artowrk"
           src=${artworkURL}
           alt="album art"
       />
  `;
  } else {
    document.querySelector(".artworkContainer").innerHTML = "";
  }

  if (spotifyTrackLink) {
    document
      .getElementById("spotify-linkback-button")
      .addEventListener("click", () => {
        console.log("linkback clicked!");
        console.log(`linkback: ${spotifyTrackLink}`);
        window.location.assign(spotifyTrackLink);
      });
  }
}

function removeTrackInfo() {
  document.querySelector(".trackInfo").innerHTML = "";
  document.querySelector(".artworkContainer").innerHTML = "";
}

export function beginSpotifyPolling(initialAccessToken, initialsRefreshToken) {
  console.log("initial accessToken", initialAccessToken);
  console.log("initial refreshTOken", initialsRefreshToken);

  accessToken = initialAccessToken;
  refreshToken = initialsRefreshToken;
  continuePolling = true;
  pollSpotify({ prevSpotifyTrackLink: "" });
}

async function pollSpotify({ prevSpotifyTrackLink }) {
  console.log("polling api");

  if (!continuePolling) {
    console.log("continuePolling is false");
    return;
  }

  const {
    title,
    artist,
    album,
    artworkURL,
    spotifyTrackLink,
    currentlyPlayingNothing,
    error,
  } = await getCurrentTrackFromSpotify();

  if (currentlyPlayingNothing) {
    console.log(`\n\n\tERROR: currentlyPlayingNothing\n\n`);
  }

  if (error) {
    console.log(`\n\tERROR: ${error}\n`);
  }

  if (spotifyTrackLink !== prevSpotifyTrackLink && !error) {
    updateTrackInfoTo({
      title,
      artist,
      album,
      artworkURL,
      spotifyTrackLink,
      currentlyPlayingNothing,
    });
  }

  // keep the polling going
  timeoutID = setTimeout(() => {
    pollSpotify({ prevSpotifyTrackLink: spotifyTrackLink });
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
