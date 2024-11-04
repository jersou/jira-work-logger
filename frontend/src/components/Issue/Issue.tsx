import React from "react";
import TextField from "@mui/material/TextField";
import "./issue.css";
import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { IssueType } from "../../types";

export interface IssueProps {
  issue: IssueType;
  onKeyChange: (key: string) => void;
  onCommentChange: (comment: string) => void;
  onDelete: () => void;
  jiraUrl: string;
}

export const Issue: React.FC<IssueProps> = ({ issue, onDelete, onKeyChange, onCommentChange, jiraUrl }) => {
  return (
    <div>
      <div style={{ display: "flex" }}>
        <IconButton color="secondary" onClick={onDelete}>
          <Delete fontSize={"large"} />
        </IconButton>
        <TextField
          className="issue"
          value={issue.key}
          style={{
            maxWidth: 100,
            backgroundColor: issue.key.match(/^[A-Za-z0-9]+-[0-9]+$/) ? "#edf4ff" : "#ffdbd0",
          }}
          onChange={(e) => onKeyChange(e.target.value)}
        />
        <TextField
          className="comment"
          value={issue.workLogComment}
          placeholder="Work log comment"
          style={{ minWidth: 150, flex: 1 }}
          onChange={(e) => onCommentChange(e.target.value)}
        />
      </div>
      {issue.fields?.summary ? (
        <div className="issue-summary">
          <a target="_blank" rel="noopener noreferrer" href={`${jiraUrl}/browse/${issue.key}`}>
            {issue.fields?.summary}
          </a>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
