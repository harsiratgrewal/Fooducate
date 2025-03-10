import React, { useEffect, useState, useCallback } from "react";
import { collection, query, getDocs, doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { List, ListItem, ListItemText, Checkbox, Typography, Box, Grid, Card, CardContent, Collapse } from '@mui/material';
import { db, auth } from '../firebase/firebase';
import ListItemIcon from '@mui/material/ListItemIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SpaIcon from '@mui/icons-material/Spa';
import CelebrationIcon from '@mui/icons-material/Celebration';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const categories = [
  { name: 'Health', icon: <HealthAndSafetyIcon />, color: '#FF4500' },
  { name: 'Fitness', icon: <FitnessCenterIcon />, color: '#4EE6D1' },
  { name: 'Personal Development', icon: <PsychologyIcon />, color: '#FFF275' },
  { name: 'Wellbeing', icon: <SpaIcon />, color: '#E0479E' },
  { name: 'Fun & Recreational', icon: <CelebrationIcon />, color: '#8B61E8' },
  { name: 'Nutritional', icon: <RestaurantMenuIcon />, color: '#00BBF9' },
];

export default function ObjectiveCategories() {
  const [objectives, setObjectives] = useState([]);
  const [completedObjectives, setCompletedObjectives] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [userId, setUserId] = useState(null);

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

  const fetchObjectives = useCallback(async () => {
    if (!userId) return;

    try {
      const q = query(collection(db, `users/${userId}/objectives`));
      const querySnapshot = await getDocs(q);
      const objectivesArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const active = objectivesArray.filter(obj => !obj.completed);
      const completed = objectivesArray.filter(obj => obj.completed);
      setObjectives(active);
      setCompletedObjectives(completed);
    } catch (error) {
      console.error("Error fetching objectives: ", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchObjectives();
  }, [userId, fetchObjectives]);

  const handleCheckboxChange = async (objective) => {
    if (!userId) return;

    try {
      const objectiveDocRef = doc(db, 'users', userId, 'objectives', objective.id);
      await setDoc(objectiveDocRef, { completed: !objective.completed }, { merge: true });

      if (objective.completed) {
        setCompletedObjectives((prev) => prev.filter((obj) => obj.id !== objective.id));
        setObjectives((prev) => [...prev, { ...objective, completed: false }]);
      } else {
        setObjectives((prev) => prev.filter((obj) => obj.id !== objective.id));
        setCompletedObjectives((prev) => [...prev, { ...objective, completed: true }]);
      }
    } catch (error) {
      console.error('Error updating objective: ', error);
    }
  };

  const handleExpandClick = (category) => {
    setExpanded((prevExpanded) => ({ ...prevExpanded, [category]: !prevExpanded[category] }));
  };

  return (
    <Box sx={{mb: 2}}>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.name}>
            <Card elevation={0} sx={{ borderRadius: 3, backgroundColor: '#FEFEFF'}}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 1 }}>
                  {React.cloneElement(category.icon, { style: { color: category.color } })}
                  <Typography sx={{ fontSize: 21, marginLeft: 1 }} color="#232530">
                    {category.name}
                  </Typography>
                </Box>
                <List>
                  {objectives.filter(obj => obj.category === category.name).map(obj => (
                    <ListItem key={obj.id} disablePadding>
                      <ListItemIcon sx={{ minWidth: 0 }}>
                        <Checkbox
                          edge="start"
                          checked={obj.completed}
                          sx={{
                            '&.Mui-checked': {
                              color: '#996BFF',
                            },
                          }}
                          onChange={() => handleCheckboxChange(obj)}
                          inputProps={{ 'aria-labelledby': `checkbox-list-label-${obj.id}` }}
                        />
                      </ListItemIcon>
                      <Typography color="#232530" sx={{ fontSize: 18}}>{obj.name}</Typography>
                    </ListItem>
                  ))}
                </List>
                <Typography variant="body2" color="textSecondary" onClick={() => handleExpandClick(category.name)} sx={{ cursor: 'pointer' }}>
                  Completed ({completedObjectives.filter(obj => obj.category === category.name).length}) <ExpandMoreIcon />
                </Typography>
                <Collapse in={expanded[category.name]} timeout="auto" unmountOnExit>
                  <List>
                    {completedObjectives.filter(obj => obj.category === category.name).map(obj => (
                      <ListItem key={obj.id} disablePadding>
                        <ListItemIcon sx={{ minWidth: 0 }}>
                          <Checkbox
                            edge="start"
                            checked={obj.completed}
                            sx={{
                              '&.Mui-checked': {
                                color: '#996BFF',
                              },
                            }}
                            onChange={() => handleCheckboxChange(obj)}
                            inputProps={{ 'aria-labelledby': `checkbox-list-label-${obj.id}` }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={<Typography sx={{ textDecoration: 'line-through' }}>{obj.name}</Typography>} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}