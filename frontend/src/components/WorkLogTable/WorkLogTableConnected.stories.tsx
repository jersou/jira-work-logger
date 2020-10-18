import React from 'react';
import {WorkLogTableConnected} from "./WorkLogTableConnected";
import {store} from "../../redux/slice";
import {Provider} from "react-redux";
import {Meta} from "@storybook/react/types-6-0";

export default {title: 'App/WorkLogTable', component: WorkLogTableConnected} as Meta;

export const workLogTableConnected = () => <Provider store={store}><WorkLogTableConnected/></Provider>

