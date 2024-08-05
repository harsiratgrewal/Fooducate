import React from 'react';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

function CustomWeekPickerInput(props) {
  const { inputRef, inputProps, value, ...other } = props;

  const startOfWeek = value ? dayjs(value).startOf('week').format('MM/DD/YYYY') : '';
  const endOfWeek = value ? dayjs(value).endOf('week').format('MM/DD/YYYY') : '';
  const weekRange = value ? `${startOfWeek} - ${endOfWeek}` : '';
  
  return (
    <TextField
      {...other}
      inputRef={inputRef}
      InputProps={inputProps}
      value={weekRange}
      readOnly // Make the text field read-only to prevent manual input
    />
  );
}

export default CustomWeekPickerInput;