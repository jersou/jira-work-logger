import React from 'react';
import {CheckCircleOutline, ErrorOutline, Stop} from "@material-ui/icons";
import {Button} from "@material-ui/core";
import {WebsocketState} from "../../types";
import Tooltip from '@material-ui/core/Tooltip';

async function close() {
  await fetch("http://localhost:8000/stop", {method: 'POST', mode: "no-cors"})
  window.open("about:blank", "_self");
  window.close();
}


const backendStatusTootilpTitleMap: { [key: string]: string } = {
  "CLOSE": 'The backend server is DOWN',
  "ERROR": 'The backend server status is impossible to determine (use the --wait-and-close parameter) or the server was DOWN even before opening the page',
  "OPEN": 'The backend server is currently UP and connected',
  "UNDEFINED": 'The backend server status is undefined',
}

export const StopServer = ({websocketState}: { websocketState: WebsocketState }) =>
  <>
    {websocketState === 'CLOSE' ?
      <Tooltip title="Restart the server, and then refresh the page">
        <Button variant="contained" color="secondary">
          <ErrorOutline style={{marginRight: 10}}/>The backend Server is down !
        </Button>
      </Tooltip>
      :
      <Tooltip title={backendStatusTootilpTitleMap[websocketState]}>
        <Button variant="contained" size="small" onClick={close}>
          <Stop/> Stop the Web App {websocketState === 'OPEN' ?
          <CheckCircleOutline style={{fontSize: 20, marginLeft: 10, color: 'green'}}/> : ''}
        </Button>
      </Tooltip>
    }
  </>
