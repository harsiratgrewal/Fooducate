import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, LinearProgress } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const CalculatedTotal = () => {
  const [user] = useAuthState(auth);
  const [groceryItems, setGroceryItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const goal = 100; // Example goal amount for weekly grocery spending

  useEffect(() => {
    if (user) {
      fetchGroceryItems();
    }
  }, [user]);

  const fetchGroceryItems = async () => {
    const querySnapshot = await getDocs(collection(db, `users/${user.uid}/grocerylist`));
    const items = querySnapshot.docs.map(doc => doc.data());
    setGroceryItems(items);
    calculateTotalCost(items);
  };

  const calculateTotalCost = (items) => {
    const total = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
    setTotalCost(total.toFixed(2));
  };

  return (
    <Card elevation={3} sx={{ padding: 2, borderRadius: 5 }}>
      <CardContent>
        <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium' }}>
          Total Cost
        </Typography>
        <Typography variant="h4" color="#494949" sx={{ fontWeight: 'bold', marginTop: 2 }}>
          ${totalCost}
        </Typography>
        <Typography variant="subtitle1" color="#494949" sx={{ marginTop: 1 }}>
          Goal: ${goal}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={(totalCost / goal) * 100} 
          sx={{ marginTop: 2, height: 10, borderRadius: 5 }}
        />
        <Typography variant="body2" color="#494949" sx={{ marginTop: 1 }}>
          {((totalCost / goal) * 100).toFixed(2)}% of goal reached
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CalculatedTotal;