import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Checkbox, Typography, Button, Card, CardContent, Collapse, Divider } from '@mui/material';
import { collection, query, getDocs, doc, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase/firebase';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

const MiniObjectives = () => {
  const [user] = useAuthState(auth);
  const [objectives, setObjectives] = useState([]);
  const [completedObjectives, setCompletedObjectives] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchObjectives(user.uid);
    }
  }, [user]);

  const fetchObjectives = async (uid) => {
    try {
      const q = query(collection(db, `users/${uid}/objectives`));
      const querySnapshot = await getDocs(q);
      const objectivesArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const active = objectivesArray.filter(obj => !obj.completed);
      const completed = objectivesArray.filter(obj => obj.completed);
      setObjectives(active.slice(0, 4)); // Display only the first 3 active objectives
      setCompletedObjectives(completed);
    } catch (error) {
      console.error("Error fetching objectives: ", error);
    }
  };

  const handleCheckboxChange = async (objective) => {
    if (!user) return;

    try {
      const objectiveDocRef = doc(db, 'users', user.uid, 'objectives', objective.id);
      await setDoc(objectiveDocRef, { completed: !objective.completed }, { merge: true });

      if (objective.completed) {
        setCompletedObjectives((prev) => prev.filter((obj) => obj.id !== objective.id));
        setObjectives((prev) => [...prev, { ...objective, completed: false }].slice(0, 4));
      } else {
        setObjectives((prev) => prev.filter((obj) => obj.id !== objective.id));
        setCompletedObjectives((prev) => [...prev, { ...objective, completed: true }]);
      }
    } catch (error) {
      console.error('Error updating objective: ', error);
    }
  };

  const handleViewAll = () => {
    navigate('/objectives'); // Navigate to the full objectives page
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card elevation={0} className="h-100" sx={{ height: '100%', backgroundColor: '#FEFEFF', padding: 0 }}>
      <CardContent className='p-0' sx={{ height: '45%'}}>
        <div className='w-100 d-flex flex-row mb-2 align-items-center justify-content-between'>
          <Typography variant="h5" color="#232530">
            Lifestyle balance objectives
          </Typography>
          <Button 
          variant="contained" 
          disableElevation
          onClick={handleViewAll} 
          sx={{ 
          width: 100, 
          height: 30,
          bgcolor: '#996BFF',
          '&:hover': {
               backgroundColor: '#8A60E6', // Custom hover background color
          },
         }}
          >
            View All
          </Button>
        </div>
          <List sx={{ paddingLeft: 0, height: '100%' }}>
            {objectives.map(obj => (
              <ListItem key={obj.id} sx={{ padding: 0 }}>
                <Checkbox
                  checked={obj.completed}
                  onChange={() => handleCheckboxChange(obj)}
                  sx={{
                    paddingLeft: 0.5,
                    '&.Mui-checked': {
                      color: '#996BFF',
                    },
                  }}
                />
                <ListItemText primary={obj.name} secondary={obj.category} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 'auto', maxHeight: '30vh', overflowY: 'auto' }}> {/* Ensures that the completed section stays at the bottom */}
            <Divider component="li" sx={{ my: 1 }} />
            <Typography variant="body2" color="textSecondary" onClick={handleExpandClick} sx={{ cursor: 'pointer', mt: 2 }}>
              Completed ({completedObjectives.length}) <ExpandMoreIcon />
            </Typography>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <List>
                {completedObjectives.map(obj => (
                  <ListItem key={obj.id} sx={{ padding: 0 }}>
                    <Checkbox
                      edge="start"
                      checked={obj.completed}
                      onChange={() => handleCheckboxChange(obj)}
                      sx={{
                  
                        '&.Mui-checked': {
                          color: '#996BFF',
                        },
                      }}
                    />
                    <ListItemText primary={<Typography sx={{ textDecoration: 'line-through' }}>{obj.name}</Typography>} secondary={obj.category} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
      </CardContent>
    </Card>
  );
};

export default MiniObjectives;