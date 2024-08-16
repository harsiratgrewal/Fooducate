import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { collection, setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import QuantitySelector from './QuantitySelector'; // Assuming you have this component

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& label.Mui-focused': {
    color: '#996BFF',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#996BFF',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#c4c4c4',
      borderRadius: '5px',
    },
    '&:hover fieldset': {
      borderColor: '#996BFF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#996BFF',
    },
  },
  '& .MuiInputBase-input': {
    padding: '10px',
    fontSize: '16px',
  },
  '& .MuiInputLabel-root': {
    transform: 'translate(10.5px, 10px) scale(1)',
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(10px, -10px) scale(0.80)',
    padding: 1,
    fontSize: '18px',
  },
}));

export default function AddGrocery() {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('');
  const [userId, setUserId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setItemName('');
    setQuantity(1);
    setUnit('');
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleAddItem = async () => {
    if (!itemName.trim() || !userId) return;

    const itemId = uuidv4(); // Generate a unique ID for the item

    try {
      const price = (Math.random() * 14 + 1).toFixed(2); // Random price between 1 and 15
      await setDoc(doc(db, `users/${userId}/grocerylist`, itemId), {
        name: itemName.trim(),
        quantity,
        unit,
        price: price,
      });
      setAlertMessage(`Item "${itemName.trim()}" added to the grocery list.`);
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  return (
    <React.Fragment>
      <Button
        disableElevation
        sx={{
          width: 115,
          bgcolor: "#996BFF",
          fontSize: 15,
          '&:hover': {
            backgroundColor: '#6E4ABE',
          },
        }}
        size="small"
        className='fw-regular'
        variant="contained"
        onClick={handleClickOpen}
      >
        Add Item
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle variant="h5" sx={{ color: "#232530" }}>Add a grocery item</DialogTitle>
        <Divider sx={{ borderColor: '#B0B2BA', borderWidth: 1.5 }} flexItem />
        <DialogContent sx={{ paddingTop: 5 }}>
          <div className='d-flex justify-content-between align-items-center flex-row'>
          <CustomTextField
            label="Grocery item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            variant="outlined"
            
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <QuantitySelector
              value={quantity}
              onIncrease={() => setQuantity(quantity + 1)}
              onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
            />
            <CustomTextField
              label="Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              sx={{ width: 90, marginLeft: '10px' }}
            />
            
          </Box>
          </div>
        </DialogContent>
        <DialogActions sx={{ paddingBottom: 3, paddingTop: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderColor: '#767676',
              color: '#767676',
              width: '20%',
              '&:hover': {
                backgroundColor: 'rgba(118, 118, 118, 0.15)',
                borderColor: '#767676',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddItem}
            variant="contained"
            disableElevation
            sx={{
              marginLeft: 1,
              width: '20%',
              backgroundColor: '#996BFF',
              '&:hover': {
                backgroundColor: '#8A60E6',
              },
            }}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alertOpen}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000}
        onClose={handleAlertClose}
      >
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