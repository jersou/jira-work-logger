import {connect} from 'react-redux';
import {MyLastIssues} from "./MyLastIssues";
import {actions} from "../../redux/slice";
import {AppState} from "../../types";

export const MyLastIssuesConnected = connect((state: AppState) => state, actions)(MyLastIssues);
