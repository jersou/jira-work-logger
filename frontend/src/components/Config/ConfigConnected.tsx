import {connect} from 'react-redux';
import {Config} from "./Config";
import {actions} from "../../redux/slice";
import {AppState} from "../../types";

export const ConfigConnected = connect((state: AppState) => state, actions)(Config);
