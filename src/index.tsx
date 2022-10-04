import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <App />
    </div>
  </React.StrictMode>
);
