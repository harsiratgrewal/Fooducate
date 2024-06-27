import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AllRecipes from '../components/AllRecipes';
import Typography from '@mui/material/Typography';

function Meals() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCategoryChange = () => {
    setSelectedRecipe(null);
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          bgcolor: '#F0F3FF',
          height: '100vh',
          overflow: 'auto',
          width: '100%',
          padding: 2,
        }}
      >
        <Grid container spacing={1.5} columns={12}>
          <Grid item xs={8}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                display: 'flex',
                backgroundColor: "#FEFEFF",
                flexDirection: 'column',
                height: '100vh',
                borderRadius: 4,
                overflow: 'auto'  // Add this line
              }}
            >
              <AllRecipes onSelectRecipe={handleSelectRecipe} onCategoryChange={handleCategoryChange} />
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: 'flex',
                backgroundColor: "#FEFEFF",
                flexDirection: 'column',
                height: '100vh',
                borderRadius: 4,
              }}
            >
              {selectedRecipe ? (
                <Box sx={{ padding: 2 }}>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {selectedRecipe.name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRecipe.description}
                  </Typography>
                  {selectedRecipe.ingredients && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                        Ingredients
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {selectedRecipe.ingredients.join(', ')}
                      </Typography>
                    </Box>
                  )}
                  {selectedRecipe.steps && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                        Steps
                      </Typography>
                      {selectedRecipe.steps.map((step, index) => (
                        <Typography key={index} variant="body2" color="textSecondary">
                          {index + 1}. {step}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  {selectedRecipe.nutrients && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                        Nutrients
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Calories: {selectedRecipe.nutrients.calories}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Protein: {selectedRecipe.nutrients.protein}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Carbs: {selectedRecipe.nutrients.carbs}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Fat: {selectedRecipe.nutrients.fat}
                      </Typography>
                    </Box>
                  )}
                  {selectedRecipe.prepTime && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      Prep Time: {selectedRecipe.prepTime}
                    </Typography>
                  )}
                  {selectedRecipe.cookTime && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      Cook Time: {selectedRecipe.cookTime}
                    </Typography>
                  )}
                  {selectedRecipe.servings && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      Servings: {selectedRecipe.servings}
                    </Typography>
                  )}
                  {selectedRecipe.averageCost && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      Average Cost: {selectedRecipe.averageCost}
                    </Typography>
                  )}
                  {selectedRecipe.notes && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      Notes: {selectedRecipe.notes}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="h6">Select a recipe to see the details</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Meals;
