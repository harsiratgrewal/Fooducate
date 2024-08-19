import React, { useState } from 'react';
import { Card, CardContent, Typography, Checkbox, Button, Dialog, DialogContent, DialogActions, List, ListItem, ListItemText, TextField, Divider, Snackbar, Alert } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'; // adjust the import based on your file structure
import { useAuthState } from 'react-firebase-hooks/auth';
import QuantitySelector from './QuantitySelector';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckIcon from '@mui/icons-material/Check';
import { styled } from '@mui/material';

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& label.Mui-focused': {
    color: '#996BFF', // Color of the label when focused
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#996BFF', // Color of the underline when focused
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#c4c4c4', // Default border color
      borderRadius: '5px', // Custom border radius
    },
    '&:hover fieldset': {
      borderColor: '#996BFF', // Border color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#996BFF', // Border color when focused
    },
  },
  '& .MuiInputBase-input': {
    padding: '10px', // Adjust padding to align with Typography
    fontSize: '16px', // Adjust font size to match Typography if necessary
  },
  '& .MuiInputLabel-root': {
    transform: 'translate(10.5px, 10px) scale(1)', // Adjust label position
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(10px, -10px) scale(0.80)', // Adjust label position when focused
    padding: 1, 
    fontSize: '18px'
  }
}));

const IngredientsCard = ({ ingredients }) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [units, setUnits] = useState({});
  const [user] = useAuthState(auth);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleToggle = (value) => () => {
    const currentIndex = checkedItems.findIndex(item => item.name === value);
    const newChecked = [...checkedItems];

    if (currentIndex === -1) {
      newChecked.push({ name: value, quantity: quantities[value] || 1, unit: units[value] || '' });
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedItems(newChecked);
  };

  const handleQuantityChange = (name, change) => (event) => {
    event.stopPropagation();
    const newQuantities = { ...quantities, [name]: Math.max((quantities[name] || 1) + change, 1) };
    setQuantities(newQuantities);

    const itemIndex = checkedItems.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
      const newChecked = [...checkedItems];
      newChecked[itemIndex].quantity = newQuantities[name];
      setCheckedItems(newChecked);
    }
  };

  const handleUnitChange = (name) => (event) => {
    const newUnits = { ...units, [name]: event.target.value };
    setUnits(newUnits);

    const itemIndex = checkedItems.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
      const newChecked = [...checkedItems];
      newChecked[itemIndex].unit = event.target.value;
      setCheckedItems(newChecked);
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
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
        await addDoc(userGroceryListRef, { name: item.name, quantity: item.quantity, unit: item.unit, price });
      }
      setAlertMessage(`${checkedItems.length} ingredient(s) added to the grocery list.`);
      setAlertOpen(true);
      setCheckedItems([]);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 3 }}>
      <CardContent>
        <div className='mb-2 h-100 d-flex flex-row justify-content-between align-items-start w-100'>
          <div className='d-flex flex-column'>
            <Typography variant="h5" sx={{ color: "#232530" }}>Ingredients</Typography>
            <Typography variant="subtitle1">Add any ingredient(s) to your grocery list </Typography>
          </div>
          <Button 
            variant="outlined" 
            color="primary" 
            disableElevation
            onClick={handleDialogOpen}
            sx={{ 
                width: 90,
                '&:hover': {
                borderColor: '#4B49C3', // Custom hover background color
                backgroundColor: '#EDEDF9'
                },
                borderColor: "#4442B1",
                color: "#4442B1",
                fontWeight: 'regular',
                fontSize: 15,
                borderRadius: 1
            }}
          >
            <AddShoppingCartIcon sx={{ marginRight: 1, color: '#4442B1',fontSize: 18 }} />
            Add
          </Button>
        </div>
        <List sx={{ padding: 0, height: '100%' }}>
          {ingredients.map((ingredient, index) => (
            <ListItem sx={{ paddingLeft: 0, paddingRight: 0, width: '100%' }} key={index} onClick={handleToggle(ingredient)}>
              <Checkbox
                checked={checkedItems.some(item => item.name === ingredient)}
                tabIndex={-1}
                sx={{
                    '&.Mui-checked': {
                      color: '#996BFF',
                    },
                    color: '#B7BAC5',
                    paddingLeft: 0
                  }}
              />
              <ListItemText primary={ingredient.charAt(0).toUpperCase() + ingredient.slice(1)} />
              <QuantitySelector
                value={quantities[ingredient] || 1} // Ensure correct quantity is passed
                onIncrease={handleQuantityChange(ingredient, 1)}
                onDecrease={handleQuantityChange(ingredient, -1)}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <Dialog maxWidth="sm" fullWidth open={dialogOpen} onClose={handleDialogClose}>
        <Typography variant="h5" sx={{ color: "#232530" }} className='ps-4 pt-4'>Confirm Grocery List</Typography>
        <Divider sx={{ borderColor: '#B0B2BA', borderWidth: 1.5, marginTop: 2  }} flexItem />
        <DialogContent sx={{ paddingTop: 2 }}>
          <Typography sx={{ fontSize: 20, color: "#232530" }}>Items</Typography>
          <List sx={{ paddingLeft: 0, marginTop: 1  }}>
            {checkedItems.map((item, index) => (
              <ListItem key={index} sx={{ borderRadius: 3, paddingLeft: 0, marginBottom: 2 }}>
                <ListItemText
                  primary={
                    <Typography sx={{ color: "#232530", paddingLeft: 0, fontSize: 18 }}>
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </Typography>
                  }
                />
                <div className='d-flex flex-row align-items-center'>
                  <QuantitySelector
                    value={quantities[item.name] || 1} // Use stored quantity value
                    onIncrease={handleQuantityChange(item.name, 1)}
                    onDecrease={handleQuantityChange(item.name, -1)}
                  />
                <CustomTextField
                  label="Unit"
                  value={units[item.name] || ''}
                  onChange={handleUnitChange(item.name)}
                  sx={{ width: 90, marginLeft: '10px' }}
                />
                </div>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <div className='d-flex pb-4 flex-row justify-content-center w-100'>
          <Button 
          onClick={handleDialogClose}
          variant="outlined"
          sx={{ 
            
            width: '20%',
            borderColor: '#767676',
            color: '#767676', 
            '&:hover': {
               backgroundColor: 'rgba(118, 118, 118, 0.15)', // Custom hover background color
               borderColor: '#767676'
            }, 
          }}
          >
            Cancel
          </Button>
          <Button 
          onClick={handleConfirm} 
          disableElevation
          variant="contained"
          sx={{ 
              marginLeft: 1,
              backgroundColor: '#996BFF',
              width: '20%',
              '&:hover': {
              backgroundColor: '#8A60E6', // Custom hover background color
             }, 
          }} 
          >
            Confirm
          </Button>
        </div>
        </DialogActions>
      </Dialog>
      <Snackbar open={alertOpen} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert
          icon={<CheckIcon sx={{ color: '#1B6A36', fontSize: 28 }} />}
          sx={{ bgcolor: '#95EDB3', color: '#1B6A36', fontSize: 18 }}
          variant="filled"
          onClose={handleAlertClose}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default IngredientsCard;