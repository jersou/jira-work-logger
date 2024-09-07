import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { MyLastIssues, MyLastIssuesProps } from "./MyLastIssues";

export default {
  title: "App/MyLastIssues",
  component: MyLastIssues,
  argTypes: {
    issueClicked: { action: "issueClicked" },
    setWorksLogged: { action: "setWorksLogged" },
  },
} as Meta;

const Template: Story<MyLastIssuesProps> = (args) => <MyLastIssues {...args} />;

export const myLastIssues = Template.bind({});
myLastIssues.args = {
  data: {
    dates: [
      new Date(2020, 5, 25),
      new Date(2020, 5, 26),
      new Date(2020, 5, 27),
    ],
    issues: [{ key: "AAA-123" }, { key: "BBB-456" }],
    hours: [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
  },
  config: {
    jiraUrl: "jiraUrl",
    username: "username",
    password: "password",
    token: "token",
    hamsterIgnoreComment: "",
    hamsterDaysToImport: 2,
  },
  issueClicked: () => console.log("issueClicked"),
  setWorksLogged: () => console.log("setWorksLogged"),
};
