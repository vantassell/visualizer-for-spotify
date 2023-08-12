import { LOGGING_LEVEL } from "./globals";
const userDataKey = "userData"

export function getUserData() {
  if (LOGGING_LEVEL === 2) {
    console.log("getting userData from localStorage");
  }

  const userDataString = window.sessionStorage.getItem(userDataKey);

  if (!userDataString) {
    console.log(
      "could not find userData in local storage, returning undefined",
    );
    return {
      accessToken: undefined,
      refreshToken: undefined,
      expiresAt: undefined,
      email: undefined,
      displayName: undefined,
    };
  }
  const userData = JSON.parse(userDataString);

  if (LOGGING_LEVEL === 2) {
    console.log("userData pulled from localStorage: ", userData)
    console.log("returning from getUserData");
  }

  return userData;
}

export function updateUserData({accessToken, refreshToken, expiresAt, email, displayName }) {
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

  if (expiresAt) {
    userData.expiresAt = expiresAt;
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

  window.sessionStorage.setItem(userDataKey, JSON.stringify(userData));
}

export function deleteUserData() {
  console.log("deleting userData from localStorage");
  window.sessionStorage.removeItem(userDataKey);
}
