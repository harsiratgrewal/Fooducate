import React, { useState, useEffect } from 'react';
import { Box, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, List, ListItem, ListItemText, Typography, Select, MenuItem, FormControl, InputLabel, Grid, Card, CardContent, CardActions } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { collection,  addDoc, doc, updateDoc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'; // Import Firestore and Auth instances
import { onAuthStateChanged } from 'firebase/auth';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import BreakfastIcon from '@mui/icons-material/Egg';
import AddIcon from '@mui/icons-material/Add';
import LunchIcon from '@mui/icons-material/LunchDining';
import DinnerIcon from '@mui/icons-material/DinnerDining';
import SnacksIcon from '@mui/icons-material/Fastfood';
import { InputAdornment } from '@mui/material';
import SweetsIcon from '@mui/icons-material/Cake';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Sweets"];


const AddMeal = ({ open, onClose }) => {
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
          console.log(mealPlanData)
          const mealPlanDocRef = doc(collection(db, 'mealplans'));
          batch.set(mealPlanDocRef, mealPlanData);
        });

        await batch.commit();
        console.log("Batch commit successful.");
        
        onClose();
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
            <ListItem key={recipe.id}>
              <ListItemText primary={recipe.name} secondary={recipe.category} />
            </ListItem>
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
      
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
                  />
                </LocalizationProvider>
                {['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'].map((category) => (
                  <div key={category}>
                    <Typography sx={{ fontSize: 14, color: '#8D8D8D'}}>{category.charAt(0).toUpperCase() + category.slice(1)}</Typography>
                    {renderSelectedRecipes(category)}
                  </div>
                ))}
              </CardContent>
              
              <Button variant="outlined" sx={{ borderColor: '#996BFF', width: '50%'}}onClick={onClose}>Cancel</Button>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" sx={{ backgroundColor: '#996BFF', width: '50%'}} onClick={handleSave}>
                Save Plan
          </Button>
        
      </DialogActions>
    </Dialog>
  );
};

export default AddMeal;