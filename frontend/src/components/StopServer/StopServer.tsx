import React from 'react';
import {CheckCircleOutline, ErrorOutline, Stop} from "@material-ui/icons";
import {Button} from "@material-ui/core";
import {WebsocketState} from "../../types";

async function close() {
  await fetch("http://localhost:8000/stop", {method: 'POST', mode: "no-cors"})
  window.open("about:blank", "_self");
  window.close();
}

export const StopServer = ({websocketState}: { websocketState: WebsocketState }) =>
  <>
    <Button variant="contained" size="small" onClick={close}>
      <Stop/> Stop the Web App {websocketState === 'OPEN' ?
      <CheckCircleOutline style={{fontSize: 20, marginLeft: 10}}/> : ''}
    </Button>
    {websocketState === 'CLOSE' ?
      <Button variant="contained" color="secondary"><ErrorOutline style={{marginRight: 10}}/> The backend Server is down
        !</Button> : ''}
  </>
