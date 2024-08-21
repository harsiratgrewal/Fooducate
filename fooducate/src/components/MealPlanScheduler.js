import { Menu, MenuItem, Typography, Button, Box, Grid, Card, List, ListItem, Alert } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { setDoc, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import proteinIcon from '../img/proteindrumstick2.svg';
import fatsIcon from '../img/droplet.svg';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import carbsIcon from '../img/wheatcarbs.svg';
import AddMeal from './AddMeal';
import CheckIcon from '@mui/icons-material/Check';
import { db, auth } from '../firebase/firebase';
import ProgressBar from './ProgressBar';
import CarbsProgressBar from './CarbsProgressBar';
import FatsProgressBar from './FatsProgressBar';
import Header from './Header';
import CustomWeekPickerInput from './CustomWeekPickerInput'; // Import the custom input component
import { useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
dayjs.extend(isBetween);

export default function MealPlanScheduler() {
  const [userId, setUserId] = useState(null);
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fats, setFats] = useState();
  const [proteins, setProteins] = useState();
  const [carbs, setCarbs] = useState();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [startOfWeek, setStartOfWeek] = useState(dayjs().startOf('week'));
  const [endOfWeek, setEndOfWeek] = useState(dayjs().endOf('week'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchMealPlans(user.uid);
        fetchUserMealTargets(user.uid);
      } else {
        setUserId(null);
        setMealPlans([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setStartOfWeek(selectedDate.startOf('week'));
    setEndOfWeek(selectedDate.endOf('week'));
  }, [selectedDate]);

  const fetchUserMealTargets = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
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

  const handleMealPlanAdded = (newMealPlans) => {
    setMealPlans((prevMealPlans) => [...prevMealPlans, ...newMealPlans]);
  };

  const fetchMealPlans = async (uid) => {
    try {
      const mealPlansCollection = collection(db, 'mealplans');
      const q = query(mealPlansCollection, where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      const mealPlansList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMealPlans(mealPlansList);

      // Fetch associated recipes
      const categories = ['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'];
      const allRecipes = {};

      await Promise.all(categories.map(async (category) => {
        const categoryCollection = collection(db, category);
        const categorySnapshot = await getDocs(categoryCollection);
        categorySnapshot.docs.forEach((doc) => {
          allRecipes[doc.id] = { ...doc.data(), category };
        });
      }));

      setRecipes(allRecipes);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };

  const getDayName = (date) => {
    return dayjs(date).format('ddd');
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSave = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
    handleCloseDialog();
  };

  const handleMenuClick = (event, recipe) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecipe(recipe);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRecipe(null);
  };

  const handleViewRecipe = () => {
    navigate(`/recipe/${selectedRecipe.recipeId}`);
    handleMenuClose();
  };

  const handleFavoriteRecipe = async () => {
    if (userId && selectedRecipe && selectedRecipe.recipeId) {
      try {
        const favoriteDocRef = doc(collection(db, `users/${userId}/favoritedMeals`));
        await setDoc(favoriteDocRef, {
          recipeId: selectedRecipe.recipeId,
          favoritedAt: new Date()
        });

        handleMenuClose();
        setAlertOpen(true);
        setAlertMessage(`${selectedRecipe.name} added to favorites`);
      } catch (error) {
        console.error('Error adding to favorited meals:', error);
      }
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const filterMealPlansByWeek = (startOfWeek, endOfWeek) => {
    return mealPlans.filter(mealPlan =>
      dayjs(mealPlan.date).isBetween(startOfWeek, endOfWeek, null, '[]')
    );
  };

  const calculateNutrients = (mealPlansForDay) => {
    return mealPlansForDay.reduce((totals, mealPlan) => {
      const recipe = recipes[mealPlan.recipeId];
      if (recipe) {
        totals.protein += recipe.nutrients.protein || 0;
        totals.fats += recipe.nutrients.fat || 0;
        totals.carbs += recipe.nutrients.carbs || 0;
      }
      return totals;
    }, { protein: 0, fats: 0, carbs: 0 });
  };

  const mealPlansByDayAndCategory = filterMealPlansByWeek(startOfWeek, endOfWeek).reduce((acc, mealPlan) => {
    const dayName = getDayName(mealPlan.date);
    const category = recipes[mealPlan.recipeId]?.category || 'other';
    if (!acc[dayName]) acc[dayName] = {};
    if (!acc[dayName][category]) acc[dayName][category] = [];
    acc[dayName][category].push(mealPlan);
    return acc;
  }, {});

  return (
    <React.Fragment>
      <Grid container sx={{ padding: 1, overflowX: 'hidden' }} spacing={1.5} columns={18}>
        <Grid item xs={18} sx={{ paddingBottom: 1 }}>
          <div className="row mt-1 g-2">
            <div className="col-12">
              <div className="row mb-2">
                <Header />
              </div>
            </div>
            <div className="col-12">
              <Box sx={{ height: '100%' }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  borderRadius: 4,
                  padding: 0.25
                }}>
                  <Card elevation={0} className="d-flex p-3 flex-row justify-content-between align-items-center" sx={{ borderRadius: 3 }}>
                    <Typography variant="h5" color='#232530' sx={{ fontWeight: 'semibold' }}>
                      Meal Planner
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Select Week"
                          value={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          renderInput={(params) => <CustomWeekPickerInput {...params} value={selectedDate} onChange={setSelectedDate} />}
                          views={['year', 'month', 'day']}
                        />
                      </LocalizationProvider>
                      <Button disableElevation variant="contained"
                        sx={{
                          width: 150,
                          color: '#FFFFFF',
                          backgroundColor: '#996BFF',
                          marginLeft: 2,
                          '&:hover': {
                            backgroundColor: '#8A60E6', // Custom hover background color
                          },

                        }}
                        onClick={handleOpenDialog}>
                        Add meal
                      </Button>
                    </Box>
                    <AddMeal open={dialogOpen} onClose={handleCloseDialog} onSave={handleSave} onMealPlanAdded={handleMealPlanAdded} />
                  </Card>
                  <Box>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={9} xl={12} lg={12} sx={{ width: '100%' }}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => {
                          const mealPlansForDay = mealPlansByDayAndCategory[day] || {};
                          const nutrients = calculateNutrients(Object.values(mealPlansForDay).flat());
                          return (
                            <Grid item xs={12} key={day} sx={{ width: '100%' }}>
                              <div className="d-flex flex-row mb-2 mt-4">
                                <Card variant="contained" sx={{ width: 70, overflow: 'visible', borderRadius: 7, backgroundColor: '#FEFEFF', padding: 1, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                                  <Typography sx={{ alignSelf: 'center', color: '#232530', marginTop: 1, fontSize: 18 }}>{day}</Typography>
                                </Card>
                                <Box sx={{ width: '15%' }} className="d-flex flex-column justify-content-evenly ms-2 me-2">
                                  <ProgressBar variant="determinate" value={nutrients.protein} max={proteins} />
                                  <CarbsProgressBar variant="determinate" value={nutrients.fats} max={fats} />
                                  <FatsProgressBar variant="determinate" value={nutrients.carbs} max={carbs} />
                                </Box>
                                <Grid container spacing={1} columns={30}>
                                  {['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'].map(category => (
                                    <Grid sx={{ height: '100%' }} item xs={25} sm={25} md={25} lg={6} xl={6} key={category}>
                                      <Typography sx={{ backgroundColor: "#FEFEFF", borderRadius: 2, paddingLeft: 1.5, paddingRight: 2, paddingTop: 1, paddingBottom: 1, fontSize: 18 }}>{category.charAt(0).toUpperCase() + category.slice(1)}</Typography>
                                      <List>
                                        {mealPlansByDayAndCategory[day] && mealPlansByDayAndCategory[day][category] ? mealPlansByDayAndCategory[day][category].map(mealPlan => (
                                          <ListItem sx={{ backgroundColor: "#FEFEFF", borderRadius: 2, marginBottom: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} key={mealPlan.id}>

                                            <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-2">
                                              <Typography sx={{ fontSize: 19 }}>{recipes[mealPlan.recipeId] ? recipes[mealPlan.recipeId].name : 'Loading...'}</Typography>
                                              <IconButton sx={{ width: '20%' }} onClick={(event) => handleMenuClick(event, recipes[mealPlan.recipeId])}>
                                                <MoreVertIcon />
                                              </IconButton>
                                            </div>
                                            <div className="d-flex flex-row justify-content-between align-items-center w-100 mb-2">
                                              <div className="d-flex flex-row align-items-center">
                                                <img style={{ transform: 'rotate(135deg)', marginRight: 2 }} src={proteinIcon} alt="protein icon" />
                                                <Typography sx={{ fontSize: 17 }}>{recipes[mealPlan.recipeId] ? recipes[mealPlan.recipeId].nutrients.protein : 'Loading...'}g</Typography>
                                              </div>
                                              <div className="d-flex flex-row align-items-center">
                                                <img style={{ marginRight: 2, transform: 'rotate(-45deg)' }} src={carbsIcon} alt="carbs icon" />
                                                <Typography sx={{ fontSize: 17 }}>{recipes[mealPlan.recipeId] ? recipes[mealPlan.recipeId].nutrients.carbs : 'Loading...'}g</Typography>
                                              </div>
                                              <div className="d-flex flex-row align-items-center">
                                                <img style={{ marginRight: 2 }} src={fatsIcon} alt="fats icon" />
                                                <Typography sx={{ fontSize: 17 }}>{recipes[mealPlan.recipeId] ? recipes[mealPlan.recipeId].nutrients.fat : 'Loading...'}g</Typography>
                                              </div>
                                            </div>
                                          </ListItem>
                                        )) : (
                                          <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: "rgba(153, 107, 255, 0.10)", border: 1, borderColor: '#996BFF', padding: 2, borderRadius: 3 }}>
                                            <AddCircleIcon sx={{ color: '#8B61E8', marginRight: 0.75 }} />
                                            <Typography sx={{ fontSize: 17, color: '#8B61E8' }} variant="body2">Add meal</Typography>
                                          </Card>
                                        )}
                                      </List>
                                    </Grid>
                                  ))}
                                </Grid>
                              </div>
                            </Grid>
                          )
                        })}
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </div>
          </div>
        </Grid>
      </Grid>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewRecipe}>View</MenuItem>
        <MenuItem onClick={handleFavoriteRecipe}>Favorite</MenuItem>
      </Menu>
      <Snackbar open={alertOpen} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert
          icon={<CheckIcon sx={{ color: '#1B6A36', fontSize: 28 }} />}
          sx={{ bgcolor: '#95EDB3', color: '#1B6A36', fontSize: 18 }}
          variant="filled"
          onClose={handleAlertClose}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}