import React from 'react';
import TextField from '@material-ui/core/TextField';
import './issue.css'
import {Delete} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";
import {ConfigData, IssueType} from "../../types";

export interface IssueProps {
  issue: IssueType,
  onKeyChange: (key: string) => void,
  onCommentChange: (comment: string) => void,
  onDelete: () => void,
  jiraUrl: string
}

export const Issue: React.FC<IssueProps> = ({issue, onDelete, onKeyChange, onCommentChange, jiraUrl}) => {
  return <div>
    <div>
      <IconButton color="secondary" onClick={onDelete}>
        <Delete fontSize={"large"}/>
      </IconButton>
      <TextField className="issue" value={issue.key}
                 style={{maxWidth: 100, backgroundColor: issue.key.match(/^[A-Za-z]+-[0-9]+$/) ? '#edf4ff' : '#ffdbd0'}}
                 onChange={e => onKeyChange(e.target.value)}/>
      <TextField className="comment" value={issue.workLogComment}
                 placeholder='Work log comment'
                 style={{maxWidth: 160}}
                 onChange={e => onCommentChange(e.target.value)}/>
    </div>
    {issue.fields?.summary ?
      <div className="issue-summary">
        <a target="_blank" rel="noopener noreferrer" href={`${jiraUrl}/browse/${issue.key}`}>
          {issue.fields?.summary}
        </a>
      </div>
      : ''}
  </div>
};
