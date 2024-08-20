import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Box, Typography, IconButton } from '@mui/material';
import { collection, getDocs, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase/firebase'; // Adjust the import based on your file structure
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const categories = ['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'];

const TopFavoritedMeals = () => {
  const [userId, setUserId] = useState(null);
  const [favoriteMeals, setFavoriteMeals] = useState([]);
  const [recipes, setRecipes] = useState({});

  useEffect(() => {
    const fetchFavoriteMeals = async (uid) => {
      try {
        const q = query(collection(db, `users/${uid}/favoritedMeals`));
        const querySnapshot = await getDocs(q);
        const mealsList = querySnapshot.docs.map(doc => doc.data().recipeId);
        setFavoriteMeals(mealsList.slice(0, 6)); // Limit to the first 5 favorite meals
        fetchRecipes(mealsList.slice(0, 6));
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
  }, [userId]);



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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Box sx={{ padding: 1 }}>
      <Typography variant="h5" color='#232530' sx={{ width: '80%' }}>Top 5 Favorite Meals</Typography>
      <Box>
        <List>
          {favoriteMeals.length === 0 ? (
            <Box sx={{ backgroundColor: 'rgba(231, 233, 243, 0.40)', padding: 3, borderRadius: 3, marginTop: 2   }}>
            <Typography sx={{ fontSize: 17}} color="#999999">You do not have any meals favorited</Typography>
            </Box>
          ) : (
            Object.values(recipes).map((recipe, index) => (
              <ListItem className='p-1' sx={{ borderRadius: 3, marginBottom: 2 }} key={recipe.recipeId}>
                <ListItemText>
                  <div className='d-flex flex-row h-100 align-items-center'>
                    
                  <Typography fontSize={16}>{`${String(index + 1).padStart(2, '0')}`}</Typography>
                  
                  <div className='d-flex flex-column ms-3'>
                  <Typography fontSize={18}>{`${recipe.name}`}</Typography>
                  <Typography fontSize={16}>{`${capitalizeFirstLetter(recipe.category)}`}</Typography>
                  </div>
                   
                  </div>
                </ListItemText>
                <Box sx={{ display: 'flex', borderRadius: 40, flexDirection: 'row', justifyContent: 'center'}}><IconButton sx={{ width: '100%', padding: 1 }}><ArrowForwardIosIcon fontSize='small'/></IconButton></Box>
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </Box>
  );
};

export default TopFavoritedMeals;