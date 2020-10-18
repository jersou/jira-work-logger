import React from 'react';
import {Story, Meta} from '@storybook/react/types-6-0';
import {ButtonBar, ButtonBarProps} from "./ButtonBar";

export default {
  title: 'App/ButtonBar',
  component: ButtonBar,
  argTypes: {
    clearData: {action: 'clearData'},
    hamsterImport: {action: 'hamsterImport'},
    addLast5Days: {action: 'addLast5Days'},
    createWorkLogs: {action: 'createWorkLogs'},
    setWorksLogged: {action: 'setWorksLogged'},
    resetHours: {action: 'resetHours'}
  },
} as Meta;

const Template: Story<ButtonBarProps> = (args) => <ButtonBar {...args} />;

export const config = Template.bind({});
config.args = {};


