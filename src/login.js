import { replaceToBeforeSplitToken } from "./navigator";
import { saveQueryParamsToUserData } from "./queryCheck";

console.log("hello from login.js");

saveQueryParamsToUserData();

console.log("exiting login.js");
replaceToBeforeSplitToken("/login");
