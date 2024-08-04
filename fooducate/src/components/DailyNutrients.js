import { Stack, Typography } from '@mui/material'
import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';


export default function DailyNutrients() {
  return (
    <React.Fragment>
        <React.Fragment>
            
            <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium'}}>
                Daily macronutrients
            </Typography>
            
             <PieChart
                series={[
                    {
                    data: [
                        { id: 0, value: 10, label: 'series A', color: '#4442B1' },
                        { id: 1, value: 15, label: 'series B', color: '#5362E3' },
                        { id: 2, value: 20, label: 'series C', color: '#996BFF' },
                    ],
                    outerRadius: 100,
                    innerRadius: 70,
                    cornerRadius: 3
                    

                    },
                    
                ]}
                slotProps={{
                        legend: {
                        hidden: true
                        },
                    }}
                
                />
                
        </React.Fragment>
    </React.Fragment>
  )
}