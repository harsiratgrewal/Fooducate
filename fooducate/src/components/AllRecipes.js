import { Typography, Box, Button, Card, Grid, CardMedia } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import Stack from '@mui/material/Stack';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

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
    <Box sx={{ padding: 1 }}>
      <Typography variant="h5" color="#494949" sx={{ fontWeight: 'medium' }}>
        Recipes
      </Typography>
      <StyledTabs value={value} sx={{ marginBottom: 2 }} onChange={handleChange}>
        <StyledTab sx={{ width: '10%' }} label="Breakfast" value="breakfast" />
        <StyledTab sx={{ width: '10%' }} label="Lunch" value="lunch" />
        <StyledTab sx={{ width: '10%' }} label="Dinner" value="dinner" />
        <StyledTab sx={{ width: '10%' }} label="Snacks" value="snacks" />
        <StyledTab sx={{ width: '10%' }} label="Sweets" value="sweets" />
      </StyledTabs>
       <Box style={{ maxHeight: '72vh', overflowY: 'auto' }}>
        <Grid container sx={{ width: '100%' }} rowSpacing={{ xs: 3, sm: 2, md: 3, lg: 2, xl: 2 }} columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 2, xl: 2 }} columns={12}>
            {recipes.map((recipe, index) => {
              const totalMinutes = recipe.cookTime + recipe.prepTime;
              let totalTime = '';
              if (totalMinutes > 60) {
                const hours = totalMinutes / 60;
                const minutes = totalMinutes % 60;
                totalTime = `${Math.trunc(hours)} hr ${minutes} mins`;
              } else {
                totalTime = `${totalMinutes} mins`
              }
              return (
              <Grid item xs={6} sm={6} md={4} xl={4} lg={6}>
                <Card variant="outlined" sx={{ borderColor: '#E2E6F7', borderWidth: 2, borderRadius: 3, height: '100%'}}>
                  <CardContent sx={{  paddingTop: '0.75rem'  }}>
                    <Typography sx={{ fontSize: 17  }}>
                        {recipe.name}
                    </Typography>
                    <Stack direction="row" sx={{marginTop: '0.75rem'}} spacing={2} alignItems="center">
                      <Stack direction="row" justifyContent="flex-start" alignItems="center">
                      <AccessTimeFilledIcon  sx={{ fontSize: 16, color: '#6F6DCF'}} />

                      <Typography sx={{ fontSize: 13, marginLeft: 0.5 }}>{totalTime}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="flex-start" alignItems="center">
                      <LocalFireDepartmentIcon fontSize='small' sx={{ color: '#4B49C3'}} />
                      <Typography sx={{ fontSize: 13, marginLeft: 0.5 }}>{recipe.nutrients.calories} cal</Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                  <CardActions sx={{  paddingBottom: '1rem', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'  }}>
                    
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      onClick={() => handleRecipeClick(recipe)}
                      sx={{  textTransform: 'none', textAlign: 'center', borderColor: '#D6D9E8', borderWidth: 2, color: '#8B61E8',  width: 110, height: 27, borderRadius: 3 }}
                    >View details</Button>
                  </CardActions>
                </Card>
                </Grid>
                )
              })}
              
        </Grid>
        </Box>
      </Box>
  );
}
