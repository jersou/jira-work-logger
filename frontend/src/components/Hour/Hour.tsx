import React from "react";
import TextField from "@material-ui/core/TextField";
import "./hour.scss";
import { Add, Remove } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import { round2 } from "../../utils";

export interface HourProps {
  hour: number;
  setHour: (hour: number) => void;
}

const hueMax = 250;
const hueMin = 50;
const hourMax = 7.4;
const step = 1.85;

function getHourColor(hour: number): string {
  switch (true) {
    case hour <= 0:
      return "#fff";
    case hour > hourMax:
      return `hsl(${hueMin},100%,76%)`;
    default:
      return `hsl(${hueMax - (hour / hourMax) * (hueMax - hueMin)},100%,76%)`;
  }
}

function decHouc(hour: number) {
  round2(hour = hour - step);
  return hour < 0 ? 0 : hour;
}

function incHour(hour: number) {
  round2(hour = hour + step);
  return hour > hourMax ? hourMax : hour;
}

export const Hour: React.FC<HourProps> = ({ hour, setHour, ...props }) => (
  <div className="hour-cell">
    <Button size="small" onClick={() => setHour(decHouc(hour))}>
      <Remove />
    </Button>
    <div>
      <TextField
        className="hour"
        type="number"
        value={round2(hour)}
        style={{
          backgroundColor: getHourColor(hour),
          borderRadius: 20,
          paddingLeft: 10,
        }}
        onWheel={(e) => {
          e.deltaY > 0 ? setHour(decHouc(hour)) : setHour(incHour(hour));
          e.preventDefault();
        }}
        onChange={(e) => setHour(Number(e.target.value))}
        InputProps={{ inputProps: { min: 0, max: 7.4, step } }}
        {...props}
      />
    </div>
    <Button size="small" onClick={() => setHour(incHour(hour))}>
      <Add />
    </Button>
  </div>
);
