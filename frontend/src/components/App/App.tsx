import React from "react";
import "./App.css";
import { MyLastIssuesConnected } from "../MyLastIssues/MyLastIssuesConnected";
import { ConfigConnected } from "../Config/ConfigConnected";
import { WorkLogTableConnected } from "../WorkLogTable/WorkLogTableConnected";
import { connect } from "react-redux";
import { AppState } from "../../types";
import { actions } from "../../redux/slice";
import { ButtonBarConnected } from "../ButtonBar/ButtonBarConnected";

function App() {
  return (
    <div className="main">
      <ButtonBarConnected />
      <WorkLogTableConnected />
      <MyLastIssuesConnected />
      <ConfigConnected />
    </div>
  );
}

export const AppConnected = connect((state: AppState) => state, actions)(App);
