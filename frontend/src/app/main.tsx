import React from "react";
import ReactDOM from "react-dom/client";
import AppProvider from "./AppProvider";
import "./output.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No root element found");
}

ReactDOM.createRoot(rootElement).render(
   //<React.StrictMode>
     <AppProvider />
   //</React.StrictMode>
 );