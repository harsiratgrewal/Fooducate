import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Box,  Typography } from '@mui/material';
import { collection, getDocs, query } from 'firebase/firestore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { onAuthStateChanged } from 'firebase/auth';
//import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

import { db, auth } from '../firebase/firebase'; // Adjust the import based on your file structure

const categories = ['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'];

const FavoritedMealsCard = () => {
  const [setUserId] = useState(null); //removed userId
  const [favoriteMeals, setFavoriteMeals] = useState([]);
  const [recipes, setRecipes] = useState({});

  useEffect(() => {
    const fetchFavoriteMeals = async (uid) => {
      try {
        const q = query(collection(db, `users/${uid}/favoritedMeals`));
        const querySnapshot = await getDocs(q);
        const mealsList = querySnapshot.docs.map(doc => doc.data().recipeId);
        setFavoriteMeals(mealsList);
        fetchRecipes(mealsList);
      } catch (error) {
        console.error("Error fetching favorite meals: ", error);
      }
    };
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
          fetchFavoriteMeals(user.uid);
        } else {
          setUserId(null);
          setFavoriteMeals([]);
          setRecipes({});
        }
    });

    return () => unsubscribe();
  }, [setUserId]);

  

  const fetchRecipes = async (mealsList) => {
    const allRecipes = {};
    try {
      for (const category of categories) {
        const categoryCollection = collection(db, category);
        const querySnapshot = await getDocs(categoryCollection);
        querySnapshot.docs.forEach((doc) => {
          const recipeId = doc.data().recipeId;  // Ensure the recipeId is fetched as a string
          if (mealsList.includes(recipeId)) {
            allRecipes[doc.id] = { ...doc.data(), category, recipeId: doc.id };
          }
        });
      }
      setRecipes(allRecipes);
    } catch (error) {
      console.error("Error fetching recipes: ", error);
    }
  };

  const handleAddToGroceryList = (ingredient) => {
    // Add ingredient to grocery list logic here
    console.log(`Add ${ingredient} to grocery list`);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  
  return (
    <Box sx={{ padding: 1 }}>
      <div className='d-flex flex-column'>
        <Typography variant="h5" color='#232530' sx={{ width: '80%' }}>Favorited meals</Typography>
        <Typography variant="subtitle1" color='#232530'>Add any ingredient(s) from your favorite meals to your list</Typography>
        </div>
     <Box sx={{ marginBottom: 1, height: '100%', overflowY: 'auto' }}>
      <List>
        {favoriteMeals.length === 0 ? (
          <Typography variant="h6">No favorite meals found.</Typography>
        ) : (
          Object.values(recipes).map((recipe) => (
            <Accordion key={recipe.recipeId}  sx={{ boxShadow: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.12)'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className='ps-0 mb-0'
              sx={{ height: 35}}
              aria-controls={`panel-${recipe.recipeId}-content`}
              id={`panel-${recipe.recipeId}-header`}
            >
              <Typography className='pb-0' sx={{ color: "#232530"}} variant="subtitle1">{recipe.name}</Typography>
            </AccordionSummary>
            <AccordionDetails className='ps-0 pt-0'>
              <List>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index} className='ps-0'
                    secondaryAction={
                    <IconButton variant="outlined" sx={{ width: 40, color: "#996BFF" }} onClick={() => handleAddToGroceryList(ingredient)}>
                      <AddIcon />
                    </IconButton>
                  }
                  
                  >
                    <ListItemText className='ps-0' primary={capitalizeFirstLetter(ingredient)} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
          ))
        )}
      </List>
      </Box>
    </Box>
  );
};

export default FavoritedMealsCard;