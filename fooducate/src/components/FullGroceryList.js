import React, { useEffect, useState } from "react";
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { List, ListItem, ListItemText, Checkbox, Typography, Collapse, Button, Box } from '@mui/material';
import { db, auth } from '../firebase/firebase';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddGrocery from './AddGrocery';

export default function FullGroceryList() {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
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

  useEffect(() => {
    const fetchGroceryList = async () => {
      if (!userId) return;

      try {
        const q = query(collection(db, `users/${userId}/grocerylist`));
        const querySnapshot = await getDocs(q);
        const itemsArray = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name, quantity: doc.data().quantity, unit: doc.data().unit }));
        setItems(itemsArray);
      } catch (error) {
        console.error("Error fetching grocery list: ", error);
      }
    };

    fetchGroceryList();
  }, [userId]);

  const handleToggleCheck = (id) => () => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleExpand = (id) => () => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleYes = async (id) => {
    if (!userId) return;

    try {
      await deleteDoc(doc(db, `users/${userId}/grocerylist`, id));
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  const handleNo = (id) => {
    setExpanded((prevExpanded) => ({ ...prevExpanded, [id]: false }));
    setChecked((prevChecked) => ({ ...prevChecked, [id]: false }));
  };

  return (
    <React.Fragment>
      <div className="p-2 d-flex flex-row justify-content-between align-items-center">
        <Typography variant="h5" color="#232530">
          Grocery List
        </Typography>
        <AddGrocery />
      </div>
      <List>
        {items.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem sx={{paddingLeft: 1 }} onClick={handleToggleExpand(item.id)}>
              <ListItemIcon sx={{ minWidth: 35 }}>
                <Checkbox
                  edge="start"
                  checked={!!checked[item.id]}
                  sx={{
                    '&.Mui-checked': {
                      color: '#996BFF',
                    },
                    color: '#B7BAC5'
                  }}
                  onChange={handleToggleCheck(item.id)}
                  inputProps={{ 'aria-labelledby': `checkbox-list-label-${item.id}` }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ color: "#232530", paddingLeft: 0, fontSize: 20 }}>
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </Typography>
                }
              />
              <div className="d-flex flex-row">
                <Typography sx={{ fontSize: 18, marginRight: 1, color: "#232530" }}>{item.quantity}</Typography>
                <Typography sx={{ fontSize: 18, color: "#232530" }}>{item.unit}</Typography>
              </div>
            </ListItem>
            <Collapse in={expanded[item.id]} timeout="auto" unmountOnExit>
              <Box sx={{ marginTop: 1, marginBottom: 1 }}>
                <Typography sx={{ marginBottom: 1 }}>Did you purchase this?</Typography>
                <Button 
                variant="contained"
                disableElevation
                sx={{ 
                  backgroundColor: '#996BFF',
                  '&:hover': {
                    backgroundColor: '#8A60E6', // Custom hover background color
                  }, 
                }} 
                onClick={() => handleYes(item.id)}>
                  Yes
                </Button>
                <Button 
                variant="outlined" 
                onClick={() => handleNo(item.id)} 
                sx={{ 
                  marginLeft: 2,
                  borderColor: '#767676',
                  color: '#767676', 
                  '&:hover': {
                    backgroundColor: 'rgba(118, 118, 118, 0.15)', // Custom hover background color
                    borderColor: '#767676'
                  }, 
                }}>
                  No
                </Button>
              </Box>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </React.Fragment>
  );
}