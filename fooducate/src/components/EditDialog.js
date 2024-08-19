import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import EditIcon from '@mui/icons-material/Edit';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'; // Import Firestore and Auth instances
import { onAuthStateChanged } from 'firebase/auth';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CheckIcon from '@mui/icons-material/Check';


export default function EditDialog() {
  const [open, setOpen] = React.useState(false);
  const [fats, setFats] = useState();
 // const [proteins, setProteins] = useState();
  const [userId, setUserId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

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

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleSave = async () => {
    if (userId) {
      try {
        const docRef = doc(db, 'users', userId);
        await updateDoc(docRef, {
          fats: parseInt(fats),
        });
        handleClose();
        setAlertMessage('Fats daily intake goal has been updated');
        setAlertOpen(true)
      } catch (error) {
        console.error('Error updating meal targets:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fats') setFats(value);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen} sx={{ width: 40, color: "#BBBECA" }}><EditIcon /></IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            handleClose();
          },
        }}
      >
        <DialogTitle sx={{ color: '#232530' }} variant="h5">Edit daily fat intake goal</DialogTitle>
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
        </DialogContent>
        
        <DialogActions>
          <div className='d-flex pb-4 flex-row justify-content-center w-100'>
          <Button onClick={handleClose}
          sx={{ 
            
            width: '40%',
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
          disableElevation 
          sx={{ 
              marginLeft: 1,
              backgroundColor: '#996BFF',
              width: '40%',
              '&:hover': {
              backgroundColor: '#8A60E6', // Custom hover background color
             }, 
          }} 
          variant="contained" 
          onClick={handleSave}>
            Save
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
    </React.Fragment>
  );
}