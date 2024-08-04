import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { collection, setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'; // Import Firestore and Auth instances
import { onAuthStateChanged } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs


export default function AddGrocery() {
  const [open, setOpen] = React.useState(false);
  const [itemName, setItemName] = useState('');
  const [userId, setUserId] = useState(null);

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
    if (!itemName.trim() || !userId) return;

    const itemId = uuidv4(); // Generate a unique ID for the item

    try {
      await setDoc(doc(db, `users/${userId}/grocerylist`, itemId), {
        name: itemName.trim(),
      });
      setItemName('');
      console.log(`Item ${itemName.trim()} added to user ${userId}'s grocery list with ID ${itemId}.`);
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };


  return (
    <React.Fragment>
      <Button disableElevation 
      sx={{
        width: 115, 
        bgcolor: "#996BFF", 
        fontSize: 15,
        '&:hover': {
          backgroundColor: '#6E4ABE', // Custom hover background color
        },
       }} 
      size="small" 
      className='fw-regular' 
      variant="contained" 
      onClick={handleClickOpen}>
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
              label="Add Grocery Item"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              variant="outlined"
          />
      
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