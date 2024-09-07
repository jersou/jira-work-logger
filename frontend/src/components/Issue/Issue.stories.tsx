import React, { useState } from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { Issue, IssueProps } from "./Issue";
import { IssueType } from "../../types";

export default {
  title: "App/Issue",
  component: Issue,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  argTypes: {},
} as Meta;

const Template: Story<IssueProps> = (args) => <Issue {...args} />;

export const issue = Template.bind({});
issue.args = { issue: { key: "ABC-123" }, jiraUrl: "https://jiraUrl/" };

export function IssueConnected() {
  const [issue, setIssue] = useState<IssueType>({ key: "ABC-123" });
  return (
    <Issue
      issue={issue}
      jiraUrl="https://jiraUrl/"
      onKeyChange={(key) => setIssue({ ...issue, key })}
      onCommentChange={(workLogComment) =>
        setIssue(
          { ...issue, workLogComment },
        )}
      onDelete={() => (console.log("onDelete"))}
    />
  );
}
