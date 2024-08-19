import React, { useState, useEffect } from 'react';
import { Card, Divider, Checkbox, CardContent, Typography, Button, List, ListItem, ListItemText, TextField, Box, Grid, Dialog, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import { collection, getDocs, query, where, doc, getDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import IcecreamIcon from '@mui/icons-material/Icecream';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { styled } from '@mui/material';
import QuantitySelector from './QuantitySelector';
import CheckIcon from '@mui/icons-material/Check';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& label.Mui-focused': {
    color: '#996BFF',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#996BFF',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#c4c4c4',
      borderRadius: '5px',
    },
    '&:hover fieldset': {
      borderColor: '#996BFF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#996BFF',
    },
  },
  '& .MuiInputBase-input': {
    padding: '10px',
    fontSize: '16px',
  },
  '& .MuiInputLabel-root': {
    transform: 'translate(10.5px, 10px) scale(1)',
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(10px, -10px) scale(0.80)',
    padding: 1, 
    fontSize: '18px'
  }
}));

const SearchMeals = () => {
  const [user] = useAuthState(auth);
  const [nextDayRecipes, setNextDayRecipes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [quantities, setQuantities] = useState({});
  const [units, setUnits] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [categories] = useState([
    { name: 'all', icon: <AllInclusiveIcon /> },
    { name: 'breakfast', icon: <BreakfastDiningIcon /> },
    { name: 'lunch', icon: <LunchDiningIcon /> },
    { name: 'dinner', icon: <DinnerDiningIcon /> },
    { name: 'snacks', icon: <EmojiFoodBeverageIcon /> },
    { name: 'sweets', icon: <IcecreamIcon /> }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categoryOrder = ['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'];

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchNextDayRecipes = async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toDateString();
      const mealPlansQuery = query(collection(db, 'mealplans'), where('userId', '==', user.uid));
      const mealPlansSnapshot = await getDocs(mealPlansQuery);
      const mealPlans = mealPlansSnapshot.docs.map(doc => doc.data()).filter(mealPlan => {
        const mealDate = new Date(mealPlan.date); // Convert Firestore Timestamp to Date
        return mealDate.toDateString() === tomorrowString;
      });

      const recipePromises = mealPlans.map(async (mealPlan) => {
        const recipeDoc = await getDoc(doc(db, mealPlan.category, mealPlan.recipeId));
        if (recipeDoc.exists()) {
          return { ...recipeDoc.data(), id: recipeDoc.id };
        }
        return null; // Return null if the recipe doesn't exist
      });

      let recipes = (await Promise.all(recipePromises)).filter(recipe => recipe !== null);

      // Sort recipes based on categoryOrder
      recipes = recipes.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));

      setNextDayRecipes(recipes);
    };

    const fetchRecipes = async () => {
      const recipesList = [];
      for (const category of categories) {
        if (category.name !== 'all') {
          const querySnapshot = await getDocs(collection(db, category.name));
          querySnapshot.forEach((doc) => {
            recipesList.push({ id: doc.id, ...doc.data(), category: category.name });
          });
        }
      }
      setRecipes(recipesList);
      setFilteredRecipes(recipesList);
    };
    if (user) {
      fetchNextDayRecipes();
      fetchRecipes();
    }
  }, [user]);


  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    filterRecipes(event.target.value, selectedCategory);
  };

  const filterRecipes = (query, category) => {
    let filtered = recipes;
    if (category && category !== 'all') {
      filtered = filtered.filter((recipe) => recipe.category === category);
    }
    if (query) {
      filtered = filtered.filter((recipe) =>
        recipe.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    setFilteredRecipes(filtered);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    filterRecipes(searchQuery, category);
  };

  const handleDialogOpen = (recipe) => {
    setSelectedRecipe(recipe);
    setQuantities({});
    setUnits({});
    setCheckedIngredients({});
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRecipe(null);
  };

  const handleQuantityChange = (name, change) => {
    const newQuantities = { ...quantities, [name]: Math.max((quantities[name] || 1) + change, 1) };
    setQuantities(newQuantities);
  };

  const handleUnitChange = (event, name) => {
    const newUnits = { ...units, [name]: event.target.value };
    setUnits(newUnits);
  };

  const handleCheckboxChange = (event, ingredient) => {
    setCheckedIngredients({
      ...checkedIngredients,
      [ingredient]: event.target.checked
    });
  };

  const addAllCheckedIngredients = async () => {
    let addedCount = 0;
    try {
      for (const ingredient of selectedRecipe.ingredients) {
        if (checkedIngredients[ingredient]) {
          const quantity = quantities[ingredient] || 1; // Default to 1 if no quantity specified
          const unit = units[ingredient] || ''; // Default to empty string if no unit specified
          const price = (Math.random() * 9 + 1).toFixed(2); // Random price between 1 and 10
          await addDoc(collection(db, `users/${user.uid}/grocerylist`), {
            name: ingredient,
            quantity: quantity,
            unit: unit,
            price: price
          });
          addedCount++;
        }
      }
      setDialogOpen(false);
      setSelectedRecipe(null);
      setSnackbarMessage(`${addedCount} ingredient(s) added to the grocery list.`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Card elevation={0}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" color="#232530">
              Tomorrow's meals
            </Typography>
            <Typography variant="subtitle1" color="#232530">
              View recipes to add the ingredients to your list
            </Typography>
            <List>
              {nextDayRecipes.map((recipe, index) => (
                <ListItem className="border-start border-3 d-flex flex-row justify-content-between align-items-center mb-2" sx={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 0 }} key={index}>
                  <div>
                    <ListItemText 
                    sx={{ paddingLeft: 1 }} 
                    primary={recipe.name} 
                    secondary={recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)} 
                    primaryTypographyProps={{ fontSize: 18, color: '#232530' }}
                    secondaryTypographyProps={{ fontSize: 16, color: '#707070' }}
                    
                    />
                  </div>
                  <div>
                    <Button disableElevation
                      sx={{
                        bgcolor: '#996BFF',
                        '&:hover': {
                          backgroundColor: '#8A60E6',
                        },
                      }}
                      variant="contained"
                      onClick={() => handleDialogOpen(recipe)}
                    >
                      View
                    </Button>
                  </div>
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" color="#232530">
              Search Recipes
            </Typography>
            <Typography variant="subtitle1" color="#232530">
              Search for a recipe to add the ingredients to your list
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container columns={18} spacing={1}>
              {categories.map((category, index) => (
                <Grid item xs={3} key={index}>
                  <Button
                    variant="outlined"
                    onClick={() => handleCategoryFilter(category.name)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textTransform: 'none',
                      borderColor: '#996BFF',
                      color: selectedCategory === category.name ? '#FFF' : '#996BFF',
                      backgroundColor: selectedCategory === category.name ? '#996BFF' : 'transparent',
                      '&:hover': {
                        backgroundColor: selectedCategory === category.name ? '#996BFF' : '#F4EFFF',
                        borderColor: '#996BFF',
                        color: selectedCategory === category.name ? '#FFFFFF' : '#8A60E6'
                      },
                    }}
                  >
                    {category.icon}
                    <Typography variant="caption" sx={{ marginTop: 0.5 }}>
                      {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                    </Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={handleSearch}
              sx={{
                marginBottom: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 10,
                },
              }}
            />
          </Grid>
          <Box style={{ width: '100%', maxHeight: '45vh', overflowY: 'auto' }}>
            <Grid item xs={12}>
              <List>
                {filteredRecipes.map((recipe) => (
                  <ListItem
                    key={recipe.id}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleDialogOpen(recipe)} // Open the dialog when a recipe is clicked
                  >
                    <ListItemText
                      primary={recipe.name}
                      secondary={`${recipe.nutrients.calories} cals`}
                      primaryTypographyProps={{ fontSize: 18, color: '#232530' }}
                      secondaryTypographyProps={{ fontSize: 16, color: '#707070' }}
                    />
                    <ArrowOutwardIcon
                      sx={{ color: '#996BFF', marginLeft: 'auto' }} // Optional styling for the arrow icon
                      onClick={(event) => {
                        event.stopPropagation(); // Prevents triggering the ListItem click
                        handleDialogOpen(recipe);
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Box>
        </Grid>
      </CardContent>

      {selectedRecipe && selectedRecipe.ingredients && (
        <Dialog maxWidth="sm" fullWidth open={dialogOpen} onClose={handleDialogClose}>
          <Typography sx={{ color: "#232530" }} variant="h5" className='ps-4 pt-4'>{selectedRecipe.name}</Typography>
          <Divider sx={{ borderColor: '#B0B2BA', borderWidth: 1.5, marginTop: 2 }} flexItem />
          <DialogContent sx={{ width: '100%' }}>
            <Typography sx={{ fontSize: 20, color: "#232530" }}>Ingredients</Typography>
            <List>
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <ListItem key={index} sx={{ display: 'flex', alignItems: 'center', paddingLeft: 0 }}>
                  <Checkbox
                    checked={!!checkedIngredients[ingredient]}
                    onChange={(event) => handleCheckboxChange(event, ingredient)}
                    sx={{
                      '&.Mui-checked': {
                        color: '#996BFF',
                      },
                      color: '#B7BAC5'
                    }}
                  />
                  <ListItemText primary={`${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}`} />
                  <QuantitySelector
                    value={quantities[ingredient] || 1}
                    onIncrease={() => handleQuantityChange(ingredient, 1)}
                    onDecrease={() => handleQuantityChange(ingredient, -1)}
                  />
                  <CustomTextField
                    label="Unit"
                    value={units[ingredient] || ''}
                    onChange={(event) => handleUnitChange(event, ingredient)}
                    sx={{ width: '100px', marginLeft: '10px' }}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <div className='d-flex pb-4 flex-row justify-content-center w-100'>
              <Button
                onClick={handleDialogClose}
                disableElevation
                variant='outlined'
                sx={{
                  width: '20%',
                  borderColor: '#767676',
                  color: '#767676',
                  '&:hover': {
                    backgroundColor: 'rgba(118, 118, 118, 0.15)',
                    borderColor: '#767676'
                  },
                }}
              >
                Close
              </Button>
              <Button
                onClick={addAllCheckedIngredients}
                disableElevation
                variant="contained"
                sx={{
                  marginLeft: 1,
                  backgroundColor: '#996BFF',
                  width: '20%',
                  '&:hover': {
                    backgroundColor: '#8A60E6',
                  },
                }}
              >
                Add All
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          icon={<CheckIcon sx={{ color: '#1B6A36', fontSize: 28 }} />}
          variant="filled"
          sx={{ bgcolor: '#95EDB3', color: '#1B6A36', fontSize: 18 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default SearchMeals;