import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';

export default function CategoryPieChart({ data }) {
  return (
    <Box sx={{ p: 2, height: '50%', display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      <Typography variant="h5" color="#232530">
        Objectives Distribution
      </Typography>
      <Typography variant="subtitle1" color="#232530">
        Amount of objectives incomplete in each category
      </Typography>
      <Box sx={{ width: '100%', height: 350 }}>
        <PieChart
          series={[
            {
              data: data.map((item) => ({
                ...item,
                color: item.color, // Use the color property
              })),
              outerRadius: 100,
              innerRadius: 70,
              cornerRadius: 3,
            },
          ]}
          margin={{ top: 10, bottom: 10, left: 10, right: 260 }}
          sx={{
            width: '100%',
            height: '100%',
            '& .MuiChartsLegend-root': {
              padding: 0,
            },
          }}
          slotProps={{
            legend: {
              direction: 'column',
              position: { vertical: 'middle', horizontal: 'right' },
              padding: 0,
            },
          }}
        />
      </Box>
    </Box>
  );
}