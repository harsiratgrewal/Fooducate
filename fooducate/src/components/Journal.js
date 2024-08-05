import React, { useEffect, useState } from 'react';
import { Collapse, IconButton, Box, Card, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import AddJournalEntryDialog from './AddJournalEntryDialog';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase/firebase'; // Adjust the import based on your file structure
import { collection, getDocs } from 'firebase/firestore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function Journal() {
  const [user] = useAuthState(auth);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [expandedEntry, setExpandedEntry] = useState(null);

  useEffect(() => {
    const fetchJournalEntries = async () => {
      if (!user) return;

      try {
        const q = collection(db, 'users', user.uid, 'journal');
        const querySnapshot = await getDocs(q);
        const entriesArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJournalEntries(entriesArray);
      } catch (error) {
        console.error("Error fetching journal entries: ", error);
      }
    };

    fetchJournalEntries();
  }, [user, dialogOpen]); // Reload the journal entries when the dialog closes

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleExpandClick = (id) => {
    setExpandedEntry(expandedEntry === id ? null : id);
  };

  return (
    <Box>
      <Card elevation={0} sx={{ mb: 2, p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: 2 }}>
        <Typography variant="h5" color="#232530">
          Journal
        </Typography>
        <Button 
        variant="contained" 
        color="primary" 
        onClick={handleDialogOpen}
        disableElevation
        sx={{ 
            width: 80,
            '&:hover': {
            backgroundColor: '#6E4ABE', // Custom hover background color
            },
            bgcolor: "#996BFF",
            fontWeight: 'regular',
            fontSize: 15
            
        }}
        >
          Create
        </Button>
      </Card>
      <Card elevation={0} sx={{ mb: 2, p: 2, borderRadius: 3 }}>
      <List>
        {journalEntries.map((entry) => (
            <React.Fragment key={entry.id}>
          <ListItem key={entry.id}>
            <ListItemText
              primary={entry.entryName}
              secondary={new Date(entry.date).toLocaleDateString()}
            />
            <IconButton sx={{ width: 40 }} onClick={() => handleExpandClick(entry.id)}>
                {expandedEntry === entry.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
          </ListItem>
          <Collapse in={expandedEntry === entry.id} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.05)', borderRadius: 1 }}>
                <Typography variant="body1">{entry.entryContent}</Typography>
              </Box>
            </Collapse>
            </React.Fragment>
        ))}
      </List>
      </Card>
      <AddJournalEntryDialog open={dialogOpen} handleClose={handleDialogClose} />
    </Box>
  );
}