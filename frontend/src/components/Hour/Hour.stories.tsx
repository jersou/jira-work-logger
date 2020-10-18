import React, {useState} from 'react';
import {Story, Meta} from '@storybook/react/types-6-0';
import {Hour, HourProps} from "./Hour";


export default {
  title: 'App/Hour',
  component: Hour,
  argTypes: {setHour: {action: 'clicked'}},
} as Meta;

const Template: Story<HourProps> = (args) => <Hour {...args} />;

export const hour = Template.bind({});
hour.args = {hour: 3.7};

export function HourConnected() {
  const [hour, setHour] = useState(4.2);
  return <Hour hour={hour} setHour={setHour}/>
}

