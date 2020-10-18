import React from 'react';
import {MyLastIssuesConnected} from "./MyLastIssuesConnected";
import {store} from "../../redux/slice";
import {Provider} from "react-redux";
import {Meta} from "@storybook/react/types-6-0";
import {MyLastIssues} from "./MyLastIssues";

export default {title: 'App/MyLastIssues', component: MyLastIssues} as Meta;

export const myLastIssuesConnected = () =>
  <React.StrictMode>
    <Provider store={store}>
      <MyLastIssuesConnected/>
    </Provider>
  </React.StrictMode>
