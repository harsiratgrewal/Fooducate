import React, { useState } from 'react';
import { Typography, Card, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Box } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase/firebase'; // Adjust the import based on your file structure
import { collection, addDoc } from 'firebase/firestore';


const categories = ['Health', 'Fitness', 'Personal Development', 'Wellbeing', 'Fun & Recreational', 'Nutritional'];

export default function AddObjective() {
  const [user] = useAuthState(auth);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [objectiveName, setObjectiveName] = useState('');
  const [category, setCategory] = useState('');

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setObjectiveName('');
    setCategory('');
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
            textTransform: 'none'
        }}>
          Add
        </Button>
      </Card>

      <Dialog maxWidth="xs" fullWidth open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle variant="h5" color="#232530">Add New Objective</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Objective Name"
            value={objectiveName}
            onChange={(e) => setObjectiveName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ mt: 3 }}
          >
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ paddingBottom: 2}}>
          <Button 
          onClick={handleDialogClose}
          variant="outlined"
          sx={{ 
            '&:hover': {
            borderColor: '#6E4ABE', // Custom hover background color
            },
            borderColor: "#9A9DAC",
            color: "#666771"
            
        }}
          >
            Cancel
          </Button>
          <Button 
          variant="contained" 
          sx={{ 
            '&:hover': {
            backgroundColor: '#6E4ABE', // Custom hover background color
            },
            bgcolor: "#996BFF",
            
        }}
          onClick={handleCreateObjective}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}