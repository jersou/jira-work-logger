import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { AppConnected } from "./components/App/App";
import { Provider } from "react-redux";
import { store } from "./redux/slice";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppConnected />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
