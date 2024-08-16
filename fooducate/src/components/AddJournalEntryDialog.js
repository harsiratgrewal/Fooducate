import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase/firebase'; // Adjust the import based on your file structure
import { collection, addDoc } from 'firebase/firestore';
import dayjs from 'dayjs';

export default function AddJournalEntryDialog({ open, handleClose }) {
  const [user] = useAuthState(auth);
  const [entryName, setEntryName] = useState('');
  const [entryContent, setEntryContent] = useState('');

  const handleSave = async () => {
    if (!user) {
      console.error('No user is logged in.');
      return;
    }

    const journalRef = collection(db, 'users', user.uid, 'journal');
    const date = dayjs().toISOString();

    const newEntry = {
      entryName,
      entryContent,
      date
    };

    try {
      await addDoc(journalRef, newEntry);
      handleClose();
      setEntryName('');
      setEntryContent('');
    } catch (error) {
      console.error('Error adding journal entry: ', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ color: '#232530' }} variant="h5">Add Journal Entry</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Entry Name"
          value={entryName}
          onChange={(e) => setEntryName(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Journal Entry"
          value={entryContent}
          onChange={(e) => setEntryContent(e.target.value)}
          multiline
          rows={4}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <div className='d-flex pb-4 flex-row justify-content-center w-100'>
        <Button 
        onClick={handleClose} 
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
          Cancel</Button>
        <Button onClick={handleSave} 
        variant='contained'
        disableElevation
         sx={{ 
              marginLeft: 1,
              backgroundColor: '#996BFF',
              width: '40%',
              '&:hover': {
              backgroundColor: '#8A60E6', // Custom hover background color
             }, 
          }} >
          Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}