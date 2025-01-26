import React from "react";
import ReactDOM from "react-dom/client";
import "./output.css";
import AppProvider from "./AppProvider";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No root element found");
}

ReactDOM.createRoot(rootElement).render(
   <React.StrictMode>
     <AppProvider />
   </React.StrictMode>
 );