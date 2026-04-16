import { userDataKey } from "./globals.js";
const LOGGING_LEVEL = 2;

export function getUserData() {
  if (LOGGING_LEVEL === 2) {
    console.log("getting userData from localStorage");
  }

  const userDataString = window.localStorage.getItem(userDataKey);

  if (!userDataString) {
    console.log(
      "could not find userData in local storage, returning undefined",
    );
    return {
      accessToken: undefined,
      refreshToken: undefined,
      email: undefined,
      displayName: undefined,
    };
  }
  const userData = JSON.parse(userDataString);

  if (LOGGING_LEVEL === 2) {
    console.log("userData pulled from localStorage: ", userData);
    console.log("returning from getUserData");
  }

  return userData;
}

export function updateUserData({
  accessToken,
  refreshToken,
  email,
  displayName,
}) {
  if (LOGGING_LEVEL === 2) {
    console.log("updatingUserData");
  }
  const userData = getUserData();

  if (accessToken) {
    userData.accessToken = accessToken;
  }

  if (refreshToken) {
    userData.refreshToken = refreshToken;
  }

  if (email) {
    userData.email = email;
  }

  if (displayName) {
    userData.displayName = displayName;
  }

  if (LOGGING_LEVEL >= 1) {
    console.log("updating localStorage userData to ", userData);
  }

  window.localStorage.setItem(userDataKey, JSON.stringify(userData));
}

export function deleteUserData() {
  console.log("deleting userData from localStorage");
  window.localStorage.removeItem(userDataKey);
}

export function saveQueryParamsToUserData() {
  console.log("starting saveQueryParamsToUserData");

  const accessToken = getParamFromQuery("accessToken");
  const refreshToken = getParamFromQuery("refreshToken");
  const email = getParamFromQuery("email");
  const displayName = getParamFromQuery("displayName");

  const userData = { accessToken, refreshToken, email, displayName };

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
  if (!param) {
    console.error(
      "Failed to parse '${paramKey}' from params in search '${queryString}'",
    );
  }
  return param;
}
