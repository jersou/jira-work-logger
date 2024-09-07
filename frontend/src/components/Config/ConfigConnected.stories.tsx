import React from "react";
import { ConfigConnected } from "./ConfigConnected";
import { store } from "../../redux/slice";
import { Provider } from "react-redux";
import { Meta } from "@storybook/react/types-6-0";
import { Config } from "./Config";

export default { title: "App/Config", component: Config } as Meta;

export const ConfigConnectedEx = () => (
  <React.StrictMode>
    <Provider store={store}>
      <ConfigConnected />
    </Provider>
  </React.StrictMode>
);
