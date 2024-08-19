import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AllRecipes from '../components/AllRecipes';
import Typography from '@mui/material/Typography';
import { Button, Card, Divider, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import IngredientsCard from '../components/IngreidientsCard';


function Meals() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [setChecked] = useState({});
  const navigate = useNavigate();

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCategoryChange = () => {
    setSelectedRecipe(null);
  };

  const handleCookItClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  // const handleToggle = (name) => () => {
  //   setChecked((prev) => {
  //     const newChecked = { ...prev, [name]: !prev[name] };
  //     console.log(`Item ${name} checked: ${newChecked[name]}`);
  //     return newChecked;
  //   });
  // };

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
          
        }}
      >
        <Grid container sx={{ paddingLeft: 1.5 }} spacing={1.5} columns={16}>
          <Grid item xs={11}>
            <div className="row mt-1 g-2">
              <div className="col-12">
                  <div className="row mb-2">
                       <Header />
                   </div>
              </div>
              <div className="col-12">
            <Paper
              elevation={1}
              sx={{
                p: 2,
                display: 'flex',
                backgroundColor: "#FEFEFF",
                flexDirection: 'column',
                height: '100%',
                borderRadius: 3,
                  // Add this line
              }}
            >
              <AllRecipes onSelectRecipe={handleSelectRecipe} onCategoryChange={handleCategoryChange} />
            </Paper>
            </div>
            </div>
          </Grid>
          <Grid item xs={5} sx={{ paddingBottom: 0, paddingTop: 0 }}>
            <Paper
              elevation={2}
              sx={{
                
                display: 'flex',
                backgroundColor: "#FEFEFF",
                flexDirection: 'column',
                height: '100vh',
                padding: 0,
                overflow: 'auto'
                
                
              }}
            >
              {selectedRecipe ? (
                <Box sx={{ padding: 2 }}>
                  <Stack direction="row" alignItems="center">
                  <Typography variant="h5" color="#232530" sx={{ width: '80%' }}>
                    {selectedRecipe.name}
                  </Typography>
                  <Button onClick={() => handleCookItClick(selectedRecipe.recipeId)}
                   disableElevation 
                   variant="contained" 
                   size="medium" 
                   sx={{ 
                      width: 100,
                      '&:hover': {
                      backgroundColor: '#6E4ABE', // Custom hover background color
                      },
                      bgcolor: "#996BFF",
                      fontWeight: 'regular',
                      fontSize: 16,
                  }}
                   
                   >
                    Cook it</Button>
                  </Stack>
                  <Typography variant="subtitle1" sx={{ mb: 3 }}>
                    {selectedRecipe.description}
                  </Typography>
                  <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ padding: 0.25 }}>
                    <Box sx={{  width: '100%', display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>                
                    <Typography sx={{ marginLeft: 0.5, fontWeight: 'regular', fontSize: 17, color: '#232530' }}>Prep</Typography>
                    <Typography sx={{ fontWeight: 'regular', fontSize: 17, color: '#232530' }}>{selectedRecipe.prepTime} mins</Typography>
                    </Box>
                    <Divider sx={{ borderColor: '#B0B2BA'  }} flexItem orientation='vertical' />
                    <Box sx={{  width: '100%', display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>
                    <Typography sx={{ marginLeft: 0.5, fontWeight: 'regular', fontSize: 17, color: '#232530' }}>Cook</Typography>

                    <Typography sx={{ fontWeight: 'regular', fontSize: 17, color: '#232530' }}>{selectedRecipe.cookTime} mins</Typography>
                    </Box>
                    <Divider sx={{ borderColor: '#B0B2BA'  }} flexItem orientation='vertical' />
                    <Box sx={{  width: '100%', display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>                    
                    <Typography sx={{ marginLeft: 0.5, fontWeight: 'regular', fontSize: 17, color: '#232530' }}>Servings</Typography>                    
                    <Typography sx={{ fontWeight: 'regular', fontSize: 17, color: '#232530' }}>{selectedRecipe.servings}</Typography>
                    </Box>
                    <Divider sx={{ borderColor: '#B0B2BA'  }} flexItem orientation='vertical' />
                    <Box sx={{  width: '100%', display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>
                    <Typography sx={{ marginLeft: 0.5, fontWeight: 'regular', fontSize: 17, color: '#232530' }}>Cost</Typography>
                    <Typography sx={{ fontWeight: 'regular', fontSize: 17, color: '#232530' }}>{selectedRecipe.averageCost}</Typography>
                    </Box>

                  </Stack>
                  </Card>
                  {selectedRecipe.nutrients && (
                    <Box sx={{ mb: 3 }}>
                      <Typography sx={{ fontSize: 18, marginBottom: 1, color: "#232530"}} >
                        Nutrients
                      </Typography>
                      <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
                      <Card elevation={0} sx={{ bgcolor: "#F1F2F8", borderWidth: 2, display: 'flex', justifyContent: 'space-between', width: '25%', flexDirection: 'column', alignItems: 'center', padding: 0.5, borderRadius: 2}}>
                      <Typography variant="subtitle1" sx={{ color: '#232530'}}>
                        Calories
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: 18, color: '#7D7BEF' }} color="textSecondary">
                        {selectedRecipe.nutrients.calories}
                      </Typography>
                      </Card>
                      <Card elevation={0} sx={{ bgcolor: "#F1F2F8", borderWidth: 2, display: 'flex', justifyContent: 'space-between', width: '25%',flexDirection: 'column', alignItems: 'center', padding: 0.5, borderRadius: 2}}>
                      <Typography variant="subtitle1" sx={{ color: '#232530'}}>
                        Protein
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: 18, color: '#39379C' }}>
                        {selectedRecipe.nutrients.protein}g
                      </Typography>
                      </Card>
                      <Card elevation={0} sx={{ bgcolor: "#F1F2F8", borderWidth: 2, display: 'flex', justifyContent: 'space-between', width: '25%',flexDirection: 'column', alignItems: 'center', padding: 0.5, borderRadius: 2}}>
                      <Typography variant="subtitle1" sx={{ color: '#232530'}}>
                        Carbs
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: 18, color: '#996BFF' }}>
                       {selectedRecipe.nutrients.carbs}g
                      </Typography>
                      </Card>
                      <Card elevation={0} sx={{ bgcolor: "#F1F2F8", borderWidth: 2, display: 'flex', width: '25%', flexDirection: 'column', alignItems: 'center', padding: 0.5, borderRadius: 2}}>
                      <Typography variant="subtitle1" sx={{ color: '#232530'}}>
                        Fat
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: 20, color: '#5D5AE6' }}>
                        {selectedRecipe.nutrients.fat}g
                      </Typography>
                      </Card>
                      </Stack>
                    </Box>
                  )}
                    <Box sx={{ mb: 2, border: 2, borderColor: 'rgba(102, 103, 113, 0.15)', borderRadius: 4 }}>
                      <IngredientsCard ingredients={selectedRecipe.ingredients}/>
                    </Box>
                  
                  {selectedRecipe.notes && (
                    <Card variant="outlined" sx={{ border: 2, height: 100, marginBottom: 2, padding: 1, borderColor: 'rgba(102, 103, 113, 0.15)', borderRadius: 3}}>
                    <Typography color="textSecondary" sx={{ fontSize: 16, mb: 0.5 }}>
                      Notes 
                    </Typography>
                    <Typography sx={{ fontWeight: 'regular', fontSize: 17, color: '#232530' }}>{selectedRecipe.notes}</Typography>
                    </Card>
                  )}
                </Box>
              ) : (
                <Box sx={{ padding: 2, height: '100vh' }}><Typography variant="h5" color="#232530" sx={{ mb: 2 }} >Details</Typography><Card variant="outlined" sx={{ borderRadius: 3, padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'center'}}><Typography variant="body1">Select a recipe to view its details</Typography></Card></Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Meals;
