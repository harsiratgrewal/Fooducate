import { Button, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from "react";
import { collection, query, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemButton from '@mui/material/ListItemButton';
import { db, auth } from '../firebase/firebase';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import UpdateMealImages from './UpdateMealImages';

export default function GroceryListCard() {

  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
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

  useEffect(() => {
    const fetchGroceryList = async () => {
      if (!userId) return;

      try {
        const q = query(collection(db, `users/${userId}/grocerylist`));
        const querySnapshot = await getDocs(q);
        const itemsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(itemsArray);
      } catch (error) {
        console.error("Error fetching grocery list: ", error);
      }
    };

    fetchGroceryList();
  }, [userId]);

  console.log(items);

  // Handle checkbox change
  const handleToggle = (name) => () => {
    setChecked((prev) => {
      const newChecked = { ...prev, [name]: !prev[name] };
      console.log(`Item ${name} checked: ${newChecked[name]}`);
      return newChecked;
    });
  };
  return (
    <React.Fragment>
        <React.Fragment>
            <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium'}}>
               Grocery List
            </Typography>
            <Button>Shop now</Button>
            <UpdateMealImages />
            <List>
      {items.map((item) => (
        <ListItem key={item.id} onClick={handleToggle(item.name)}>
          <ListItemText id={`checkbox-list-label-${item.id}`} primary={item.name.charAt(0).toUpperCase() + item.name.slice(1)} />
          <ListItemSecondaryAction>
            <Checkbox
              edge="end"
              checked={!!checked[item]}
              onChange={handleToggle(item)}
              inputProps={{ 'aria-labelledby': `checkbox-list-label-${item}` }}
            />
          </ListItemSecondaryAction>
          
        </ListItem>
      ))}
    </List>
        </React.Fragment>
    </React.Fragment>
  )
}