import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Reset default browser styles
const style = document.createElement("style");
style.textContent = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }
  table {
    border-spacing: 0;
  }
  input:focus {
    outline: none;
  }
  button:disabled {
    opacity: 0.4;
    cursor: not-allowed !important;
  }
  button:hover:not(:disabled) {
    background: #f3f4f6 !important;
  }
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 5px;
  }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);