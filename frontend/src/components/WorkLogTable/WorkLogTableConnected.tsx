import {connect} from 'react-redux';
import {WorkLogTable} from "./WorkLogTable";
import {actions} from "../../redux/slice";
import {AppState} from "../../types";
import {onIssueKeyUpdatedThunk} from "../../redux/onIssueKeyUpdatedThunk";

export const WorkLogTableConnected = connect((state: AppState) => state, {
  ...actions,
  onIssueKeyUpdated: onIssueKeyUpdatedThunk
})(WorkLogTable);
