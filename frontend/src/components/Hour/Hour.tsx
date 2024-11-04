import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import "./hour.scss";
import { Add, Remove } from "@mui/icons-material";
import { Button } from "@mui/material";
import { round2 } from "../../utils";
import { AppState } from "../../types";

export interface HourProps {
  hour: number;
  setHour: (hour: number) => void;
}

const hueMax = 250;
const hueMin = 50;

function getHourColor(hour: number, hourMax: number): string {
  switch (true) {
    case hour <= 0:
      return "#fff";
    case hour > hourMax:
      return `hsl(${hueMin},100%,76%)`;
    default:
      return `hsl(${hueMax - (hour / hourMax) * (hueMax - hueMin)},100%,76%)`;
  }
}

function decHouc(hour: number, step: number) {
  round2((hour = hour - step));
  return hour < 0 ? 0 : hour;
}

function incHour(hour: number, hourMax: number) {
  round2((hour = hour + hourMax / 4));
  return hour > hourMax ? hourMax : hour;
}

export const Hour: React.FC<HourProps> = ({ hour, setHour, ...props }) => {
  const state = useState<AppState>() as unknown as AppState;
  const hourMax = state?.config?.hoursByDay || 8;
  return (
    <div className="hour-cell">
      <Button size="small" onClick={() => setHour(decHouc(hour, hourMax / 4))}>
        <Remove />
      </Button>
      <div>
        <TextField
          className="hour"
          type="number"
          value={round2(hour)}
          style={{
            backgroundColor: getHourColor(hour, hourMax),
            borderRadius: 20,
            paddingLeft: 10,
          }}
          onWheel={(e) => {
            e.deltaY > 0 ? setHour(decHouc(hour, hourMax / 4)) : setHour(incHour(hour, hourMax));
            e.preventDefault();
          }}
          variant="standard"
          onChange={(e) => setHour(Number(e.target.value))}
          InputProps={{ disableUnderline: true, inputProps: { min: 0, max: hourMax, step: hourMax / 4 } }}
          {...props}
        />
      </div>
      <Button size="small" onClick={() => setHour(incHour(hour, hourMax))}>
        <Add />
      </Button>
    </div>
  );
};
