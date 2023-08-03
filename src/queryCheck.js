import Cookies from "js-cookie";
import { LOGGING_LEVEL } from "./globals.js";

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

