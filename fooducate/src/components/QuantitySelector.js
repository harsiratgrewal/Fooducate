import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const QuantitySelector = ({ value, onIncrease, onDecrease }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid', // Add this line to set the border
        borderColor: '#CFCFCF', // Set the border color here
        borderRadius: 2,
      }}
    >
      <IconButton onClick={onDecrease} sx={{ color: '#8B61E8' }}>
        <RemoveIcon />
      </IconButton>
      <Typography
        sx={{
          
          backgroundColor: '#F4EFFF',
          borderRadius: '15%',
          width: '2rem',
          height: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#8B61E8',
          fontWeight: 'bold',
        }}
      >
        {value}
      </Typography>
      <IconButton onClick={onIncrease} sx={{ color: '#8B61E8' }}>
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default QuantitySelector;