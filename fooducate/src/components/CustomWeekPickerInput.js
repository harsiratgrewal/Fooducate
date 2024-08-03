import React from 'react';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

function CustomWeekPickerInput(props) {
  const { inputRef, inputProps, value, onChange, ...other } = props;

  const handleDateChange = (date) => {
    onChange(date);
  };

  const startOfWeek = value ? dayjs(value).startOf('week').format('MMM D') : '';
  const endOfWeek = value ? dayjs(value).endOf('week').format('MMM D') : '';
  const weekRange = value ? `${startOfWeek} - ${endOfWeek}` : '';

  return (
    <TextField
      {...other}
      inputRef={inputRef}
      InputProps={inputProps}
      value={weekRange}
      onClick={(e) => handleDateChange(dayjs(e.target.value))}
    />
  );
}

export default CustomWeekPickerInput;