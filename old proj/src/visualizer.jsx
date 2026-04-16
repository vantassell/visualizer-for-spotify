import * as React from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import { getUserData } from "./userData.js";
import { beginSpotifyPolling, stopPolling } from "./spotifyQuery.js";
import "./visualizer.css";
import spotifyLogoGreen from "./assets/spotify/Spotify_Logo_RGB_Green.png";

export async function loader() {
  const userData = getUserData();
  return { userData };
}

export default function Visualizer() {
  const { userData } = useLoaderData();
  console.log(
    `signed into players_basic with accessToken: ${userData.accessToken}\n and refreshToken: ${userData.refreshToken}`,
  );

  beginSpotifyPolling(userData.accessToken, userData.refreshToken);

  return (
    <>
      <div className="row">
        <div className="trackInfoContainer">
          <div className="trackInfo"></div>
        </div>
        <div className="spotifyLogoContainer" id="spotifyLogoContainer">
          <button
            className="spotify-linkback-button focusable"
            id="spotify-linkback-button"
            tabIndex="0"
          >
            <img
              className="spotifyLogo"
              id="spotifyLogo"
              src={spotifyLogoGreen}
              alt="spotify logo"
            />
          </button>
        </div>
      </div>
      <div className="artworkContainer"></div>
    </>
  );
}
