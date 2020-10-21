import React from 'react';
import TextField from '@material-ui/core/TextField';
import './config.css';
import {Clear, ExpandMore} from "@material-ui/icons";
import {
  Accordion, AccordionDetails, AccordionSummary, Button, Typography
} from "@material-ui/core";
import {ConfigData} from "../../types";

export type ConfigProps = {
  config: ConfigData;
  setConfig: ({config}: { config: ConfigData }) => void;
  resetConfig: () => void;
}

export function Config({config, setConfig, resetConfig}: ConfigProps) {
  return <Accordion elevation={3}>
    <AccordionSummary expandIcon={<ExpandMore/>}>
      <Typography variant="h5" gutterBottom>Configuration</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <form noValidate autoComplete="off">
        <TextField label="Jira Url" style={{minWidth: 300}}
                   value={config.jiraUrl}
                   onChange={e => setConfig({config: {...config, jiraUrl: e.target.value}})}
        />
        <TextField label="Username" value={config.username}
                   onChange={e => setConfig({config: {...config, username: e.target.value}})}
        />
        <TextField label="password"
                   type="password"
                   value={config.password}
                   aria-autocomplete="none"
                   autoComplete="off"
                   onChange={e => setConfig({config: {...config, password: e.target.value}})}
        />
        <TextField label="Hamster comments to ignore (regex)"
                   style={{minWidth: 300}}
                   value={config.hamsterIgnoreComment}
                   onChange={e => setConfig({config: {...config, hamsterIgnoreComment: e.target.value}})}
        />
        <TextField label="Nb of days to import from Hamster"
                   style={{minWidth: 300}}
                   type="number"
                   value={config.hamsterDaysToImport}
                   onChange={e => setConfig({config: {...config, hamsterDaysToImport: Number(e.target.value)}})}
        />
        <Button variant="contained" size="small" onClick={resetConfig}>
          <Clear/> Reset config
        </Button>
      </form>
    </AccordionDetails>
  </Accordion>
}
