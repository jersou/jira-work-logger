import React from 'react';
import {Stop} from "@material-ui/icons";
import {Button} from "@material-ui/core";

async function close() {
  await fetch("http://localhost:8000/stop", {method: 'POST', mode: "no-cors"})
  window.open("about:blank", "_self");
  window.close();
}

export const StopServer = () =>
  <Button variant="contained" size="small" onClick={close}>
    <Stop/> Stop the Web App
  </Button>
