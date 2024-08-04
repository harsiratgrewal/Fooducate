import React, { useState, useEffect } from 'react';
import { Box, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, List, ListItem, ListItemText, Typography, Select, MenuItem, FormControl, InputLabel, Grid, Card, CardContent, CardActions } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { db, auth } from '../firebase/firebase'; // Import Firestore and Auth instances
import { onAuthStateChanged } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import dayjs from 'dayjs';

export default function AddPlan() {
  const [open, setOpen] = React.useState(false);
  const [userId, setUserId] = useState(null);
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState('');
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [proteins, setProteins] = useState('');
  const [fats, setFats] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(dayjs());
  const [category, setCategory] = useState('');


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  const handleAddItem = async () => {

    const itemId = uuidv4(); // Generate a unique ID for the item

    try {
      await addDoc(collection(db, `users/${userId}/mealplan`), {
          name: recipeName,
          ingredients: ingredients,
          steps: steps,
          nutrients: {
            calories: parseInt(calories, 10),
            carbs: parseInt(carbs, 10),
            proteins: parseInt(proteins, 10),
            fats: parseInt(fats, 10),
          },
          cookTime: parseInt(cookTime, 10),
          prepTime: parseInt(prepTime, 10),
          description: description,
          servings: parseInt(servings, 10),
          notes: notes,
          date: date, // Format date as YYYY-MM-DD
          category: category,
        
      });
      console.log(`Item ${recipeName} added to user ${userId}'s meal plan with ID ${itemId}.`);
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  


  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Item
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            handleClose();
          },
        }}
      >
        <DialogTitle>Add Grocery Item</DialogTitle>
        <DialogContent>
          
          <TextField
              label="Recipe Name"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Ingredients (comma-separated)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Instructions"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Calories"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Carbs (g)"
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Proteins (g)"
                  type="number"
                  value={proteins}
                  onChange={(e) => setProteins(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Fats (g)"
                  type="number"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>
            <TextField
              label="Cook Time (minutes)"
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Prep Time (minutes)"
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Servings"
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              margin="normal"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
              />
            </LocalizationProvider>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="breakfast">Breakfast</MenuItem>
                <MenuItem value="lunch">Lunch</MenuItem>
                <MenuItem value="dinner">Dinner</MenuItem>
                <MenuItem value="snacks">Snacks</MenuItem>
                <MenuItem value="sweets">Sweets</MenuItem>
              </Select>
            </FormControl>
      
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAddItem}>
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}