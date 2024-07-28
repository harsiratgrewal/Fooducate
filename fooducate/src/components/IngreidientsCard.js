import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, TextField } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'; // adjust the import based on your file structure
import { useAuthState } from 'react-firebase-hooks/auth';

const IngredientsCard = ({ ingredients }) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [user] = useAuthState(auth);

  const handleToggle = (value) => () => {
    const currentIndex = checkedItems.findIndex(item => item.name === value);
    const newChecked = [...checkedItems];

    if (currentIndex === -1) {
      newChecked.push({ name: value, quantity: quantities[value] || 1 });
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedItems(newChecked);
  };

  const handleQuantityChange = (name) => (event) => {
    const newQuantities = { ...quantities, [name]: event.target.value };
    setQuantities(newQuantities);

    // Update checked items with new quantity
    const itemIndex = checkedItems.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
      const newChecked = [...checkedItems];
      newChecked[itemIndex].quantity = event.target.value;
      setCheckedItems(newChecked);
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfirm = async () => {
    if (!user) {
      console.error('No user is logged in.');
      return;
    }

    const userGroceryListRef = collection(db, 'users', user.uid, 'grocerylist');

    try {
      for (let item of checkedItems) {
        const price = (Math.random() * 14 + 1).toFixed(2); // Random price between 1 and 15
        await addDoc(userGroceryListRef, { name: item.name, quantity: item.quantity, price });
      }
      setCheckedItems([]);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <Card elevation={0} sx={{ backgroundColor: "#FCFCFD", borderRadius: 5 }}>
      <CardContent>
        <Typography className='fs-5' color="#494949" sx={{ fontWeight: 'medium' }}>Ingredients</Typography>
        <Button variant="contained" color="primary" onClick={handleDialogOpen}>
          Add to Grocery List
        </Button>
        <List>
          {ingredients.map((ingredient, index) => (
            <ListItem key={index} button onClick={handleToggle(ingredient)}>
              <Checkbox
                checked={checkedItems.some(item => item.name === ingredient)}
                tabIndex={-1}
              />
              <ListItemText primary={ingredient} />
              <TextField
                type="number"
                label="Quantity"
                value={quantities[ingredient] || 1}
                onChange={handleQuantityChange(ingredient)}
                sx={{ width: '4rem', marginLeft: '1rem' }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Grocery List</DialogTitle>
        <DialogContent>
          <List>
            {checkedItems.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${item.name} - Quantity: ${item.quantity}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default IngredientsCard;