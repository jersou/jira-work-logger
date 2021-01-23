import React, {useState} from "react";
import TableCell from "@material-ui/core/TableCell";
import {Issue} from "../Issue/Issue";
import {IssueType, WorkLogTableData} from "../../types";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import TableRow from "@material-ui/core/TableRow";
import {Hour} from "../Hour/Hour";
import {round2} from "../../utils";

type IssueCellProps = {
  issue: IssueType,
  removeRow: ({num}: { num: number }) => void,
  y: number,
  onIssueKeyUpdated: (timeout: NodeJS.Timeout | undefined, setTimeoutRef: ((timeout: NodeJS.Timeout) => void), i: IssueType, y: number, newData: { key?: string; comment?: string }) => void
  jiraUrl: string
}

function IssueCell({issue, removeRow, y, onIssueKeyUpdated, jiraUrl}: IssueCellProps) {
  const [timeout, setTimeoutRef] = useState<NodeJS.Timeout>()
  return <TableCell component="th" align="center" className="row-header">
    <Issue issue={issue}
           jiraUrl={jiraUrl}
           onDelete={() => removeRow({num: y})}
           onKeyChange={key => onIssueKeyUpdated(timeout, setTimeoutRef, issue, y, {key})}
           onCommentChange={comment => onIssueKeyUpdated(timeout, setTimeoutRef, issue, y, {comment})}/>
  </TableCell>;
}

export function totRow(data: WorkLogTableData, num: number): number {
  return round2(data.hours.map(col => col[num]).reduce((tot, curr) => tot + curr, 0))
}

type WorkLogTableRowProps = {
  issue: IssueType,
  y: number;
  removeRow: ({num}: { num: number }) => void;
  onIssueKeyUpdated: (
    timeout: (NodeJS.Timeout | undefined),
    setTimeoutRef: (timeout: NodeJS.Timeout) => void,
    issue: IssueType, y: number, newData: { key?: string; comment?: string }
  ) => void;
  data: WorkLogTableData;
  setHourValue: ({x, y, hour}: { x: number; y: number; hour: number }) => void;
  jiraUrl: string;
}

export function WorkLogTableIssueRow({
                                       issue,
                                       y,
                                       removeRow,
                                       onIssueKeyUpdated,
                                       data,
                                       setHourValue,
                                       jiraUrl
                                     }: WorkLogTableRowProps) {
  return <TableRow className={y % 2 ? 'odd' : 'even'}>
    <IssueCell {...{issue, removeRow, y, onIssueKeyUpdated, jiraUrl}}/>
    {data.dates.map((date, x) => (
      <TableCell key={x + date.toISOString()} align="center" style={{position: 'relative'}}>
        <Hour hour={data.hours[x][y]} setHour={hour => setHourValue({x, y, hour})}/>
      </TableCell>
    ))}
    <TableCell style={{fontSize: 20, textAlign: 'center', minWidth: 100}} className="total">{totRow(data, y)}
    </TableCell>
  </TableRow>;
}

type WorkLogTableIssueRowsProps = {
  data: WorkLogTableData,
  removeRow: ({num}: { num: number }) => void,
  onIssueKeyUpdated: (
    timeout: (NodeJS.Timeout | undefined),
    setTimeoutRef: (timeout: NodeJS.Timeout) => void,
    issue: IssueType, y: number, newData: { key?: string; comment?: string }
  ) => void,
  setHourValue: ({x, y, hour}: { x: number; y: number; hour: number }) => void,
  jiraUrl: string
}

export function WorkLogTableIssueRows({
                                        data,
                                        removeRow,
                                        onIssueKeyUpdated,
                                        setHourValue,
                                        jiraUrl
                                      }: WorkLogTableIssueRowsProps) {
  return <TransitionGroup component={null}>
    {data.issues.map((issue, y) =>
      <CSSTransition timeout={1000} classNames="issue-el" key={issue.reactKey}>
        <WorkLogTableIssueRow {...{issue, y, removeRow, onIssueKeyUpdated, data, setHourValue, jiraUrl}}/>
      </CSSTransition>
    )}
  </TransitionGroup>;
}
