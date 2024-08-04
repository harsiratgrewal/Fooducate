import { Stack, Typography } from '@mui/material'
import React from 'react'
import { BarChart } from '@mui/x-charts/BarChart';


export default function MonthlyNutrients() {
  return (
    <React.Fragment>
        <React.Fragment>
            <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium'}}>
                Monthly macronutrients
            </Typography>
            <BarChart
                xAxis={[{ scaleType: 'band', data:['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'], barGapRatio: 0.4, categoryGapRatio: 0.6 }]}
                series={[
                    { data: [25, 45, 15, 32, 25, 45, 15, 37], stack: 'A', label: 'Carbs', color: '#4B48FF'  },
                    { data: [25, 20, 45, 48, 25, 20, 45, 36], stack: 'A', label: 'Fats', color: '#D3D2FF' },
                    { data: [50, 35, 40, 20, 50, 35, 40, 27], stack: 'A', label: 'Proteins', color: '#EDECFF' },
                ]}
                borderRadius={30}
                slotProps={{
                    legend: {
                    direction: 'row',
                    position: { vertical: 'top', horizontal: 'right' },
                    padding: 0,
                    }}}
                
            />
            
        </React.Fragment>
    </React.Fragment>
  )
}