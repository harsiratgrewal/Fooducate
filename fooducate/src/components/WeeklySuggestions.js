import { Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import Card from '@mui/material/Card';
import { db, auth } from '../firebase/firebase';
import { Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { collection, getDocs, where, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const newTheme = (theme) => createTheme({
  ...theme,
  components: {
    MuiPickersCalendarHeader: {
      styleOverrides: {
        labelContainer: {
          borderRadius: '10px',
          border: '0px solid',
          width: '75%',
          fontSize: 16
          
        }
      }
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          fontSize: 18,
          '&.Mui-selected': {
            backgroundColor: '#996BFF',
            '&:hover': {
              backgroundColor: '#4B49C3',
            },
          }
        }
      }
    },
    MuiDayCalendar: {
      styleOverrides: {
        weekContainer: {
          margin: 10 
        },
         weekDayLabel: {
          fontSize: 18
        }
      }
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          borderWidth: '0px',
          borderColor: '#e91e63',
          border: '0px solid',
          marginLeft: 0,
          marginTop: '2rem'
        }
      }
    }
  }
})

export default function WeeklySuggestions() {
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [setUserId] = useState(null);
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState({})

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchMealPlans(user.uid);
      } else {
        setUserId(null);
        setMealPlans([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchMealPlans = async (uid) => {
    try {
      const mealPlansCollection = collection(db, 'mealplans');
      const q = query(mealPlansCollection, where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      const mealPlansList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMealPlans(mealPlansList);

      // Fetch associated recipes
      const categories = ['breakfast', 'lunch', 'dinner'];
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // const handleCategoryChange = (event) => {
  //   const value = event.target.value;
  //   setSelectedCategories(
  //     typeof value === 'string' ? value.split(',') : value
  //   );
  // };

  const filteredMealPlans = mealPlans.filter(mealPlan => {
    const sameDay = dayjs(mealPlan.date).isSame(selectedDate, 'day');
    const inSelectedCategories = selectedCategories.length === 0 || selectedCategories.includes(recipes[mealPlan.recipeId]?.category);
    return sameDay && inSelectedCategories;
  });

  const groupedMealPlans = (category) => {
    return filteredMealPlans.filter(mealPlan => recipes[mealPlan.recipeId]?.category === category);
  };

  const displayedDate = new Date(selectedDate).toLocaleDateString('en-us', { weekday: 'long', month: 'long', day: 'numeric' })
  
  return (
    <React.Fragment>
        <React.Fragment>

            <Grid container sx={{ height: '100%', padding: 0 }}>
                    <Grid item xs={12}>
                      <Grid container sx={{ height: '100%', padding: 0 }}>
                        <Grid item xs={6} className='d-flex flex-column justify-content-start'>
                          <Typography variant="h5" color="#232530">
                              Meal Plans 
                          </Typography>
                          
                        <ThemeProvider theme={newTheme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateCalendar 
                          defaultValue={dayjs(new Date())} 
                          value={selectedDate} 
                          onChange={handleDateChange} />                     
                        </LocalizationProvider>
                        </ThemeProvider>
                       
                        </Grid>
                        
                    
                      <Grid item xs={6} sx={{  height: '100%' }} className='d-flex flex-column justify-content-start'>
                        <Typography sx={{ paddingBottom: 1, fontSize: 20}}>{displayedDate}</Typography>
                        <div style={{ marginTop: '2rem' }}>
                          {['breakfast', 'lunch', 'dinner'].map(category => (
                            <React.Fragment key={category}>
                              
                              <Typography sx={{ fontSize: 16, paddingBottom: 1, fontWeight: 'light' }} className="ps-0">{category.charAt(0).toUpperCase() + category.slice(1)}</Typography>
                              <Grid container direction="column" spacing={2} wrap="nowrap">
                                {groupedMealPlans(category).map(mealPlan => (
                                  <Grid sx={{ height: '100%' }} item key={mealPlan.id}>
                                    <Card variant="outlined" sx={{ textAlign: 'left'}} className="border w-100 fw-light rounded-3 py-3 px-2 mb-3 d-flex flex-row justify-content-between align-items-center">
                                      <Typography sx={{ fontSize: 18, width: '100%' }}>{recipes[mealPlan.recipeId] ? recipes[mealPlan.recipeId].name : 'Loading...'}</Typography>
                                      <div className='d-flex flex-row align-items-center justify-content-end'>
                                      <LocalFireDepartmentIcon fontSize='medium' sx={{ color: '#4B49C3', marginRight: 0.25}} />
                                      <Typography sx={{ fontSize: 18, width: '100%'  }}>{recipes[mealPlan.recipeId] ? recipes[mealPlan.recipeId].nutrients.calories : 'Loading...'}</Typography>
                                      </div>
                                    </Card>
                                  </Grid>
                                ))}
                              </Grid>
                              
                            </React.Fragment>
                          ))}
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
            </Grid>
        </React.Fragment>
    </React.Fragment>
  )
}