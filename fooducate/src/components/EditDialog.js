import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import EditIcon from '@mui/icons-material/Edit';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'; // Import Firestore and Auth instances
import { onAuthStateChanged } from 'firebase/auth';


export default function EditDialog() {
  const [open, setOpen] = React.useState(false);
  const [fats, setFats] = useState();
  const [proteins, setProteins] = useState();
  const [carbs, setCarbs] = useState();
  const [userId, setUserId] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

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
  }, [userId]);

  const handleSave = async () => {
    if (userId) {
      try {
        const docRef = doc(db, 'users', userId);
        await updateDoc(docRef, {
          fats: parseInt(fats),
          proteins: parseInt(proteins),
          carbs: parseInt(carbs),
        });
        handleClose();
      } catch (error) {
        console.error('Error updating meal targets:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fats') setFats(value);
    if (name === 'proteins') setProteins(value);
    if (name === 'carbs') setCarbs(value);
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen} startIcon={<EditIcon />} disableElevation sx={{width: 100, bgcolor: "#2E4998"  }} size="small" variant="contained">Edit</Button>
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
        <DialogTitle>Edit your macronutrient meal targets</DialogTitle>
        <DialogContent>
            <TextField
            label="Fats (g)"
            type="number"
            name="fats"
            value={fats}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Proteins (g)"
            type="number"
            name="proteins"
            value={proteins}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Carbs (g)"
            type="number"
            name="carbs"
            value={carbs}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}