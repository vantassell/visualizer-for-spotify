import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import ErrorPage from "./error-page.jsx";
import Dashboard, { loader as userDataLoader } from "./Dashboard.jsx";
import Visualizer, { loader as visualizerDataLoader } from "./visualizer.jsx";
import SaveTokens, {
  loader as saveTokensLoader,
} from "./routes/saveTokens.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route index element={<Dashboard />} loader={userDataLoader} />
      <Route
        path="visualizer"
        element={<Visualizer />}
        loader={visualizerDataLoader}
      />
      <Route
        path="saveTokens"
        element={<SaveTokens />}
        loader={saveTokensLoader}
      />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
