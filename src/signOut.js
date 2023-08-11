import { deleteUserData} from "./userData.js";

export function signOutUser() {
  console.log("begin signing out user");
  deleteUserData();
  window.location.reload();
}
