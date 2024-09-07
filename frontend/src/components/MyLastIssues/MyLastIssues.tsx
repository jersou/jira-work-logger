import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@material-ui/core";
import "./myLastIssues.css";
import { ExpandMore, Refresh } from "@material-ui/icons";
import {
  ConfigData,
  IssueType,
  WorkLogTableData,
  WorksLogged,
} from "../../types";
import { genWl, getLastIssues } from "../../Jira";

export interface MyLastIssuesProps {
  issueClicked: ({ issue }: { issue: IssueType }) => void;
  config: ConfigData;
  data: WorkLogTableData;
  setWorksLogged: ({ worksLogged }: { worksLogged: WorksLogged }) => void;
}

export const MyLastIssues: React.FC<MyLastIssuesProps> = (
  { data, config, issueClicked, setWorksLogged },
) => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(
      () => getLastIssues(config).then((issues) => setIssues(issues)),
      1000,
    );
    return () => clearTimeout(timeout);
  }, [config]);

  useEffect(() => {
    setWorksLogged({ worksLogged: genWl(issues, config.username) });
  }, [config, setWorksLogged, issues]);

  const [expanded, setExpanded] = useState<string | false>("panel1");
  const handleChange =
    (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) =>
      setExpanded(newExpanded ? panel : false);

  return (
    <Accordion
      expanded={expanded === "panel1"}
      elevation={3}
      onChange={handleChange("panel1")}
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
        expandIcon={<ExpandMore />}
      >
        <Typography variant="h5" gutterBottom>Add issues</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button
            variant="contained"
            onClick={async () => setIssues(await getLastIssues(config))}
          >
            <Refresh />
          </Button>
        </div>
        <div className="last-issues">
          {issues
            .filter((issue: IssueType) =>
              !data.issues.map((i: IssueType) => i.key).includes(issue.key)
            )
            .map((issue: IssueType) => (
              <div key={issue.key}>
                <Button
                  variant="contained"
                  color="primary"
                  className="issue-btn"
                  onClick={() => issueClicked({ issue })}
                >
                  {issue.key} - {issue.fields?.summary}
                </Button>
              </div>
            ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
