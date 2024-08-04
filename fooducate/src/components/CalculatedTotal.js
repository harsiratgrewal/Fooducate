import React, { useState, useEffect } from 'react';
import { CardContent, Typography, LinearProgress } from '@mui/material';
import { collection, getDocs, doc, getDoc  } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const CalculatedTotal = () => {
  const [user] = useAuthState(auth);
  const [groceryItems, setGroceryItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [budgetGoal, setBudgetGoal] = useState(0);

  useEffect(() => {
    if (user) {
      fetchGroceryItems();
      fetchBudgetGoal();
    }
  }, [user]);

  const fetchBudgetGoal = async () => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setBudgetGoal(docSnap.data().budgetGoal);
    } else {
      console.error("No such document!");
    }
  };

  const fetchGroceryItems = async () => {
    const querySnapshot = await getDocs(collection(db, `users/${user.uid}/grocerylist`));
    const items = querySnapshot.docs.map(doc => doc.data());
    setGroceryItems(items);
    calculateTotalCost(items);
    console.log(items);
  };

   const calculateTotalCost = (items) => {
    const total = items.reduce((acc, item) => {
      const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
      return acc + itemTotal;
    }, 0);
    setTotalCost(total.toFixed(2)); // Round to 2 decimal places
  };

  return (
      <CardContent>
        <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium' }}>
          Total Cost
        </Typography>
        <Typography variant="h4" color="#494949" sx={{ fontWeight: 'bold', marginTop: 2 }}>
          ${totalCost}
        </Typography>
        <Typography variant="subtitle1" color="#494949" sx={{ marginTop: 1 }}>
          Goal: ${budgetGoal}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={(totalCost / budgetGoal) * 100} 
          sx={{ marginTop: 2, height: 10, borderRadius: 5 }}
        />
        <Typography variant="body2" color="#494949" sx={{ marginTop: 1 }}>
          {((totalCost / budgetGoal) * 100).toFixed(2)}% of goal reached
        </Typography>
      </CardContent>
  );
};

export default CalculatedTotal;