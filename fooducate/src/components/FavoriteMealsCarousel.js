import React, { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { Box, Button, MobileStepper, Typography, Card, CardContent, CardMedia, Stack } from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { collection, getDocs, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { db, auth } from '../firebase/firebase';

const categories = ['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'];

const FavoriteMealsCarousel = () => {
  const [userId, setUserId] = useState(null); //removed userid
  const [favoriteMeals, setFavoriteMeals] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = favoriteMeals.length;

  useEffect(() => {
    const fetchFavoriteMeals = async (uid) => {
      try {
        const q = query(collection(db, `users/${uid}/favoritedMeals`));
        const querySnapshot = await getDocs(q);
        const mealsList = querySnapshot.docs.map(doc => doc.data().recipeId);
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
      }
    });

    return () => unsubscribe();
  }, [userId]);



  const fetchRecipes = async (mealsList) => {
    const allRecipes = [];
    try {
      for (const category of categories) {
        const categoryCollection = collection(db, category);
        const querySnapshot = await getDocs(categoryCollection);
        querySnapshot.docs.forEach((doc) => {
          const recipeId = doc.data().recipeId;
          if (mealsList.includes(recipeId)) {
            allRecipes.push({ ...doc.data(), category, recipeId: doc.id });
          }
        });
      }
      setFavoriteMeals(allRecipes);
    } catch (error) {
      console.error("Error fetching recipes: ", error);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {maxSteps === 0 ? (
        <Box>
        <Typography variant="h5" color='#232530'>Top favorite meals</Typography>
        <Box sx={{ textAlign: 'center', marginTop: 2, padding: 4, marginBottom: 2, borderRadius: 2, backgroundColor: 'rgba(231, 233, 243, 0.60)' }}>
        <Typography variant="body1" color="#232530">
          You have no favorited meals.
        </Typography>
        </Box>
        </Box>
      ) : (
        <>
          <SwipeableViews
            axis={'x'}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            {favoriteMeals.map((meal, index) => (
              <div key={index}>
                {Math.abs(activeStep - index) <= 2 ? (
                  <Box sx={{ height: '100%', overflow: 'hidden', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Card elevation={0} sx={{ width: '100%' }}>
                      <Typography className="mb-2" variant="h5" color='#232530'>Top favorite meals</Typography>
                      <CardMedia
                        component="img"
                        height="240"
                        image={meal.imageUrl || 'default-image-url.jpg'}
                        alt={meal.name}
                        className='rounded'
                      />
                      <CardContent className='p-0'>
                        <Stack direction="row" justifyContent="space-between" alignContent="center">
                          <Typography variant="h5" sx={{ mt: 1 }} color='#232530'>{meal.name}</Typography>
                          <div className='w-25 d-flex flex-row mt-1 justify-content-end align-items-center'>
                          <LocalFireDepartmentIcon fontSize='medium' sx={{ color: '#4B49C3', marginRight: 0.25}} />
                          <Typography variant="body1">{meal.nutrients.calories}</Typography>
                          </div>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AccessTimeFilledIcon fontSize="small" sx={{ color: '#6F6DCF' }} />
                          <Typography variant="body1">{meal.cookTime} Min</Typography>
                        </Stack>
                        <Typography variant="body1">{meal.ingredients.length} ingredients</Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ) : null}
              </div>
            ))}
          </SwipeableViews>
          <MobileStepper
            steps={maxSteps}
            sx={{
              marginTop: 2,
              backgroundColor: 'rgba(231, 233, 243, 0.60)',
              paddingLeft: 0,
              paddingRight: 0,
              borderRadius: 6,
              '& .MuiMobileStepper-dot': {
                backgroundColor: '#C4C4C4', // Default dot color (gray)
              },
              '& .MuiMobileStepper-dotActive': {
                backgroundColor: '#996BFF', // Active dot color (purple)
              },
            }}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button size="small" sx={{ width: 30, borderRadius: 20 }} onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                <ArrowCircleRightIcon fontSize="large" sx={{ color: '#996BFF' }} />
              </Button>
            }
            backButton={
              <Button size="small" sx={{ width: 30, borderRadius: 20 }} onClick={handleBack} disabled={activeStep === 0}>
                <ArrowCircleLeftIcon fontSize="large" sx={{ color: '#996BFF' }} />
              </Button>
            }
          />
        </>
      )}
    </Box>
  );
};

export default FavoriteMealsCarousel;