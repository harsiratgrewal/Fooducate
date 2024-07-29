import React, { useState, useEffect } from 'react';
import { Card, Checkbox, CardContent, Typography, Button, List, ListItem, ListItemText, TextField, Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { collection, getDocs, query, where, doc, getDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import IcecreamIcon from '@mui/icons-material/Icecream';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import dayjs from 'dayjs';

const SearchMeals = () => {
  const [user] = useAuthState(auth);
  const [nextDayRecipes, setNextDayRecipes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [quantities, setQuantities] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [categories, setCategories] = useState([
    { name: 'all', icon: <AllInclusiveIcon /> },
    { name: 'breakfast', icon: <BreakfastDiningIcon /> },
    { name: 'lunch', icon: <LunchDiningIcon /> },
    { name: 'dinner', icon: <DinnerDiningIcon /> },
    { name: 'snacks', icon: <EmojiFoodBeverageIcon /> },
    { name: 'sweets', icon: <IcecreamIcon /> }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (user) {
      fetchNextDayRecipes();
      fetchRecipes();
    }
  }, [user]);

  const fetchNextDayRecipes = async () => {
     const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toDateString();
        console.log(tomorrowString)
        const mealPlansQuery = query(collection(db, 'mealplans'), where('userId', '==', user.uid));
        const mealPlansSnapshot = await getDocs(mealPlansQuery);
        const mealPlans = mealPlansSnapshot.docs.map(doc => doc.data()).filter(mealPlan => {
            const mealDate = new Date(mealPlan.date); // Convert Firestore Timestamp to Date
            return mealDate.toDateString() === tomorrowString;
        });

        const recipePromises = mealPlans.map(async (mealPlan) => {
        const recipeDoc = await getDoc(doc(db, mealPlan.category, mealPlan.recipeId));
        return { ...recipeDoc.data(), id: recipeDoc.id };
        });

        const recipes = await Promise.all(recipePromises);
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
    setCheckedIngredients({});
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRecipe(null);
  };

  const handleQuantityChange = (event, ingredientName) => {
    setQuantities({
      ...quantities,
      [ingredientName]: event.target.value
    });
  };

   const handleCheckboxChange = (event, ingredient) => {
    setCheckedIngredients({
      ...checkedIngredients,
      [ingredient]: event.target.checked
    });
  };

  console.log(selectedRecipe)

  const addAllCheckedIngredients = async () => {
    try {
      for (const ingredient of selectedRecipe.ingredients) {
        if (checkedIngredients[ingredient]) {
          const quantity = quantities[ingredient] || 1; // Default to 1 if no quantity specified
          const price = (Math.random() * 9 + 1).toFixed(2); // Random price between 1 and 10
          await addDoc(collection(db, `users/${user.uid}/grocerylist`), {
            name: ingredient,
            quantity: quantity,
            price: price
          });
        }
      }
      setDialogOpen(false);
      setSelectedRecipe(null);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <Card elevation={0}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium' }}>
              Tomorrow's Ingredients
            </Typography>
            <List>
              {nextDayRecipes.map((recipe, index) => (
                <ListItem key={index}>
                  <ListItemText primary={recipe.name} />
                  <Button variant="contained" onClick={() => handleDialogOpen(recipe)}>View</Button>
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium', marginTop: 2 }}>
              Search Recipes
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
                      textTransform: 'none'
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
              sx={{ marginBottom: 2 }}
            />
          </Grid>
           <Box style={{ width: '100%', maxHeight: '45vh', overflowY: 'auto' }}>   
          <Grid item xs={12}>
            <List>
              {filteredRecipes.map((recipe) => (
                <ListItem key={recipe.id}>
                  <ListItemText primary={recipe.name} />
                </ListItem>
              ))}
            </List>
          </Grid>
          </Box>
        </Grid>
      </CardContent>

      {selectedRecipe && (
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>{selectedRecipe.name}</DialogTitle>
          <DialogContent>
            <Typography variant="h6">Ingredients</Typography>
            <List>
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={!!checkedIngredients[ingredient]}
                    onChange={(event) => handleCheckboxChange(event, ingredient)}
                  />
                  <ListItemText primary={`${ingredient}`} />
                  <TextField
                    type="number"
                    label="Quantity"
                    value={quantities[ingredient] || 1} // Default quantity to 1
                    onChange={(event) => handleQuantityChange(event, ingredient)}
                    sx={{ width: '100px', marginRight: '10px' }}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">Close</Button>
            <Button variant="contained" onClick={addAllCheckedIngredients} color="primary">Add All</Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
};

export default SearchMeals;