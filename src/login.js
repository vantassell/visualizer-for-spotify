import { saveQueryParamsToUserData } from "./queryCheck";
import { getUserData } from "./userData";

console.log("hello from login.js");

saveQueryParamsToUserData();

const userData = getUserData();
console.log(userData);

const baseURL = window.location.toString().split("/login")[0];
console.log(`baseURL: ${baseURL}`);
// const redirectTo = baseURL + "/";
const redirectTo = baseURL;
console.log(`redirecting to: ${redirectTo}`);
window.location.replace(redirectTo);
console.log("exiting login.js");
