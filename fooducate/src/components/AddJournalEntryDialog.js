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
      <DialogTitle>Add Journal Entry</DialogTitle>
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
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}