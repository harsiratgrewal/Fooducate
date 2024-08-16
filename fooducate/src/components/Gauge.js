import React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Box, Typography } from '@mui/material';



const NutritionGauge = ({ protein, max, category, color }) => {
  const percentage = (protein / max) * 100; // Assuming 50g is the daily goal for protein

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <Gauge
        value={percentage}
        max={120}
        width={120}
        height={120}
        valueLabelDisplay="on"
        text={`${Math.round(percentage)}g`}
        sx={(theme) => ({
          
           [`& .${gaugeClasses.valueText}`]: {
             fontSize: 19,
           },
            [`& .${gaugeClasses.valueArc}`]: {
               fill: color,
            },
            [`& .${gaugeClasses.referenceArc}`]: {
                fill: "rgba(231, 233, 243, 0.80)",
            },
        })}
      />
      <Typography variant="body2">{category.charAt(0).toUpperCase() + category.slice(1)}</Typography>
    </Box>
  );
};

export default NutritionGauge;