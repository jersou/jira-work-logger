import {WorkLogTableData, WorksLogged} from "../../types";
import TableCell from "@material-ui/core/TableCell";
import {round2} from "../../utils";
import React from "react";
import TableRow from "@material-ui/core/TableRow";
import {Button} from "@material-ui/core";
import {Add} from "@material-ui/icons";

export function totColumn(data: WorkLogTableData, num: number): number {
  return round2(data.hours[num].reduce((tot, curr) => tot + curr, 0))
}

function getWorklogged(worksLogged: WorksLogged, date: Date) {
  const found = worksLogged ? Object.entries(worksLogged).find(([k, v]) => k === date.toISOString().substr(0, 10)) : 0
  return found ? round2(found[1] / 3600) : 0
}

export function tot(data: WorkLogTableData): number {
  return round2(
    data.hours
      .map(col => col.reduce((tot, curr) => tot + curr, 0))
      .reduce((tot, curr) => tot + curr, 0)
  )
}

export function TotColRow({
                            addRow,
                            data,
                            worksLogged
                          }: { addRow: () => void, data: WorkLogTableData, worksLogged: WorksLogged }) {
  return <TableRow className='total-row'>
    <TableCell align="center" className="add-button">
      <Button color="primary" onClick={addRow}><Add style={{fontSize: 40}}/></Button>
    </TableCell>
    {data.dates.map((date, x) => <TotDateCell {...{x, date, worksLogged, data}} key={x + date.toISOString()}/>)}
    <TableCell style={{fontSize: 20, textAlign: 'center', minWidth: 100}} className="total">{tot(data)}</TableCell>
  </TableRow>;
}

function TotDateCell({
                       x,
                       date,
                       worksLogged,
                       data
                     }: { x: number, date: Date, worksLogged: WorksLogged, data: WorkLogTableData }) {
  return <TableCell align="center" className="total">
    <div style={{color: '#a91b1b', fontSize: 16}}>Already Logged >= {getWorklogged(worksLogged, date)}</div>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <TotDate total={round2(totColumn(data, x) + getWorklogged(worksLogged, date))}/>
    </div>
  </TableCell>;
}

function TotDate({total}: { total: number }) {
  let backgroundColor = ''
  switch (true) {
    case total < 0:
    case total > 7.4:
      backgroundColor = '#ff0000';
      break;
    case total === 0:
      backgroundColor = '#ffbebe'
      break;
    case total === 3.7:
      backgroundColor = '#96bfff'
      break;
    case total === 7.4:
      backgroundColor = '#89ff6f'
      break;
    default:
      backgroundColor = '#ffc594'
      break;
  }
  return <div style={{backgroundColor, fontSize: 20, borderRadius: 20, width: 100}}>{total}</div>
}
