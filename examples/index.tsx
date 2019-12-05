import React from "react";
import { hydrate, render } from "react-dom";
import { App } from "./app";

const element = document.getElementById("app");
if (!element) throw new Error("root element was not found");

window.addEventListener("DOMContentLoaded", event => {
  switch (process.env.NODE_ENV) {
    case "development":
      render(<App />, element);
      break;
    case "production":
      hydrate(<App />, element);
      break;
    default:
      throw new Error("Node environment not detected");
  }
});
