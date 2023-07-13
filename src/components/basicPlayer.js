import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styles from "./player.module.css";
import { useInterval } from "./../hooks/useInterval";
import queryString from "query-string";

export default function BasicPlayer() {
  const [trackInfo, setTrackInfo] = useState({
    title: "No Title",
    artist: "No Artist",
    album: "No Album... check to see if spotify is playing ;)",
  });

  const [artworkURL, setArtworkURL] = useState(undefined);

  const initialPollingInterval = 1000;
  const [pollingInterval, setPollingInterval] = useState(
    initialPollingInterval
  );

  const [cookies, setCookie] = useCookies([
    "accessToken",
    "refreshToken",
    "expiresAt",
    "email",
    "displayName",
  ]);

  // console.log(`cookies: ${JSON.stringify(cookies)}`);

  const TrackInfo = ({ title, artist, album }) => (
    <div className={styles.trackInfoBlended}>
      <p>Track: {title}</p>
      <p>Artist: {artist}</p>
      <p>Album: {album}</p>
    </div>
  );

  const Artwork = ({ artworkURL }) => (
    <div className={styles.container}>
      <img
        className={styles.artworkContainer}
        src={artworkURL}
        alt="album art"
        imageRendering={"optimizeQuality"}
      />
    </div>
  );

  async function getCurrentSong() {
    const params = {
      accessToken: cookies.accessToken,
      refreshToken: cookies.refreshToken,
    };

    const queryParams = queryString.stringify(params);
    // const playersQueryURL = `http://localhost:8888/players?${queryParams}`;
    const playersQueryURL = `${process.env.REACT_APP_SERVER_DOMAIN}/players?${queryParams}`;
    // console.log(playersQueryURL);
    const response = await fetch(playersQueryURL).catch((err) => {
      console.log(`ERROR in getCurrentSong, failed fetch !!!`);
      console.log(err);
    });

    // console.log("right before killing");
    if (!response) {
      // console.log("killing getCurrent call");
      setPollingInterval(pollingInterval * 2);
      return;
    }
    // console.log("right after killing");

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
      increasePollingInterval();
    } else {
      decreasePollingInterval();
    }

    if (newAccessToken) {
      setCookie("accessToken", newAccessToken, { path: "/" });
      console.log("reset Access Token");
    }

    if (newExpiresAt) {
      setCookie("expiresAt", newExpiresAt, { path: "/" });
      console.log("reset Expires At");
    }

    if (
      title !== trackInfo.title ||
      artist !== trackInfo.artist ||
      album !== trackInfo.album
    ) {
      setTrackInfo({ title, artist, album });
      setArtworkURL(artworkURL);
      console.log(
        `new track found! updating state ${JSON.stringify(trackInfo)}`
      );
    } else {
      // console.log(`no new track found`);
    }

    // console.log(JSON.stringify(trackInfo));
  }

  useEffect(() => {
    console.log("ran useEffect");
    getCurrentSong();
  }, []);

  useInterval(async () => {
    getCurrentSong();
  }, pollingInterval);

  function increasePollingInterval() {
    setPollingInterval(pollingInterval * 2);
  }

  function decreasePollingInterval() {
    if (pollingInterval > initialPollingInterval) {
      setPollingInterval(initialPollingInterval);
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <main>
      <div className={styles.fullDynamicBackground}>
        <TrackInfo
          title={trackInfo.title}
          artist={trackInfo.artist}
          album={trackInfo.album}
        />
        {artworkURL && <Artwork artworkURL={artworkURL} />}
      </div>
    </main>
  );
}
