import { LOGGING_LEVEL } from "./globals.js";
import { updateUserData } from "./userData.js";

export function saveQueryParamsToUserData() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  console.log("starting saveQueryParamsToUserData");

  const accessToken = urlParams.get("accessToken");
  const refreshToken = urlParams.get("refreshToken");
  const expiresAt = urlParams.get("expiresAt");
  const email = urlParams.get("email");
  const displayName = urlParams.get("displayName");

  if (!accessToken) {
    console.log("failed to parse accessToken from params");
  }
  if (!refreshToken) {
    console.log("failed to parse refreshTokenfrom params");
  }
  if (!expiresAt) {
    console.log("failed to parse expiresAt from params");
  }

  if (!email) {
    console.log("failed to parse email from params");
  }

  if (!displayName) {
    console.log("failed to parse displayName from params");
  }

  const userData = { accessToken, refreshToken, expiresAt, email, displayName };

  updateUserData(userData);
  console.log("exiting saveQueryParamsToUserData");
}
