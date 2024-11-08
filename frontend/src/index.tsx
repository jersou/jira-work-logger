import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { AppConnected } from "./components/App/App";
import { Provider } from "react-redux";
import { store } from "./redux/slice";
import { actions } from "./redux/slice";
import { createRoot } from "react-dom/client";

const ws = new WebSocket("ws://127.0.0.1:8001");

ws.onopen = () => store.dispatch(actions.websocketStatusChange({ websocketState: "OPEN" }));
ws.onclose = () => store.dispatch(actions.websocketStatusChange({ websocketState: "CLOSE" }));
ws.onerror = () => store.dispatch(actions.websocketStatusChange({ websocketState: "ERROR" }));

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <AppConnected />
  </Provider>
);
