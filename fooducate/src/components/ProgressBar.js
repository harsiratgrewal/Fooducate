import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';

const CustomLinearProgress = styled(LinearProgress)(({ color }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: '#FFFFFF',
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: "#4442B1",
  },
}));

const ProgressBar = ({ value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-evenly" alignItems="left" sx={{ marginBottom: 2, borderRadius: 3, padding: 1, height: '100%', width: '100%', marginRight: 2, backgroundColor: "#C8D7F5" }}>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <Typography className='fw-light' sx={{ fontSize: 18 }} color="#2A2D48">Protein</Typography>
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

export default ProgressBar;