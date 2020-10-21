import React from 'react';
import {Story, Meta} from '@storybook/react/types-6-0';
import {WorkLogTable, WorkLogTableProps,} from './WorkLogTable';

export default {
  title: 'App/WorkLogTable',
  component: WorkLogTable,
  argTypes: {
    addRow: {action: 'addRow'},
    addColumn: {action: 'addColumn'},
    removeColumn: {action: 'removeColumn'},
    removeRow: {action: 'removeRow'},
    setDateValue: {action: 'setDateValue'},
    setHourValue: {action: 'setHourValue'},
    onIssueKeyUpdated: {action: 'onIssueKeyUpdated'}
  }
} as Meta;

const Template: Story<WorkLogTableProps> = (args) => <WorkLogTable {...args} />;

export const workLogTable = Template.bind({});
workLogTable.args = {
  data: {
    dates: [new Date(2020, 5, 25), new Date(2020, 5, 26), new Date(2020, 5, 27),],
    issues: [{key: 'AAA-123'}, {key: 'BBB-456'}],
    hours: [[1, 2], [3, 4], [5, 6]],
  },
  config: {
    jiraUrl: 'jiraUrl',
    username: 'username',
    password: 'password',
    hamsterIgnoreComment: 'to ignore',
    hamsterDaysToImport: 5
  }
}
