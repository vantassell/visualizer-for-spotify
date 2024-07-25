//e.g server.js
import express from "express";
import ViteExpress from "vite-express";
import {
  authLogin,
  authSpotifyRedirect,
  authRefreshToken,
  authTest,
} from "./src/routes/auth.js";
import "dotenv/config";

const app = express();

app.get("/api/login", authLogin);
app.get("/api/spotify-auth-redirect", authSpotifyRedirect);
app.get("/api/refresh-token", authRefreshToken);
app.get("/api/test", authTest);

ViteExpress.listen(app, process.env.PORT, () => {
  console.log(`Server is listening on port: ${process.env.PORT}...`);
});
