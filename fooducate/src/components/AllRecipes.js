import { Stack, Typography, Box } from '@mui/material'
import React, { useState } from 'react'
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';


export default function AllRecipes() {
  const [value, setValue] = useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <React.Fragment>
        <React.Fragment>
            <Typography variant="h5" color="#494949" sx={{ fontWeight: 'medium'}}>
                Recipes
            </Typography>
            <Tabs
              value={value}
              onChange={handleChange}
            >
              <Tab sx={{ width: '10%' }} label="Breakfast" />
              <Tab sx={{ width: '10%'}}label="Lunch" />
              <Tab sx={{ width: '10%'}} label="Dinner" />
              <Tab sx={{ width: '10%'}} label="Snacks" />
              <Tab sx={{ width: '10%'}} label="Sweets" />
            </Tabs>
        </React.Fragment>
    </React.Fragment>
  )
}