import { saveQueryParamsToUserData } from "../userData";
import { redirect, useLoaderData } from "react-router-dom";

export async function loader() {
  saveQueryParamsToUserData();

  return redirect("/");
}
export default function SaveTokens() {
  console.log("hit saveTokens");
  useLoaderData();

  console.log("exiting saveTokens");
  return <h1>save tokens error</h1>;
}
