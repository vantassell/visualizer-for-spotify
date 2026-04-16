import {
  API_PLAYERS_URL,
  INITIAL_POLLING_INTERVAL,
  LOGGING_LEVEL,
  SPOTIFY_CLIENT_ID,
} from "./globals.js";
import { deleteUserData, updateUserData } from "./userData.js";
// import { encodeFormData } from "./routes/auth.js";

let pollingInterval = INITIAL_POLLING_INTERVAL;
let continuePolling = false;
let timeoutID = undefined;
let accessToken;
let refreshToken;

const encodeFormData = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

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

  let title = undefined;
  let artist = undefined;
  let album = undefined;
  let artworkURL = undefined;
  let spotifyTrackLink = undefined;
  let backOff = undefined;
  let currentlyPlayingNothing = undefined;
  let newRefreshToken = undefined;
  let error = undefined;

  const queryParams = encodeParamsForQuery({ accessToken, refreshToken });

  const spotifyRes = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  // Recommendation: handle errors
  if (!spotifyRes) {
    console.log("bad response from Spotify");
    console.trace(spotifyRes);
    currentlyPlayingNothing =
      "Failed to receive a response from spotify, something is very wrong";
    artworkURL =
      "https://static1.srcdn.com/wordpress/wp-content/uploads/2020/03/michael-scott-the-office-memes.jpg";
  }

  // user not registered on developer dashboard
  if (spotifyRes.status === 403) {
    console.log("Error from spotify: ", spotifyRes.message);
    console.log("\tUser not registered with spotify developer dashboard");
    currentlyPlayingNothing = "User not registered on developer dashboard";
    artworkURL =
      "https://static1.srcdn.com/wordpress/wp-content/uploads/2020/03/michael-scott-the-office-memes.jpg";
  }

  // check if no song was playing
  if (spotifyRes.status === 204) {
    currentlyPlayingNothing =
      "It looks like you aren't currently listening to anything. Please chose something to play and this message will go away :)";
    artworkURL =
      "https://static1.srcdn.com/wordpress/wp-content/uploads/2020/03/michael-scott-the-office-memes.jpg";
    return { currentlyPlayingNothing, artworkURL };
  }

  // 429 --> Rate Limit by Spotify
  if (spotifyRes.status === 429) {
    backOff = true;
  }

  // 401 --> token expired
  if (spotifyRes.status === 401) {
    console.log("accessToken is expired, fetching new token...");
    const url = new URL(`${window.location.origin}/api/refresh-token`);
    url.searchParams.append("refreshToken", refreshToken);
    console.log(`url: ${url}`);

    const spotifyRes = await fetch(url)
      .then((response) => response.json())
      .then(async (data) => {
        console.log(`received accessToken: ${JSON.stringify(data)}`);
        const newAccessToken = data.accessToken;
        updateUserData({ accessToken: newAccessToken });
        accessToken = newAccessToken;
      });
    // return empty object and will update on next polling
    return {};
  }

  const data = await spotifyRes.json();

  if (!data || !data.item) {
    error = `ERROR: no data received back from spotify! ${JSON.stringify(
      data,
    )}`;
    return { error };
  }

  title = data.item.name || "";
  artist = data.item.artists.map((artist) => artist.name).join(", ") || "";
  album = data.item.album.name || "";
  artworkURL = data.item.album.images[0].url || "";
  const spotifyURI = data.item.uri || "";
  spotifyTrackLink = `http://open.spotify.com/track/${spotifyURI
    .split(":")
    .pop()}`;

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
           className="artwork"
           id="track_artwork"
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
  if (window.location.pathname != "/visualizer") {
    console.log("navigated away from visualizer");
    continuePolling = false;
  }

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

  // getting stuck here, without having updated Album Art to office with messsage
  if (currentlyPlayingNothing) {
    console.log(`\n\n\tERROR: currentlyPlayingNothing\n\n`);
    console.log("artworkURL: ", artworkURL);
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

export function stopPolling() {
  if (timeoutID) {
    clearTimeout(timeoutID);
  }
  continuePolling = false;
}

export function signOut() {
  stopPolling();
  removeTrackInfo();
  // clearCookiesAndResetPath();
  deleteUserData();
}
