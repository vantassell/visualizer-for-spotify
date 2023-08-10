import { deleteUserData} from "./userData.js";

export function clearCookiesAndResetPath() {
  console.log("clearing cookies and resetting path");
  // Cookies.remove("accessToken");
  // Cookies.remove("refreshToken");
  // Cookies.remove("expiresAt");
  // Cookies.remove("email");
  // Cookies.remove("displayName");
  //
  // console.log("cleared cookies, testing now");
  // console.log(`all Cookies: ${JSON.stringify(Cookies.get())}`);
  // console.log(`accessToken: ${Cookies.get("accessToken")}`);
  // console.log(`expiresAt: ${Cookies.get("expiresAt")}`);
  // console.log("exiting cookies and resetting path");

  // is only called from /players/*
  const baseURL = window.location.toString().split("/players")[0];
  console.log(`baseURL: ${baseURL}`);

  const redirectTo = baseURL + "";
  console.log(`redirecting to: ${redirectTo}`);
  window.location.replace(redirectTo);
}

export function signOutUser() {
  console.log("begin signing out user");
  deleteUserData();
  // window.location.reload();
}
