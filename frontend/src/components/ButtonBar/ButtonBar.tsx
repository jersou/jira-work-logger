import {genWl, getLastIssues} from "../../Jira";
import {Button} from "@material-ui/core";
import {Add, Delete, GetApp, Send} from "@material-ui/icons";
import {StopServer} from "../StopServer/StopServer";
import React from "react";
import {ConfigData, WorksLogged} from "../../types";

export type ButtonBarProps = {
  config: ConfigData;
  clearData: () => void;
  hamsterImport: () => void;
  addLast5Days: () => void;
  createWorkLogs: () => void;
  setWorksLogged: ({worksLogged}: { worksLogged: WorksLogged }) => void;
  resetHours: () => void;
}

export function ButtonBar({clearData, addLast5Days, hamsterImport, createWorkLogs, setWorksLogged, resetHours, config}: ButtonBarProps) {
  async function createWorkLogAndUpdate() {
    createWorkLogs()
    setWorksLogged({worksLogged: genWl(await getLastIssues(config), config.username)})
    resetHours();
  }

  return <div className="btn-part">
    <Button variant="contained" size="small" onClick={clearData}>
      <Delete/> Clear the data
    </Button>
    <Button variant="contained" size="small" onClick={addLast5Days}>
      <Add/> add last 5 days
    </Button>
    <Button variant="contained" size="small" onClick={hamsterImport}>
      <GetApp/> Import from Hamster
    </Button>
    <StopServer/>
    <Button variant="contained" color="secondary" onClick={createWorkLogAndUpdate}>
      <Send/> Log this work logs</Button>
  </div>
}
