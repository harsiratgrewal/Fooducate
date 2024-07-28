import { Stack, Typography, Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import { db, auth } from '../firebase/firebase';
import AddIcon from '@mui/icons-material/Add';
import ListItemText from '@mui/material/ListItemText';
import AddMeal from './AddMeal';
import AddPlan from './AddPlan';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { useAuthState } from "react-firebase-hooks/auth";
import { List, ListItem, Checkbox, ListItemSecondaryAction, ListItemIcon, Grid, ListSubheader } from '@mui/material';
import { collection, getDocs, getDoc, doc, writeBatch, where, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { nanoid } from 'nanoid';
import Button from '@mui/material/Button';
import { deleteField } from 'firebase/firestore';


const categoryOptions = [
    {name: "Breakfast", value: "breakfast"},
    {name: "Lunch", value: "lunch"},
    {name: "Dinner", value: "dinner"},
    {name: "Snacks", value: "snacks"},
    {name: "Sweets", value: "sweets"},
]

export default function WeeklySuggestions() {
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState({})
  const [items, setItems] = useState([]);
  const [user, loading, error] = useAuthState(auth);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  const handleSave = () => {
      // Optional: Add any additional logic to handle after saving
      console.log('Recipe added to meal plan');
  };

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

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategories(
      typeof value === 'string' ? value.split(',') : value
    );
  };

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

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 2}}>
                  
                <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium'}}>
                    Meal Plans 
                </Typography>
                  <Stack direction="row" spacing={2}>
                  <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-select-small"
                    displayEmpty
                    value={selectedCategories}
                    multiple
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                        return <Typography variant="body1">Filter</Typography>;
                        }

                        return selected.join(', ');
                    }}
                    sx={{ borderRadius: 3, width: '100%', height: 40}}
                    onChange={handleCategoryChange}
                    >
                    {['breakfast', 'lunch', 'dinner'].map((category) => (
                    <MenuItem key={category} value={category}>
                      <ListItemIcon>
                        <Checkbox checked={selectedCategories.indexOf(category) > -1} />
                      </ListItemIcon>
                      <ListItemText primary={category.charAt(0).toUpperCase() + category.slice(1)} />
                    </MenuItem>
                  ))}
                  </Select>
                  </FormControl>
                  </Stack>
                  </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateCalendar defaultValue={dayjs(new Date())} value={selectedDate} onChange={handleDateChange} />                     
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography sx={{ paddingLeft: 2, paddingBottom: 2, fontSize: 20}}>{displayedDate}</Typography>
                        <List sx={{ padding: 0, paddingLeft: 2, paddingRight: 2, marginBottom: 2  }}>
                          {['breakfast', 'lunch', 'dinner'].map(category => (
                            <React.Fragment key={category}>
                              <Typography sx={{ fontSize: 15, paddingBottom: 1 }} className="ps-0 fw-medium">{category.charAt(0).toUpperCase() + category.slice(1)}</Typography>
                              {groupedMealPlans(category).map(mealPlan => (
                                <ListItem key={mealPlan.id} className="border rounded-3 mb-3 d-flex flex-row justify-content-between">
                                  
                                  <Typography sx={{ fontSize: 15 }}>{recipes[mealPlan.recipeId] ? recipes[mealPlan.recipeId].name : 'Loading...'}</Typography>
                                  <Typography sx={{ fontSize: 15 }}>{recipes[mealPlan.recipeId] ? recipes[mealPlan.recipeId].nutrients.calories : 'Loading...'}</Typography>
                                  
                                </ListItem>
                              ))}
                            </React.Fragment>
                          ))}
                        </List>
                    </Grid>
                </Grid>
              </Grid>
        </React.Fragment>
    </React.Fragment>
  )
}