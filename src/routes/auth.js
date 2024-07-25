import { Router } from "express";
import { SPOTIFY_CLIENT_ID } from "./../globals.js";
const router = Router();

// /api/login
// router.get("/login", (req, res) => {
export function authLogin(req, res) {
  console.log("hit api/login");
  const scope = `
    user-read-playback-state
    user-read-currently-playing
    user-read-playback-position
    user-read-private
    user-read-email
`;

  const url = new URL("https://accounts.spotify.com/authorize");
  url.searchParams.append("response_type", "code");
  url.searchParams.append("client_id", SPOTIFY_CLIENT_ID);
  url.searchParams.append("scope", scope);
  url.searchParams.append("show_dialog", true);
  url.searchParams.append(
    "redirect_uri",
    // TODO: re-add https support
    // `${req.protocol}://${req.hostname}:${process.env.PORT}/api/spotify-auth-redirect`,
    `http://${req.hostname}/api/spotify-auth-redirect`,
  );

  console.log(
    `redirecting to spotify/authorize with redirect to /api/spotify-auth-redirect. redirect_url: ${url.href}`,
  );
  res.redirect(url);
}

// /api/spotify-auth-redirect
export async function authSpotifyRedirect(req, res) {
  // router.get("/spotify-auth-redirect", async (req, res) => {
  console.log("/logged req from spotify: ", req.query);
  // console.log("/logged response from spotify: ", res);
  const query = req.query;

  if (query.error) {
    console.log("ERROR: Spotify had an error during sign-in on the server");

    // TODO: fix this to not call WEB_APP_DOMAIN
    const clientRedirect = `${process.env.WEB_APP_DOMAIN}`;
    console.log(`redirecting to client: ${clientRedirect}`);
    res.redirect(clientRedirect);
    return;
  }

  const body = {
    grant_type: "authorization_code",
    code: req.query.code,
    // TODO fix https support
    // redirect_uri: `${req.protocol}://${req.hostname}:${process.env.PORT}/api/spotify-auth-redirect`,
    redirect_uri: `http://${req.hostname}/api/spotify-auth-redirect`,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  };

  console.log(JSON.stringify(body));

  console.log("posting to spotify for initial token");

  await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: encodeFormData(body),
  })
    .then((response) => response.json())
    .then(async (data) => {
      console.log(
        `data from spotify after posting initial token: ${JSON.stringify(
          data,
        )}`,
      );
      const accessToken = data.access_token || "error getting token on server";
      const refreshToken =
        data.refresh_token || "error getting token on server";

      // get spotify profile info
      let email = "default__";
      let displayName = "default__";
      await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((response) => response.json())
        .then((data) => {
          email = data.email || "error getting email on server";
          displayName =
            data.display_name || "error getting display name on server";
        });

      const accountInfo = {
        accessToken,
        refreshToken,
        email,
        displayName,
      };

      console.log(`accountInfo: ${JSON.stringify(accountInfo)}`);

      // redirect to client page to save tokens locally
      const clientRedirect = new URL(
        // TODO: fix support for https
        // `${req.protocol}://${req.hostname}:${process.env.PORT}/saveTokens`,
        `http://${req.hostname}/saveTokens`,
      );

      clientRedirect.searchParams.append("accessToken", accessToken);
      clientRedirect.searchParams.append("refreshToken", refreshToken);
      clientRedirect.searchParams.append("email", email);
      clientRedirect.searchParams.append("displayName", displayName);

      console.log(`redirecting to client: ${clientRedirect}`);
      res.redirect(clientRedirect);
    });
}

export async function authRefreshToken(req, res) {
  console.log("starting authRefreshToken");

  // get refresh token from request
  const refreshToken = req.query.refreshToken;
  if (!refreshToken) {
    res.status(400);
  }

  const body = {
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };

  let newAccessToken = undefined;
  await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: encodeFormData(body),
  })
    .then((response) => response.json())
    .then(async (data) => {
      // console.log("received  spotify refresh token");

      newAccessToken =
        data.access_token ||
        "error getting accessToken from spotify.response.data";
    });

  if (!newAccessToken) {
    console.log("failed to refresh token");
    res.status(500);
  } else {
    console.log(`Sending client newAccessToken: ${newAccessToken}`);
    res.json({ accessToken: newAccessToken });
  }
}

// this can be used as a seperate module
const encodeFormData = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

export function authTest(req, res) {
  // router.get("/test", (req, res) => {
  console.log("hit test");
  res.sendStatus(200);
}

export default router;
