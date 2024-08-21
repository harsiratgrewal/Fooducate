import React, { useState } from 'react';
import { Typography, Snackbar, Alert, Divider, Card, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Box } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase/firebase'; // Adjust the import based on your file structure
import { collection, addDoc } from 'firebase/firestore';
import { styled } from '@mui/system';
import CheckIcon from '@mui/icons-material/Check';

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
      borderRadius: 8
    },
    '&:hover fieldset': {
      borderColor: '#996BFF', // Border color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#996BFF', // Border color when focused
    },
  },
}));


const categories = ['Health', 'Fitness', 'Personal Development', 'Wellbeing', 'Fun & Recreational', 'Nutritional'];

export default function AddObjective({ onObjectiveAdded }) {
  const [user] = useAuthState(auth);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [objectiveName, setObjectiveName] = useState('');
  const [category, setCategory] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setObjectiveName('');
    setCategory('');
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleCreateObjective = async () => {
    if (!user) {
      console.error('No user is logged in.');
      return;
    }

    const userObjectivesRef = collection(db, 'users', user.uid, 'objectives');

    try {
      const objective = {
        name: objectiveName,
        category,
        completed: false
      };

      await addDoc(userObjectivesRef, objective);

      // Notify the parent component that a new objective has been added
      if (onObjectiveAdded) {
        onObjectiveAdded();
      }

      setAlertMessage('Objective created');
      setAlertOpen(true);
      handleDialogClose();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Card elevation={0} sx={{ mt: 1, pb: 0, p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: 2 }}>
        <Typography variant="h5" color="#232530">
          Lifestyle Balance Objectives
        </Typography>
        <Button 
          disableElevation 
          variant="contained" 
          color="primary" 
          onClick={handleDialogOpen} 
          sx={{ 
            width: 40,
            '&:hover': {
              backgroundColor: '#6E4ABE', // Custom hover background color
            },
            bgcolor: "#996BFF",
            fontWeight: 'regular',
            fontSize: 15,
          }}>
          Add
        </Button>
      </Card>

      <Dialog maxWidth="xs" fullWidth open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle variant="h5" color="#232530">Add a new objective</DialogTitle>
        <Divider sx={{ borderColor: '#B0B2BA', borderWidth: 1.5  }} flexItem />
        <DialogContent>
          <CustomTextField
            fullWidth
            label="Objective Name"
            value={objectiveName}
            onChange={(e) => setObjectiveName(e.target.value)}
          />
          <CustomTextField
            fullWidth
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ mt: 2 }}
          >
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </CustomTextField>
        </DialogContent>
        <DialogActions sx={{ paddingBottom: 2}}>
          <div className='d-flex pb-4 flex-row justify-content-center w-100'>
            <Button 
              onClick={handleDialogClose}
              variant="outlined"
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
              variant="contained" 
              disableElevation
              sx={{ 
                marginLeft: 1,
                backgroundColor: '#996BFF',
                width: '40%',
                '&:hover': {
                  backgroundColor: '#8A60E6', // Custom hover background color
                }, 
              }}
              onClick={handleCreateObjective}>
              Create
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
    </Box>
  );
}