import {connect} from "react-redux";
import {AppState} from "../../types";
import {actions} from "../../redux/slice";
import {importHamsterReportThunk} from "../../redux/importHamsterReportThunk";
import {ButtonBar} from "./ButtonBar";
import {createWorkLogsThunk} from "../../redux/createWorkLogsThunk";

export const ButtonBarConnected = connect((state: AppState) => state, {
  ...actions,
  hamsterImport: importHamsterReportThunk,
  createWorkLogs: createWorkLogsThunk
})(ButtonBar);
