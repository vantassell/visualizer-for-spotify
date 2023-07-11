import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styles from "./player.module.css";

export default function BasicPlayer() {
  const [trackInfo, setTrackInfo] = useState({
    title: "errorTitle",
    artist: "errorArtist",
    album: "errorAlbum",
  });

  const [artworkURL, setArtworkURL] = useState({
    artworkURL:
      "https://m.media-amazon.com/images/I/61oQn7nDDmL._AC_UF894,1000_QL80_.jpg",
  });

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

  useEffect(() => {
    async function getCurrentSong() {
      const response = await fetch(
        `http://localhost:8888/players/${cookies.accessToken}`
      );

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      // const data = await response.json();
      const { title, artist, album, artworkURL } = await response.json();
      setTrackInfo({ title, artist, album });
      setArtworkURL(artworkURL);
      console.log("ran useEffect");
      // console.log(JSON.stringify(trackInfo));
    }

    getCurrentSong();
  }, []);

  // This following section will display the form that takes the input from the user.
  return (
    <main>
      <div className={styles.fullDynamicBackground}>
        <TrackInfo
          title={trackInfo.title}
          artist={trackInfo.artist}
          album={trackInfo.album}
        />
        <Artwork artworkURL={artworkURL} />
      </div>
    </main>
  );
}
