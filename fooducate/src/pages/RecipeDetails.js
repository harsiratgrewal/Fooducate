import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button, Card, CardHeader, List, Typography, ListItem, MobileStepper, Collapse, ListItemText } from '@mui/material';
import Chatbot from '../components/Chatbot';
import ChatHistory from '../components/ChatHistory';
import { useParams } from 'react-router-dom';
import {  doc, getDoc, query, collection, getDocs, where, writeBatch, addDoc } from "firebase/firestore";
import fetchRecipeById from '../firebase/fetchRecipeById';
import { auth, db, logout } from "../firebase/firebase";
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import 'bootstrap/dist/css/bootstrap.css';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAuthState } from "react-firebase-hooks/auth";
import { onAuthStateChanged } from 'firebase/auth';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Checkbox from '@mui/material/Checkbox';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import SwipeableViews from 'react-swipeable-views';
import { styled, alpha } from '@mui/material/styles';
import WeeklySuggestions from '../components/WeeklySuggestions';
import Header from '../components/Header';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import NutritionGauge from '../components/Gauge';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import IngredientsCard from '../components/IngreidientsCard';



const RecipeDetails = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [user, error] = useAuthState(auth);
  const [userId, setUserId] = useState(null);
  const [fats, setFats] = useState();
  const [proteins, setProteins] = useState();
  const [carbs, setCarbs] = useState();
  const [expanded, setExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  
  const [steps, setSteps] = useState([]);
  const maxSteps = steps.length;

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
      setSteps(recipeData.steps);
      setLoading(false);
    };
 

    getRecipe();
  }, [recipeId, userId]);


   

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  useState(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        console.log(user.uid)
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleViewAllToggle = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };


  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!recipe) {
    return <Typography>No recipe found</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
        <Navbar/>
        <Box
            component="main"
            sx={{
                bgcolor: '#F0F3FF',
                height: '100vh',
                overflow: 'auto',
                width: '100%',
                padding: 1.4
            }}
            >
                <Grid container spacing={1.5} columns={{ xs: 18, sm: 18, md: 18, lg: 18, xl: 12 }}>
                    <Grid item xs={13} sm={13} md={13} lg={13} xl={8}>
                        <Header />
                        <Grid container spacing={{ xs: 1, md: 1.5 }} sx={{height: '100vh', paddingTop: 1 }} columns={12}>
                            <Grid item xs={6}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        backgroundColor: "#FCFCFD",
                                        flexDirection: 'column',
                                        height: '100%',
                                        borderRadius: 5
                                        }}
                                        >
                                    <img src={recipe.imageUrl} alt="Recipe" />
                                    <Typography className='fs-5' color="#494949" sx={{ fontWeight: 'medium' }}>{recipe.name}</Typography>
                                    <Typography className='fs-6' color="#494949" sx={{ fontWeight: 'medium' }}>{recipe.description}</Typography>
                                    <Typography className='fs-6' color="#494949" sx={{ fontWeight: 'medium' }}>{recipe.prepTime} mins</Typography>
                                    <Typography className='fs-6' color="#494949" sx={{ fontWeight: 'medium' }}>{recipe.cookTime} mins</Typography>
                                        
                                </Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        backgroundColor: "#FCFCFD",
                                        flexDirection: 'column',
                                        height: '100%',
                                        borderRadius: 5
                                        }}
                                        >
                                    
                                    <Typography className='fs-5' color="#494949" sx={{ fontWeight: 'medium' }}>Macronutrients</Typography>
                                    <Grid container direction="row" justifyContent="center" alignItems="center" columns={12}>
                                        <Grid item xs={4}>
                                            <NutritionGauge category="protein" protein={recipe.nutrients.protein} max={proteins} color="#4B49C3"/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <NutritionGauge category="fats" protein={recipe.nutrients.fat} max={fats} color="#6D4CB5"/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <NutritionGauge category="carbs" protein={recipe.nutrients.carbs} color="#6F6DCF" max={carbs}/>
                                        </Grid>
                                    </Grid>
                                    
                                        
                                </Paper>
                            </Grid>
                            <Grid item xs={5}>
                                
                                <IngredientsCard ingredients={recipe.ingredients}/>
                            </Grid>
                            <Grid item xs={7}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        backgroundColor: "#FCFCFD",
                                        flexDirection: 'column',
                                        height: '100%',
                                        borderRadius: 5
                                        }}
                                        >
                                    <Typography className='fs-5' color="#494949" sx={{ fontWeight: 'medium' }}>Instructions</Typography>
                                     <SwipeableViews
                                            axis={'x'}
                                            index={activeStep}
                                            onChangeIndex={handleStepChange}
                                            enableMouseEvents
                                            
                                        >
                                            {steps.map((step, index) => (
                                            <div key={index}>
                                                {Math.abs(activeStep - index) <= 2 ? (
                                                <Box sx={{ height: 300, overflow: 'hidden', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Typography>{step}</Typography>
                                                </Box>
                                                ) : null}
                                            </div>
                                            ))}
                                        </SwipeableViews>
                                        <MobileStepper
                                            steps={maxSteps}
                                            sx={{ backgroundColor: '#FCFCFD'}}
                                            position="static"
                                            activeStep={activeStep}
                                            nextButton={
                                            <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                                                Next
                                            </Button>
                                            }
                                            backButton={
                                            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                                Back
                                            </Button>
                                            }
                                        />
                                        <Button size="small" onClick={handleViewAllToggle}>
                                            {expanded ? 'Hide All' : 'View All'}
                                        </Button>
                                        <Collapse in={expanded}>
                                            <List>
                                            {steps.map((step, index) => (
                                                <ListItem key={index}>
                                                <ListItemText primary={`Step ${index + 1}: ${step}`} />
                                                </ListItem>
                                            ))}
                                            </List>
                                        </Collapse>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={5} xl={4}>
                        <Grid container direction="columns" justifyContent="center" alignItems="stretch" spacing={{ xs: 1, md: 1.5 }} sx={{ height: '100%' }} columns={12}>
                            <Grid item xs={12}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        backgroundColor: "#FCFCFD",
                                        flexDirection: 'column',
                                        height: '100%',
                                        borderRadius: 4
                                        }}
                                        >
                                    <Typography className='fs-5' color="#494949" sx={{ fontWeight: 'medium' }}>Nutritional Information</Typography>
                                    <List>
                                    <ListItem sx={{ marginTop: 1.5, padding: 0.5, border: 2, borderRadius: 2, borderColor: "#c5cae9", paddingLeft: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Typography sx={{ marginLeft: 1}}>
                                            Carbohydrates
                                        </Typography>
                                        <Typography>
                                            {recipe.nutritionInfoPerServing.carbohydrates}g
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{ padding: 0.5, marginTop: 1.5, border: 2, borderRadius: 2, borderColor: "#c5cae9", paddingLeft: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Typography sx={{ marginLeft: 1}}>
                                            Energy
                                        </Typography>
                                        <Typography>
                                            {recipe.nutritionInfoPerServing.energy}g
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{ padding: 0.5, marginTop: 1.5, border: 2, borderRadius: 2, borderColor: "#c5cae9", paddingLeft: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Typography sx={{ marginLeft: 1}}>
                                            Fiber
                                        </Typography>
                                        <Typography>
                                            {recipe.nutritionInfoPerServing.fiber}g
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{ padding: 0.5, marginTop: 1.5, border: 2, borderRadius: 2, borderColor: "#c5cae9", paddingLeft: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Typography sx={{ marginLeft: 1}}>
                                            Sodium
                                        </Typography>
                                        <Typography>
                                            {recipe.nutritionInfoPerServing.sodium}g
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{ padding: 0.5, marginTop: 1.5, border: 2, borderRadius: 2, borderColor: "#c5cae9", paddingLeft: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Typography sx={{ marginLeft: 1}}>
                                            Protein
                                        </Typography>
                                        <Typography>
                                            {recipe.nutritionInfoPerServing.protein}g
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{ padding: 0.5, marginTop: 1.5, border: 2, borderRadius: 2, borderColor: "#c5cae9", paddingLeft: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Typography sx={{ marginLeft: 1}}>
                                            Sugar
                                        </Typography>
                                        <Typography>
                                            {recipe.nutritionInfoPerServing.sugar}g
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{ padding: 0.5, marginTop: 1.5, border: 2, borderRadius: 2, borderColor: "#c5cae9", paddingLeft: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Typography sx={{ marginLeft: 1}}>
                                            Total Fat
                                        </Typography>
                                        <Typography>
                                            {recipe.nutritionInfoPerServing.totalFat}g
                                        </Typography>
                                    </ListItem>

                                </List>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        backgroundColor: "#FCFCFD",
                                        flexDirection: 'column',
                                        height: '100%',
                                        borderRadius: 4
                                        }}
                                    >
                                    <Typography className='fs-5' color="#494949" sx={{ fontWeight: 'medium' }}>Other recipes</Typography>
                                    
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