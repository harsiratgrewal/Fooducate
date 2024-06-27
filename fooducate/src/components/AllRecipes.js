import { Typography, Box, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

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

export default function AllRecipes({ onSelectRecipe, onCategoryChange }) {
  const [value, setValue] = useState('breakfast');
  const [recipes, setRecipes] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    fetchRecipes(newValue);
    onCategoryChange(); // Notify parent about the category change
  };

  const fetchRecipes = async (category) => {
    try {
      const querySnapshot = await getDocs(collection(db, category));
      const recipesList = querySnapshot.docs.map((doc) => doc.data());
      console.log(`Fetched ${category} recipes:`, recipesList);  // Debugging line
      setRecipes(recipesList);
    } catch (error) {
      console.error(`Error fetching ${category} recipes:`, error);  // Error handling
    }
  };

  useEffect(() => {
    fetchRecipes('breakfast');
  }, []);

  const handleRecipeClick = (recipe) => {
    onSelectRecipe(recipe);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" color="#494949" sx={{ fontWeight: 'medium' }}>
        Recipes
      </Typography>
      <StyledTabs value={value} onChange={handleChange}>
        <StyledTab sx={{ width: '20%' }} label="Breakfast" value="breakfast" />
        <StyledTab sx={{ width: '20%' }} label="Lunch" value="lunch" />
        <StyledTab sx={{ width: '20%' }} label="Dinner" value="dinner" />
        <StyledTab sx={{ width: '20%' }} label="Snacks" value="snacks" />
        <StyledTab sx={{ width: '20%' }} label="Sweets" value="sweets" />
      </StyledTabs>
      <Box sx={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>  {/* Adjust height as needed */}
        {recipes.map((recipe, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => handleRecipeClick(recipe)}
            sx={{ display: 'block', margin: 2, width: '100%', textAlign: 'left' }}
          >
            {recipe.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
