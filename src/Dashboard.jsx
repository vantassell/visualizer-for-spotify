import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import { getUserData, deleteUserData } from "./userData.js";

export async function loader() {
  const userData = getUserData();
  return { userData };
}

function NewSignIn() {
  return (
    <div className="new-sign-in">
      <a className="focusable" tabIndex="0" href="/api/login">
        Sign a new user into{" "}
        <span className="new-sign-in__spotify">Spotify</span>
      </a>
    </div>
  );
}

function SignedIn() {
  return (
    <>
      <div className="go-to-visualizer">
        <Link to="visualizer">TODO: Go to vizualizer</Link>
      </div>
      <div className="sign-out-user">
        <button
          onClick={() => {
            console.log("sign out clicked");
            deleteUserData();
            revalidator.revalidate();
          }}
        >
          Sign Out
        </button>
        <Link to="sign-out"> TODO: sign out</Link>
      </div>
    </>
  );
}

// function isLoggedIn() {
//   const userData = getUserData();
//   return userData.accessToken;
// }

export default function Dashboard() {
  const { userData } = useLoaderData();
  let revalidator = useRevalidator();

  return (
    <div className="dashboard" id="dashboard">
      {userData.accessToken ? (
        <>
          <div className="go-to-visualizer">
            <Link to="visualizer">
              {userData.displayName}'s{" "}
              <span className="go-to-visualizer__visualizer">visualizer</span>
            </Link>
          </div>
          <div className="sign-out-user">
            <button
              onClick={() => {
                console.log("sign out clicked");
                deleteUserData();
                revalidator.revalidate();
              }}
            >
              Sign Out {userData.displayName} from this device
            </button>
          </div>
        </>
      ) : (
        <NewSignIn />
      )}
    </div>
  );
}
