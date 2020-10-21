import React, {ChangeEvent} from 'react';
import TextField from '@material-ui/core/TextField';
import "./workLogDate.css";
import {default as dayjs} from 'dayjs';
import 'dayjs/locale/fr';

if (navigator.language === 'fr-FR') {
  dayjs.locale('fr')
}

export interface DateProps {
  date: Date,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void // TODO rename/refactor
}

export const WorkLogDate: React.FC<DateProps> = ({date, ...props}) =>
  <>
    <TextField className="workLogDate" type="date"
               value={date.toISOString().substr(0, 10)}
               style={{maxWidth: 140}}
               {...props}/>
    <div style={{fontSize: 20, marginTop: 4}}>{dayjs(date).format('dddd')}</div>
  </>;
