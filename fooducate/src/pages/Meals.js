import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AllRecipes from '../components/AllRecipes';
import Typography from '@mui/material/Typography';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { Button, Card, Divider, ListItem, ListItemText, Stack } from '@mui/material';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import Checkbox from '@mui/material/Checkbox';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import List from '@mui/material/List';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Header from '../components/Header';
import IngredientsCard from '../components/IngreidientsCard';


function Meals() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [checked, setChecked] = useState({});
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

  const handleToggle = (name) => () => {
    setChecked((prev) => {
      const newChecked = { ...prev, [name]: !prev[name] };
      console.log(`Item ${name} checked: ${newChecked[name]}`);
      return newChecked;
    });
  };

  console.log(selectedRecipe)

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
                  <Stack direction="row" alignItems="center" sx={{marginBottom: 2 }}>
                  <Typography variant="h5" color='#494949'sx={{ width: '80%', fontWeight: 'medium', fontSize: 20 }}>
                    {selectedRecipe.name}
                  </Typography>
                  <Button onClick={() => handleCookItClick(selectedRecipe.recipeId)} disableElevation variant="contained" size="small" sx={{ bgcolor: '#996BFF', width: 125}}>Cook it</Button>
                  </Stack>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRecipe.description}
                  </Typography>
                  <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ padding: 0.25 }}>
                    <Box sx={{  width: '100%', display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>                
                    <Typography sx={{ marginLeft: 0.5, fontWeight: 'regular', fontSize: 13, color: '#494949' }}>Prep</Typography>
                    <Typography sx={{ fontWeight: 'regular', fontSize: 13, color: '#494949' }}>{selectedRecipe.prepTime} mins</Typography>
                    </Box>
                    <Divider flexItem orientation='vertical' />
                    <Box sx={{  width: '100%', display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>
                    <Typography sx={{ marginLeft: 0.5, fontWeight: 'regular', fontSize: 13, color: '#494949' }}>Cook</Typography>

                    <Typography sx={{ fontWeight: 'regular', fontSize: 13, color: '#494949' }}>{selectedRecipe.cookTime} mins</Typography>
                    </Box>
                    <Divider flexItem orientation='vertical' />
                    <Box sx={{  width: '100%', display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>                    
                    <Typography sx={{ marginLeft: 0.5, fontWeight: 'regular', fontSize: 13, color: '#494949' }}>Servings</Typography>                    
                    <Typography sx={{ fontWeight: 'regular', fontSize: 13, color: '#494949' }}>{selectedRecipe.servings}</Typography>
                    </Box>
                    <Divider flexItem orientation='vertical' />
                    <Box sx={{  width: '100%', display: 'flex', flexDirection: 'column',  alignItems: 'center'}}>
                    <Typography sx={{ marginLeft: 0.5, fontWeight: 'regular', fontSize: 13, color: '#494949' }}>Cost</Typography>
                    <Typography sx={{ fontWeight: 'regular', fontSize: 13, color: '#494949' }}>{selectedRecipe.averageCost}</Typography>
                    </Box>

                  </Stack>
                  </Card>
                  {selectedRecipe.nutrients && (
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 'medium', fontSize: 17, marginBottom: 1, color: "#3F3F3F"}} >
                        Nutrients
                      </Typography>
                      <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
                      <Card elevation={0} sx={{ bgcolor: "#F1F2F8", borderWidth: 2, display: 'flex', justifyContent: 'space-between', width: '25%', flexDirection: 'column', alignItems: 'center', padding: 1, borderRadius: 2}}>
                      <Typography sx={{ fontWeight: 'regular', fontSize: 14, color: '#7E7E7E'}}>
                        Calories
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: 18, color: '#996BFF' }} color="textSecondary">
                        {selectedRecipe.nutrients.calories}
                      </Typography>
                      </Card>
                      <Card elevation={0} sx={{ bgcolor: "#F1F2F8", borderWidth: 2, display: 'flex', justifyContent: 'space-between', width: '25%',flexDirection: 'column', alignItems: 'center', padding: 1, borderRadius: 2}}>
                      <Typography sx={{ fontWeight: 'regular', fontSize: 14, color: '#7E7E7E'}}>
                        Protein
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: 18, color: '#4B49C3' }}>
                        {selectedRecipe.nutrients.protein}
                      </Typography>
                      </Card>
                      <Card elevation={0} sx={{ bgcolor: "#F1F2F8", borderWidth: 2, display: 'flex', justifyContent: 'space-between', width: '25%',flexDirection: 'column', alignItems: 'center', padding: 1, borderRadius: 2}}>
                      <Typography sx={{ fontWeight: 'regular', fontSize: 14, color: '#7E7E7E'}}>
                        Carbs
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: 18, color: '#6F6DCF' }}>
                       {selectedRecipe.nutrients.carbs}
                      </Typography>
                      </Card>
                      <Card elevation={0} sx={{ bgcolor: "#F1F2F8", borderWidth: 2, display: 'flex', justifyContent: 'space-between', width: '25%', flexDirection: 'column', alignItems: 'center', padding: 1, borderRadius: 2}}>
                      <Typography sx={{ fontWeight: 'regular', fontSize: 14, color: '#7E7E7E'}}>
                        Fat
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: 18, color: '#6D4CB5' }}>
                        {selectedRecipe.nutrients.fat}
                      </Typography>
                      </Card>
                      </Stack>
                    </Box>
                  )}
                    <Box sx={{ mb: 2 }}>
                      <IngredientsCard ingredients={selectedRecipe.ingredients}/>
                    </Box>
                  
                  {selectedRecipe.notes && (
                    <Card variant="outlined" sx={{ height: 100, marginBottom: 2, padding: 1, borderRadius: 3}}>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                      Notes 
                    </Typography>
                    <Typography sx={{ fontWeight: 'regular', fontSize: 15, color: '#494949' }}>{selectedRecipe.notes}</Typography>
                    </Card>
                  )}
                </Box>
              ) : (
                <Box sx={{ padding: 2, height: '100vh' }}><Typography variant="h5" color="#494949" sx={{ mb: 2, fontWeight: 'medium' }} >Details</Typography><Card variant="outlined" sx={{ borderRadius: 3, padding: 1, height: 50, display: 'flex', flexDirection: 'row', alignItems: 'center'}}><Typography sx={{ fontSize: 15 }}>Select a recipe to view its details</Typography></Card></Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Meals;
