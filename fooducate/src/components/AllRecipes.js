import { Stack, Typography, Box, backdropClasses } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import { collection, getDocs } from "firebase/firestore";
import {db} from "../firebase/firebase";


const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
  ))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    
  },
  '& .MuiTabs-indicatorSpan': {
    width: '100%',
    backgroundColor: '#996BFF'
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: '#494949',
    '&.Mui-selected': {
      color: '#996BFF',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&.Mui-selected:hover': {
      backgroundColor: "rgba(153, 107, 255, 0.1)"
    },
    '&:hover': {
      backgroundColor: "rgba(177, 177, 177, 0.15)",
    },
  }),
);


export default function AllRecipes() {
  const [value, setValue] = useState('one');
  const [recipes, setRecipes] = useState([]);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  
  return (
    <React.Fragment>
        <React.Fragment>
            <Typography variant="h5" color="#494949" sx={{ fontWeight: 'medium'}}>
                Recipes
            </Typography>
            <StyledTabs
              value={value}
              onChange={handleChange}
            >
              <StyledTab sx={{ width: '10%' }} label="Breakfast" />
              <StyledTab sx={{ width: '10%'}}label="Lunch" />
              <StyledTab sx={{ width: '10%'}} label="Dinner" />
              <StyledTab sx={{ width: '10%'}} label="Snacks" />
              <StyledTab sx={{ width: '10%'}} label="Sweets" />
            </StyledTabs>
        </React.Fragment>
    </React.Fragment>
  )
}