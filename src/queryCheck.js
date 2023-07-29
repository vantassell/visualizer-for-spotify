import Cookies from "jscookie";

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
    // console.log("trying to set accessToken cookie");
    Cookies.set({
      name: "accessToken",
      value: accessToken,
      path: "/",
    });
  }

  if (refreshToken) {
    // console.log("trying to set refreshToken cookie");
    Cookies.set({
      name: "refreshToken",
      value: refreshToken,
      path: "/",
    });
  }

  if (expiresAt) {
    // console.log("trying to set expiresAt cookie");
    Cookies.set({
      name: "expiresAt",
      value: expiresAt,
      path: "/",
    });
  }

  if (email) {
    // console.log("trying to set email cookie");
    Cookies.set({
      name: "email",
      value: email,
      path: "/",
    });
  }

  if (displayName) {
    // console.log("trying to set displayName cookie");
    Cookies.set({
      name: "displayName",
      value: displayName,
      path: "/",
    });
  }
  // console.log(`accessToken: ${Cookies.get("accessToken")}`);
  // console.log(`refreshToken: ${Cookies.get("refreshToken")}`);
  // console.log(`expiresAt: ${Cookies.get("expiresAt")}`);
  // console.log(`email: ${Cookies.get("email")}`);
  // console.log(`displayName: ${Cookies.get("displayName")}`);

  console.log("exiting queryParamsIntoCookies");
}
