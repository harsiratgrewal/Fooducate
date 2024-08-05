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
        const itemsArray = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name, quantity: doc.data().quantity }));
        setItems(itemsArray);
      } catch (error) {
        console.error("Error fetching grocery list: ", error);
      }
    };
    console.log(items);

    fetchGroceryList();
  }, [userId]);

  const handleToggle = (id) => () => {
    setChecked((prev) => {
      const newChecked = { ...prev, [id]: !prev[id] };
      if (newChecked[id]) {
        setExpanded((prevExpanded) => ({ ...prevExpanded, [id]: true }));
      } else {
        setExpanded((prevExpanded) => ({ ...prevExpanded, [id]: false }));
      }
      return newChecked;
    });
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
            {item && (
              <>
                <ListItem onClick={handleToggle(item.id)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={!!checked[item.id]}
                      sx={{
                        '&.Mui-checked': {
                          color: '#996BFF',
                        },
                      }}
                      onChange={handleToggle(item.id)}
                      inputProps={{ 'aria-labelledby': `checkbox-list-label-${item.id}` }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography sx={{ fontSize: 20 }}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Typography>
                      </React.Fragment>
                    }
                  />
                  <Typography sx={{ fontSize: 18 }}>{item.quantity}</Typography>
                </ListItem>
                <Collapse in={expanded[item.id]} timeout="auto" unmountOnExit>
                  <Box sx={{ marginLeft: 4, marginTop: 1, marginBottom: 1 }}>
                    <Typography>Did you purchase this?</Typography>
                    <Button variant="contained" color="primary" onClick={() => handleYes(item.id)}>Yes</Button>
                    <Button variant="outlined" color="secondary" onClick={() => handleNo(item.id)} sx={{ marginLeft: 2 }}>No</Button>
                  </Box>
                </Collapse>
              </>
            )}
          </React.Fragment>
        ))}
      </List>
    </React.Fragment>
  );
}