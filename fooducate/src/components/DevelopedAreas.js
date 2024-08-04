import React from 'react';
import { Box, Typography, LinearProgress, Grid } from '@mui/material';

export default function DevelopedAreas({ data }) {
  return (
    <Box sx={{ marginTop: 3, display: 'flex', flexDirection: 'column', justifyContent: 'start', p: 2, height: '50%', overflowY: 'auto' }}>
      <Typography variant="h5" color="#232530">
        Developed Areas
      </Typography>
      <Typography className='mb-3' variant="subtitle1" color="#232530">
        Progress for each area of interest
      </Typography>
      {data.map((item, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={6}>
              <Typography sx={{ fontSize: 18 }}>{item.category}</Typography>
            </Grid>
            <Grid item xs={5}>
              <LinearProgress variant="determinate" 
              sx={{
                backgroundColor: '#D9DADF',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  backgroundColor: "#996BFF",
                },
                }} 
                value={item.completedPercentage} 
                />
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body1" sx={{ ml: 1 }}>{item.completedPercentage}%</Typography>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
}