import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Avatar } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const AdditionalRecipesCarousel = ({ category, currentRecipeId }) => {
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimilarRecipes = async () => {
      try {
        const categoryCollection = collection(db, category);
        const q = query(
          categoryCollection,
          where("recipeId", "!=", currentRecipeId) // Exclude the current recipe
        );
        const querySnapshot = await getDocs(q);
        const recipesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Shuffle the array and take the first 3 recipes
        const shuffledRecipes = recipesList.sort(() => 0.5 - Math.random()).slice(0, 4);

        setSimilarRecipes(shuffledRecipes);
      } catch (error) {
        console.error("Error fetching similar recipes: ", error);
      }
    };

    fetchSimilarRecipes();
  }, [category, currentRecipeId]);

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" color='#232530'>More {category.charAt(0).toUpperCase() + category.slice(1)} Recipes</Typography>
        <Button endIcon={<ArrowForwardIosIcon />} variant="text" 
        sx={{ 
          color: '#996BFF', 
          width: '25%',
          '&:hover': {
              backgroundColor: '#F4EFFF', // Custom hover background color
            }, 
          
          }}
          onClick={() => navigate('/meals')}
          
          >
            See all
        </Button>
      </Box>
      <List>
        {similarRecipes.map((recipe) => (
          <ListItem
            key={recipe.recipeId}
            sx={{ paddingLeft: 0, paddingBottom: 1, cursor: 'pointer' }}
            onClick={() => navigate(`/recipe/${recipe.recipeId}`)}
          >
            <Avatar
              src={recipe.imageUrl || 'default-image-url.jpg'}
              alt={recipe.name}
              sx={{ width: 56, height: 56, marginRight: 2 }}
            />
            <ListItemText
              primary={recipe.name}
              secondary={recipe.ingredients
                .map((ingredient) => ingredient.charAt(0).toUpperCase() + ingredient.slice(1)) // Capitalize each ingredient
                .join(', ')} // Join the capitalized ingredients with commas
              primaryTypographyProps={{ fontWeight: 'medium', color: '#232530' }}
              secondaryTypographyProps={{ color: '#707070' }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AdditionalRecipesCarousel;