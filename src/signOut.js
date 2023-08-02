import Cookies from "js-cookie";

export function clearCookiesAndResetPath() {
  console.log("clearing cookies and resetting path");
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("expiresAt");
  Cookies.remove("email");
  Cookies.remove("displayName");

  console.log("cleared cookies, testing now");
  console.log(`all Cookies: ${JSON.stringify(Cookies.get())}`);
  console.log(`accessToken: ${Cookies.get("accessToken")}`);
  console.log(`expiresAt: ${Cookies.get("expiresAt")}`);
  console.log("exiting cookies and resetting path");

  window.location.search = "";
  // const url = window.location;
  // url.search = "";
  // const urlWithoutTokenParams = url.toString();
  // console.log(`url: ${url}`);
  // window.location.href = "/";
}
