import { Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import { auth, db, logout } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import EditDialog from './EditDialog';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { onAuthStateChanged } from 'firebase/auth';


export default function HealthGoals() {
  const [userInfo, setUserInfo] = useState({});
  const [user, loading, error] = useAuthState(auth);
  const [userId, setUserId] = useState(null);
  const [goals, setGoals] = useState([]);

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

  useEffect(() => {
    if (userId) {
      const fetchUserMealTargets = async () => {
        try {
          const docRef = doc(db, 'users', userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setGoals(data.goals);
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
  
  return (
    <React.Fragment>
        <React.Fragment>
            <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center" sx={{height: '25%' }}>
                <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium'}}>
                    Current Health Goals
                </Typography>
                <Button startIcon={<EditIcon />} disableElevation sx={{width: 100, bgcolor: "#996BFF"  }} size="small" variant="contained">Edit</Button>
            </Stack>

        <List>
            {goals.map(goal => 
                <ListItem>
                    <Typography>{goal}</Typography>
                </ListItem>
            )}
        </List>
            
            
        </React.Fragment>
    </React.Fragment>
  )
}

