import React, {useState} from 'react';
import {Story, Meta} from '@storybook/react/types-6-0';
import {WorkLogDate, DateProps} from "./WorkLogDate";

export default {
  title: 'App/WorkLogDate',
  component: WorkLogDate,
  argTypes: {backgroundColor: {control: 'color'}},
} as Meta;

const Template: Story<DateProps> = (args) => <WorkLogDate {...args} />;

export const workLogDate = Template.bind({});
workLogDate.args = {date: new Date(2020, 2, 13)};

export function WorkLogDateConnected() {
  const [date, setDate] = useState(new Date());
  return <WorkLogDate date={date} onChange={e => setDate(new Date(e.target.value))}/>
}

