import Cookies from "js-cookie";

export function queryParamsIntoCookies() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  console.log("starting queryParamsIntoCookies");

  const accessToken = urlParams.get("accessToken");
  const refreshToken = urlParams.get("refreshToken");
  const expiresAt = urlParams.get("expiresAt");
  const email = urlParams.get("email");
  const displayName = urlParams.get("displayName");

  if (accessToken) {
    console.log("trying to set accessToken cookie");
    Cookies.set(`accessToken`, accessToken);
  }

  if (refreshToken) {
    console.log("trying to set refreshToken cookie");
    Cookies.set("refreshToken", refreshToken);
  }

  if (expiresAt) {
    console.log("trying to set expiresAt cookie");
    Cookies.set("expiresAt", expiresAt);
  }

  if (email) {
    Cookies.set("email", email);
    console.log("trying to set email cookie");
  }

  if (displayName) {
    console.log("trying to set displayName cookie");
    Cookies.set("displayName", displayName);
  }

  if (LOGGING_LEVEL === 2) {
    console.log(`accessToken: ${Cookies.get("accessToken")}`);
    console.log(`refreshToken: ${Cookies.get("refreshToken")}`);
    console.log(`expiresAt: ${Cookies.get("expiresAt")}`);
    console.log(`email: ${Cookies.get("email")}`);
    console.log(`displayName: ${Cookies.get("displayName")}`);
    console.log("exiting queryParamsIntoCookies");
  }
}

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
