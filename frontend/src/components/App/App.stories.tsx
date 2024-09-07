import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { AppConnected } from "./App";
import { Provider } from "react-redux";
import { store } from "../../redux/slice";

export default {
  title: "App/root",
  component: AppConnected,
  argTypes: {},
} as Meta;

export const appRoot = () => (
  <Provider store={store}>
    <AppConnected />
  </Provider>
);
