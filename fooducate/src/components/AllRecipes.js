import { Typography, Box, Button, Card, Grid, CardMedia, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import Stack from '@mui/material/Stack';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { onAuthStateChanged } from 'firebase/auth';
import BookmarkIcon from '@mui/icons-material/Bookmark'; 

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
  },
  '& .MuiTabs-indicatorSpan': {
    width: '100%',
    backgroundColor: '#996BFF'
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: '#494949',
    '&.Mui-selected': {
      color: '#996BFF',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&.Mui-selected:hover': {
      backgroundColor: "rgba(153, 107, 255, 0.1)"
    },
    '&:hover': {
      backgroundColor: "rgba(177, 177, 177, 0.15)",
    },
  }),
);

export default function AllRecipes({ onSelectRecipe, onCategoryChange }) {
  const [value, setValue] = useState('breakfast');
  const [recipes, setRecipes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [favoritedRecipes, setFavoritedRecipes] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    fetchRecipes(newValue);
    onCategoryChange(); // Notify parent about the category change
  };

  const fetchRecipes = async (category) => {
    try {
      const querySnapshot = await getDocs(collection(db, category));
      const recipesList = querySnapshot.docs.map((doc) => doc.data());
      setRecipes(recipesList);
    } catch (error) {
      console.error(`Error fetching ${category} recipes:`, error);  // Error handling
    }
  };

  const fetchFavoritedRecipes = async (uid) => {
    try {
      const favoritesSnapshot = await getDocs(collection(db, `users/${uid}/favoritedMeals`));
      const favoritesList = favoritesSnapshot.docs.map(doc => doc.data().recipeId);
      setFavoritedRecipes(favoritesList);
    } catch (error) {
      console.error('Error fetching favorited meals:', error);
    }
  };

  const handleFavoriteRecipe = async (recipe) => {
    if (userId && recipe && recipe.recipeId) {
      try {
        const favoriteDocRef = doc(db, `users/${userId}/favoritedMeals`, recipe.recipeId);

        if (favoritedRecipes.includes(recipe.recipeId)) {
          // Remove from favorites
          await deleteDoc(favoriteDocRef);
          setFavoritedRecipes(favoritedRecipes.filter(id => id !== recipe.recipeId));
        } else {
          // Add to favorites
          await setDoc(favoriteDocRef, {
            recipeId: recipe.recipeId,
            favoritedAt: new Date(),
          });
          setFavoritedRecipes([...favoritedRecipes, recipe.recipeId]);
        }
      } catch (error) {
        console.error('Error handling favorite meals:', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchRecipes('breakfast');
        fetchFavoritedRecipes(user.uid); // Fetch favorited recipes
      } else {
        setUserId(null);
        setFavoritedRecipes([]); // Clear the favorited recipes if the user is not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRecipeClick = (recipe) => {
    onSelectRecipe(recipe);
  };

  return (
    <Box sx={{ padding: 1 }}>
      <Typography variant="h5" color="#232530">
        Recipes
      </Typography>
      <StyledTabs value={value} sx={{ marginBottom: 2 }} onChange={handleChange}>
        <StyledTab sx={{ width: '10%', fontSize: 17 }} label="Breakfast" value="breakfast" />
        <StyledTab sx={{ width: '10%', fontSize: 17 }} label="Lunch" value="lunch" />
        <StyledTab sx={{ width: '10%', fontSize: 17 }} label="Dinner" value="dinner" />
        <StyledTab sx={{ width: '10%', fontSize: 17 }} label="Snacks" value="snacks" />
        <StyledTab sx={{ width: '10%', fontSize: 17 }} label="Sweets" value="sweets" />
      </StyledTabs>
       <Box style={{ maxHeight: '72vh', overflowY: 'auto' }}>
        <Grid container sx={{ width: '100%' }} rowSpacing={{ xs: 3, sm: 2, md: 3, lg: 2, xl: 2 }} columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 2, xl: 2 }} columns={12}>
            {recipes.map((recipe, index) => {
              const totalMinutes = recipe.cookTime + recipe.prepTime;
              let totalTime = '';
              if (totalMinutes > 60) {
                const hours = totalMinutes / 60;
                const minutes = totalMinutes % 60;
                totalTime = `${Math.trunc(hours)}hr ${minutes}mins`;
              } else {
                totalTime = `${totalMinutes} mins`
              }
              return (
              <Grid item xs={6} sm={6} md={4} xl={4} lg={6} key={recipe.recipeId}>
                <Card variant="outlined" sx={{ borderColor: 'rgba(102, 103, 113, 0.15)', borderWidth: 2, borderRadius: 3, height: '100%'}}>
                  <CardContent sx={{  paddingBottom: 1, paddingTop: 0 }}>
                    <div className='d-flex flex-row mt-2 align-items-center justify-content-between'>
                    <Typography sx={{ fontSize: 20 }}>
                        {recipe.name}
                    </Typography>
                    <IconButton 
                      sx={{ 
                        width: '12%', 
                        height: '12%', 
                        backgroundColor: favoritedRecipes.includes(recipe.recipeId) ? '#996BFF' : 'transparent',
                        borderRadius: '50%',
                        '&:hover': {
                          backgroundColor: favoritedRecipes.includes(recipe.recipeId) ? '#6E4ABE' : '#f5f5f5', 
                        }
                      }}
                      onClick={() => handleFavoriteRecipe(recipe)}
                    >
                      {favoritedRecipes.includes(recipe.recipeId) ? (
                        <BookmarkIcon size="small" sx={{ color: '#FFFFFF' }} />
                      ) : (
                        <BookmarkBorderIcon sx={{ fontSize: 28 }} />
                      )}
                    </IconButton>
                    </div>

                    <CardMedia
                     component="img"
                     className="rounded mt-2 mb-2"
                     height="140"
                     image={recipe.imageUrl}
                     alt={recipe.name}
                    />

                    <Stack direction="row" sx={{marginTop: 0 }} spacing={2} className="h-100" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" justifyContent="flex-start" alignItems="center">
                      <AccessTimeFilledIcon fontSize='medium' sx={{ color: '#6F6DCF'}} />

                      <Typography sx={{ fontSize: 17, marginLeft: 0.5 }}>{totalTime}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="flex-start" alignItems="center">
                      <LocalFireDepartmentIcon fontSize='medium' sx={{ color: '#4B49C3'}} />
                      <Typography sx={{ fontSize: 17, marginLeft: 0.5 }}>{recipe.nutrients.calories} cal</Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                  <CardActions sx={{  paddingBottom: '1rem', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'  }}>
                    
                    <Button
                      key={index}
                      variant="outlined"
                      size="medium"
                      onClick={() => handleRecipeClick(recipe)}
                      sx={{  
                        textTransform: 'none', 
                        textAlign: 'center', 
                        borderColor: '#D6D9E8', 
                        borderWidth: 2, 
                        color: '#8B61E8',  
                        width: 80, 
                        height: 27, 
                        borderRadius: 3,
                        '&:hover': {
                           borderColor: '#6E4ABE', // Custom hover background color
                           color: '#6E4ABE',
                           backgroundColor: '#F5F0FF' 
                        },
                      
                      }}
                    >View</Button>
                  </CardActions>
                </Card>
                </Grid>
                )
              })}
              
        </Grid>
        </Box>
      </Box>
  );
}