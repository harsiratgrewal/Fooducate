import React, { useState, useEffect } from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, List, ListItem, ListItemText, Typography, Checkbox, IconButton, Grid, Card, CardContent, Divider, InputAdornment } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'; // Import Firestore and Auth instances
import { onAuthStateChanged } from 'firebase/auth';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import BreakfastIcon from '@mui/icons-material/Egg';
import LunchIcon from '@mui/icons-material/LunchDining';
import DinnerIcon from '@mui/icons-material/DinnerDining';
import SnacksIcon from '@mui/icons-material/Fastfood';
import SweetsIcon from '@mui/icons-material/Cake';

const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Sweets"];

const AddMeal = ({ open, onClose, onSave }) => {
  const [userId, setUserId] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [date, setDate] = useState(dayjs());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchRecipes();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchRecipes = async () => {
    try {
      const categories = ['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'];
      const allRecipes = [];

      await Promise.all(categories.map(async (category) => {
        const categoryCollection = collection(db, category);
        const categorySnapshot = await getDocs(categoryCollection);
        categorySnapshot.docs.forEach((doc) => {
          allRecipes.push({ id: doc.id, ...doc.data(), category });
        });
      }));

      setRecipes(allRecipes);
      setFilteredRecipes(allRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterRecipes(value, selectedCategory);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    filterRecipes(searchTerm, category);
  };

  const filterRecipes = (searchTerm, category) => {
    setFilteredRecipes(
      recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm) &&
        (!category || recipe.category === category)
      )
    );
  };

  const handleRecipeToggle = (recipe) => {
    const currentIndex = selectedRecipes.indexOf(recipe);
    const newSelectedRecipes = [...selectedRecipes];

    if (currentIndex === -1) {
      newSelectedRecipes.push(recipe);
    } else {
      newSelectedRecipes.splice(currentIndex, 1);
    }

    setSelectedRecipes(newSelectedRecipes);
  };

  const handleSave = async () => {
    if (userId && selectedRecipes.length > 0 && date) {
      try {
        const batch = writeBatch(db);

        selectedRecipes.forEach((recipe) => {
          const mealPlanData = {
            userId,
            recipeId: recipe.id,
            date: date.format('YYYY-MM-DDTHH:mm:ss.sssZ'), // Format date as YYYY-MM-DD
            category: recipe.category
          };
          const mealPlanDocRef = doc(collection(db, 'mealplans'));
          batch.set(mealPlanDocRef, mealPlanData);
        });

        await batch.commit();
        onSave(`Successfully added ${selectedRecipes.length} meals for ${date.format('MMMM DD, YYYY')} to meal plans!`);
      } catch (error) {
        console.error('Error adding recipes to meal plan:', error);
      }
    }
  };

  const categoryIcons = {
    breakfast: <BreakfastIcon fontSize="large" />,
    lunch: <LunchIcon fontSize="large" />,
    dinner: <DinnerIcon fontSize="large" />,
    snacks: <SnacksIcon fontSize="large" />,
    sweets: <SweetsIcon fontSize="large" />
  };

  const renderSelectedRecipes = (category) => {
    return (
      <List>
        {selectedRecipes
          .filter(recipe => recipe.category === category)
          .map(recipe => (
            <><ListItem sx={{ padding: 0 }} key={recipe.id}>
              <ListItemText sx={{marginBottom: 2 }} primary={<React.Fragment><Typography sx={{ fontSize: 18 }}>{recipe.name}</Typography></React.Fragment>} />
            </ListItem><Divider component="li" /></>
          ))}
      </List>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Select Recipes</DialogTitle>
      <DialogContent sx={{overflow: 'hidden'}}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1} marginBottom={2} justifyContent="center">
              {['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'].map((category) => (
                <Grid item key={category}>
                  <Button
                    variant={selectedCategory === category ? "contained" : "outlined"}
                    onClick={() => handleCategoryClick(category)}
                    style={{ flexDirection: 'column',
                     backgroundColor: selectedCategory === category ? '#996BFF' : 'transparent',
                     borderColor: selectedCategory === category ? '#996BFF' : '#996BFF',
                     color: selectedCategory === category ? '#FFFFFF' : '#996BFF',
                     alignItems: 'center', 
                     width: 100 }}
                  >
                    {categoryIcons[category]}
                    <Typography variant="body2">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
            <TextField
              label="Search Recipes"
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
             <Box style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <List>
                {filteredRecipes.map(recipe => (
                  <ListItem key={recipe.id} onClick={() => handleRecipeToggle(recipe)}>
                    <Checkbox
                      checked={selectedRecipes.indexOf(recipe) !== -1}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        '&.Mui-checked': {
                          color: '#996BFF',
                        },
                      }}
                    />
                    <ListItemText primary={recipe.name} secondary={recipe.category} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={0}>
              <CardContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select Date"
                    sx={{ marginBottom: 4 }}
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
                  />
                </LocalizationProvider>
                {['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'].map((category) => (
                  <div key={category}>
                    <Typography sx={{ fontSize: 16, color: '#8D8D8D'}}>{category.charAt(0).toUpperCase() + category.slice(1)}</Typography>
                    {renderSelectedRecipes(category)}
                  </div>
                ))}
              </CardContent>
              
              
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <div className='d-flex w-50 flex-row justify-content-between'>
        <Button variant="outlined" 
        sx={{ borderColor: '#767676', 
          width: '50%',
           marginRight: 2, 
           color: '#767676', 
           '&:hover': {
            backgroundColor: 'rgba(118, 118, 118, 0.15)', // Custom hover background color
            borderColor: '#767676'
           }, 
           }}
        onClick={onClose}>
          Cancel
        </Button>
        <Button disableElevation variant="contained" 
        sx={{ 
          backgroundColor: '#996BFF',
          
          '&:hover': {
            backgroundColor: '#8A60E6', // Custom hover background color
           }, 
          width: '50%'}} 
          onClick={handleSave}>
                Save Plan
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default AddMeal;