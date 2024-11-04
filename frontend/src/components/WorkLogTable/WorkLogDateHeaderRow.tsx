import { WorkLogTableData } from "../../types";
import TableCell from "@mui/material/TableCell";
import { Button, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { WorkLogDate } from "../Date/WorkLogDate";
import React from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

type HeaderDateCellProps = {
  x: number;
  date: Date;
  removeColumn: ({ num }: { num: number }) => void;
  setDateValue: ({ num, date }: { num: number; date: Date }) => void;
};

function HeaderDateCell({ x, date, removeColumn, setDateValue }: HeaderDateCellProps) {
  return (
    <TableCell align="center">
      <IconButton color="secondary" onClick={() => removeColumn({ num: x })}>
        <Delete fontSize={"large"} />
      </IconButton>
      <WorkLogDate date={date} onChange={(e) => setDateValue({ num: x, date: new Date(e.target.value) })} />
    </TableCell>
  );
}

type WorkLogDateHeaderRowProps = {
  data: WorkLogTableData;
  removeColumn: ({ num }: { num: number }) => void;
  setDateValue: ({ num, date }: { num: number; date: Date }) => void;
  addColumn: () => void;
};

export function WorkLogDateHeaderRow({ data, removeColumn, setDateValue, addColumn }: WorkLogDateHeaderRowProps) {
  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <div style={{ minWidth: 100, minHeight: 50 }}>&nbsp;</div>
        </TableCell>
        {data.dates.map((date, x) => (
          <HeaderDateCell {...{ x, date, removeColumn, setDateValue }} key={x + date.toISOString()} />
        ))}
        <TableCell style={{ fontSize: 20, textAlign: "center" }} className="add-button">
          <Button color="primary" onClick={addColumn}>
            <Add style={{ fontSize: 40 }} />
          </Button>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
