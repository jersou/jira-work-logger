import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { AppConnected } from "./components/App/App";
import { Provider } from "react-redux";
import { store } from "./redux/slice";
import { actions } from "./redux/slice";
import { createRoot } from "react-dom/client";

const wsUri =
  `ws://${window.location.host}${window.location.pathname}api/events-ws`;

function updateOnEvent() {
  const socket = new WebSocket(wsUri);
  socket.addEventListener("open", (event) => {
    console.log("WebSocket: open");
    store.dispatch(actions.websocketStatusChange({ websocketState: "OPEN" }));
  });
  socket.addEventListener("message", (event) => {
    console.log("WebSocket: message from server");
  });
  socket.addEventListener("error", (event) => {
    console.log("WebSocket: error event", event);
    store.dispatch(actions.websocketStatusChange({ websocketState: "ERROR" }));
  });
  socket.addEventListener("close", (event) => {
    console.log("WebSocket: close event", event);
    store.dispatch(actions.websocketStatusChange({ websocketState: "CLOSE" }));
    console.log("Retry WS"); // reload in 1s
    setTimeout(() => updateOnEvent(), 1000);
  });
}
updateOnEvent();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <AppConnected />
  </Provider>,
);
