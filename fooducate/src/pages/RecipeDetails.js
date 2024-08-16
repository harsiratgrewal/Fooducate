import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button, Card, CardMedia, Typography, Stepper, Step, StepLabel, StepConnector, ListItem, List } from '@mui/material';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import fetchRecipeById from '../firebase/fetchRecipeById';
import { auth, db } from "../firebase/firebase";
import Header from '../components/Header';
import NutritionGauge from '../components/Gauge';
import IngredientsCard from '../components/IngreidientsCard';
import TimerIcon from '@mui/icons-material/Timer';
import PersonIcon from '@mui/icons-material/Person';
import AdditionalRecipesCarousel from '../components/AdditionalRecipesCarousel.js';
import { styled } from '@mui/system';

const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`& .MuiStepConnector-line`]: {
    borderColor: '#C4C4C4', // Default gray color for incomplete steps
    height: '100%'
  },
  [`&.Mui-active .MuiStepConnector-line`]: {
    borderColor: '#996BFF', // Purple color for active step
    height: '100%'
  },
  [`&.Mui-completed .MuiStepConnector-line`]: {
    borderColor: '#996BFF', // Purple color for completed steps
    height: '100%'
  },
}));

const RecipeDetails = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [fats, setFats] = useState();
  const [proteins, setProteins] = useState();
  const [carbs, setCarbs] = useState();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (userId) {
      const fetchUserMealTargets = async () => {
        try {
          const docRef = doc(db, 'users', userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFats(data.fats);
            setProteins(data.proteins);
            setCarbs(data.carbs);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user meal targets:', error);
        }
      };

      fetchUserMealTargets();
    }

    const getRecipe = async () => {
      setLoading(true);
      const recipeData = await fetchRecipeById(recipeId);
      setRecipe(recipeData);
      setLoading(false);
    };

    getRecipe();
  }, [recipeId, userId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        console.log(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!recipe) {
    return <Typography>No recipe found</Typography>;
  }

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
        <Grid container sx={{ padding: 2, height: '100%' }} spacing={1.5} columns={16}>
          <Grid item xs={11}>
            <Grid container item columns={12} spacing={2}>
              <Grid item xs={12}>
                <Header />
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    height: '100%',
                    backgroundColor: "#FEFEFF",
                    flexDirection: 'column',
                    padding: 2, 
                    borderRadius: 3
                  }}
                >
                  <Card elevation={0} sx={{ display: 'flex' }}>
                    <CardMedia
                      component="img"
                      image={recipe.imageUrl}
                      alt="Recipe Image"
                      className="rounded"
                      height="200"
                    />
                    <Box className="w-100" sx={{ marginLeft: 2, marginBottom: 2, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div className='d-flex flex-column justify-content-start'>
                      <Typography sx={{ fontSize: 24, marginBottom: 1 }} color="#232530">
                        {recipe.name}
                      </Typography>
                      <Typography sx={{ width: '100%', fontSize: 18, marginBottom: 2 }} color="#232530">
                        {recipe.description}
                      </Typography>
                      </div>
                      <div className="d-flex me-2 flex-row justify-content-between">
                      <div className="d-flex flex-row align-items-center">
                      <TimerIcon sx={{ color: "#707070", marginRight: 1 }} />
                      <Typography sx={{ fontSize: 16 }} color="#707070">
                        Prep: {recipe.prepTime} mins
                      </Typography>
                      </div>
                      <div className="d-flex flex-row align-items-center">
                        <TimerIcon sx={{ color: "#707070", marginRight: 1 }} />
                      <Typography sx={{ fontSize: 16 }} color="#707070">
                        Cook: {recipe.cookTime} mins
                      </Typography>
                      </div>
                      <div className="d-flex flex-row align-items-center">
                        <PersonIcon sx={{ color: "#707070", marginRight: 1 }} />
                      <Typography sx={{ fontSize: 16 }} color="#707070">
                        Servings: {recipe.servings}
                      </Typography>
                      </div>
                      </div>
                     
                    </Box>
                  </Card>
                </Paper>
              </Grid>
              <Grid item sx={{ paddingBottom: 2 }} xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    height: '100%',
                    backgroundColor: "#FEFEFF",
                    flexDirection: 'column',
                    padding: 4, 
                    borderRadius: 3
                   
                  }}
                >
                  <Typography variant="h5" color="#232530">
                    Instructions
                  </Typography>
                  <Box className="h-100 d-flex flex-column h-100 justify-content-center">
                  <Stepper
                    sx={{ height: '100%' }}
                    activeStep={activeStep}
                    connector={<CustomStepConnector/>} // Use the custom connector here
                    orientation="vertical"
                  >
                    {recipe.steps.map((step, index) => (
                      <Step key={index} completed={index < activeStep}>
                        <StepLabel
                          sx={{
                            '& .MuiStepLabel-label': {
                              fontWeight: activeStep === index ? 'bold' : 'normal',
                              color: activeStep === index ? '#996BFF' : '#232530',
                            },
                            '& .MuiSvgIcon-root.MuiStepIcon-root.Mui-active': {
                              color: '#996BFF',
                            },
                            '& .MuiSvgIcon-root.MuiStepIcon-root.Mui-completed': {
                              color: '#996BFF', // Purple when completed
                            },
                          }}
                        >
                          <Typography sx={{ fontWeight: activeStep === index ? 'bold' : 'normal', color: activeStep === index ? '#996BFF' : '#232530' }}>
                            Step {index + 1} - {step.title}
                          </Typography>
                          <Typography sx={{ color: '#707070' }}>{step.time} mins</Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mt: 2,
        
                    
                    }}>
                    <Button size="small" 
                    onClick={handleBack} 
                    disabled={activeStep === 0}
                    variant="outlined"
                    sx={{
                      borderColor: '#767676',
                      color: '#767676',
                      width: '25%',
                      '&:hover': {
                      backgroundColor: 'rgba(118, 118, 118, 0.15)', // Custom hover background color
                      borderColor: '#767676',
                      color: '#767676',
                      
                      },
                    }}
                    
                    >
                      Back
                    </Button>
                    <Button 
                    size="small" 
                    onClick={handleNext}
                    variant="contained"
                    disableElevation
                    disabled={activeStep === recipe.steps.length - 1}
                    sx={{ 
                    backgroundColor: '#996BFF',
                    
                    '&:hover': {
                      backgroundColor: '#8A60E6', // Custom hover background color
                    }, 
                    width: '25%'}}
                    
                    >
                      Next
                    </Button>
                  </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item sx={{ marginBottom: 2 }}  xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    height: '100%',
                    backgroundColor: "#FEFEFF",
                    flexDirection: 'column',
                    padding: 1, 
                    borderRadius: 3
                  }}
                >
              
                  <IngredientsCard ingredients={recipe.ingredients} />
                
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sx={{ height: '100%'}} xs={5}>
            <Grid container item columns={12} spacing={2}>
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    height: '100%',
                    backgroundColor: "#FEFEFF",
                    flexDirection: 'column',
                    padding: 2, 
                    borderRadius: 3
                  }}
                >
                  <Typography variant="h5" color="#232530">Macronutrients</Typography>
                    <Grid container direction="row" justifyContent="center" alignItems="center" sx={{height: '100%'}} columns={12}>
                      <Grid item className="d-flex flex-row justify-content-center" xs={4}>
                        <NutritionGauge category="carbs" protein={recipe.nutrients.carbs} color="#996BFF" max={carbs}/>
                      </Grid>
                      <Grid item xs={4}>
                        <NutritionGauge category="protein" protein={recipe.nutrients.protein} max={proteins} color="#39379C"/>
                      </Grid>
                      <Grid item xs={4}>
                        <NutritionGauge category="fats" protein={recipe.nutrients.fat} max={fats} color="#5D5AE6"/>
                       </Grid>
                    </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    height: '100%',
                    backgroundColor: "#FEFEFF",
                    flexDirection: 'column',
                    padding: 2, 
                    borderRadius: 3
                  }}
                >
                   <Typography variant="h5" color="#232530">
                  Nutritional Information
              </Typography>
                  <List>
                    <ListItem sx={{ padding: 0.5, paddingLeft: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Typography sx={{ marginLeft: 1 }}>Carbohydrates</Typography>
                      <Typography>{recipe.nutritionInfoPerServing.carbohydrates}g</Typography>
                    </ListItem>
                    <ListItem sx={{ padding: 0.5, backgroundColor: '#F4EFFF', paddingLeft: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Typography sx={{ marginLeft: 1 }}>Fiber</Typography>
                      <Typography>{recipe.nutritionInfoPerServing.fiber}g</Typography>
                    </ListItem>
                    <ListItem sx={{ padding: 0.5, paddingLeft: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Typography sx={{ marginLeft: 1 }}>Sodium</Typography>
                      <Typography>{recipe.nutritionInfoPerServing.sodium}g</Typography>
                    </ListItem>
                    <ListItem sx={{ padding: 0.5, backgroundColor: '#F4EFFF', paddingLeft: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Typography sx={{ marginLeft: 1 }}>Protein</Typography>
                      <Typography>{recipe.nutritionInfoPerServing.protein}g</Typography>
                    </ListItem>
                    <ListItem sx={{ padding: 0.5, paddingLeft: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Typography sx={{ marginLeft: 1 }}>Sugar</Typography>
                      <Typography>{recipe.nutritionInfoPerServing.sugar}g</Typography>
                    </ListItem>
                    <ListItem sx={{ padding: 0.5, backgroundColor: '#F4EFFF', paddingLeft: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Typography sx={{ marginLeft: 1 }}>Total Fat</Typography>
                      <Typography>{recipe.nutritionInfoPerServing.totalFat}g</Typography>
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              <Grid item sx={{ height: '100%'}} xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    height: '100%',
                    backgroundColor: "#FEFEFF",
                    flexDirection: 'column',
                    padding: 2, 
                    borderRadius: 3
                  }}
                >
                  <AdditionalRecipesCarousel category={recipe.category} currentRecipeId={recipe.recipeId} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          
        </Grid>
      </Box>
    </Box>
  );
};

export default RecipeDetails;