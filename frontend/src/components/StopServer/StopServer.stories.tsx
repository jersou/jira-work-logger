import React from 'react';
import {Meta} from '@storybook/react/types-6-0';
import {StopServer} from "./StopServer";

export default {
  title: 'App/StopServer',
  component: StopServer,
  argTypes: {
    setHour: {action: 'clicked'}
  },
} as Meta;

export const stopServer = () => <StopServer websocketState={"UNDEFINED"}/>
