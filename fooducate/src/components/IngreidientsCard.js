import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, TextField } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'; // adjust the import based on your file structure
import { useAuthState } from 'react-firebase-hooks/auth';
import QuantitySelector from './QuantitySelector';

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
    <Card elevation={0} sx={{ borderRadius: 5 }}>
      <CardContent>
        <div className='mb-2 d-flex flex-row justify-content-between align-items-center w-100'>
        <Typography sx={{ fontSize: 19, color: "#232530" }}>Ingredients</Typography>
        <Button 
        variant="outlined" 
        color="primary" 
        disableElevation
        onClick={handleDialogOpen}
        sx={{ 
            width: 200,
            '&:hover': {
            borderColor: '#6E4ABE', // Custom hover background color
            },
            borderColor: "#4442B1",
            color: "#4442B1",
            fontWeight: 'regular',
            fontSize: 15,
            borderRadius: 5
            
        }}
        >
          Add to Grocery List
        </Button>
        </div>
        <List sx={{ padding: 0 }}>
          {ingredients.map((ingredient, index) => (
            <ListItem sx={{ paddingLeft: 0, paddingRight: 0, width: '100%' }} key={index} onClick={handleToggle(ingredient)}>
              <Checkbox
                checked={checkedItems.some(item => item.name === ingredient)}
                tabIndex={-1}
                sx={{
                    '&.Mui-checked': {
                      color: '#996BFF',
                    },
                  }}
              />
              <ListItemText primary={ingredient.charAt(0).toUpperCase() + ingredient.slice(1)} />
              <QuantitySelector
                value={quantities[ingredient] || 1}
                onIncrease={handleQuantityChange(ingredient, 1)}
                onDecrease={handleQuantityChange(ingredient, -1)}
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