import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { Config, ConfigProps } from "./Config";

export default {
  title: "App/Config",
  component: Config,
  argTypes: { setConfig: { action: "setConfig" } },
} as Meta;

const Template: Story<ConfigProps> = (args) => <Config {...args} />;

export const config = Template.bind({});
config.args = {
  config: {
    jiraUrl: "jiraUrl",
    username: "username",
    password: "password",
    token: "token",
    hamsterIgnoreComment: "none",
    hamsterDaysToImport: 5,
    hoursByDay: 8,
  },
};
