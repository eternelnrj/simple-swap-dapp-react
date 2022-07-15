import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { MoralisProvider } from "react-moralis";

const config = require("./.config.json");

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider serverUrl={config["serverUrl"]} appId={config["appId"]}>
      <App/>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
