import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';

const CustomLinearProgress = styled(LinearProgress)(({ color }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: '#FFFFFF',
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: "#5D5AE6",
  },
}));

const FatsProgressBar = ({ value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <Box display="flex" flexDirection="column" alignItems="left" justifyContent="space-evenly" sx={{ marginBottom: 2, borderRadius: 3, padding: 1, height: '100%', width: '100%', marginRight: 2, backgroundColor: "#C8C7FF" }}>
      <div className="d-flex flex-row justify-content-between align-items-start">
        <Typography className='fw-light' sx={{ fontSize: 18 }} color="#2A2D48">Fats</Typography>
        
      <Typography variant="body1" color="#373737">
        {value}/{max} gm
      </Typography>
      </div>
      <Box sx={{ width: '100%', marginRight: 1 }}>
        <CustomLinearProgress variant="determinate" value={percentage} />
      </Box>
      
    </Box>
  );
};

export default FatsProgressBar;