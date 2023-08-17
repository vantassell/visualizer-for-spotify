import { LOGGING_LEVEL } from "./globals.js";
import { updateUserData } from "./userData.js";

export function saveQueryParamsToUserData() {
  console.log("starting saveQueryParamsToUserData");

  const accessToken = getParamFromQuery("accessToken");
  const refreshToken = getParamFromQuery("refreshToken");
  const expiresAt = getParamFromQuery("expiresAt");
  const email = getParamFromQuery("email");
  const displayName = getParamFromQuery("displayName");

  const userData = { accessToken, refreshToken, expiresAt, email, displayName };

  updateUserData(userData);
  console.log("exiting saveQueryParamsToUserData");
}

/*
  * returns null if no param exists for the given key 
  */
function getParamFromQuery(paramKey) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const param = urlParams.get(paramKey);
  if(!param) {
    console.error("Failed to parse '${paramKey}' from params in search '${queryString}'")
  }
  return param;
}
