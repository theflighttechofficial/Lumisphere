import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./global.css";

import { LightProvider } from "./context/LightContext";
import { SceneProvider } from "./context/SceneContext"; // <-- Missing import

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LightProvider>
      <SceneProvider>
        <App />
      </SceneProvider>
    </LightProvider>
  </React.StrictMode>
);