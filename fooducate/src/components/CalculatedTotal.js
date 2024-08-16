import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

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
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // Convert budgetGoal to a number
        const budget = parseFloat(docSnap.data().budgetGoal);
        setBudgetGoal(budget);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error fetching budget goal: ", error);
    }
  };

  const fetchGroceryItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, `users/${user.uid}/grocerylist`));
      const items = querySnapshot.docs.map(doc => doc.data());
      setGroceryItems(items);
      calculateTotalCost(items);
    } catch (error) {
      console.error("Error fetching grocery items: ", error);
    }
  };

  const calculateTotalCost = (items) => {
    const total = items.reduce((acc, item) => {
      const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
      return acc + itemTotal;
    }, 0);
    setTotalCost(total.toFixed(2)); // Round to 2 decimal places
  };

  const leftToSpendColor = (budgetGoal - totalCost) >= 0 ? 'rgba(11, 38, 136, 0.04)' : '#FFCDD2'; // Red color for overspending

  return (
      <><div className='d-flex pt-3 ps-3 pe-3 flex-row justify-content-between w-100'>
      <Typography variant="h5" color="#232530">
        Budget tracker
      </Typography>
      <Box sx={{ backgroundColor: leftToSpendColor, paddingLeft: 2, paddingRight: 2, borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" sx={{ paddingTop: 0.75 }} color="rgba(27, 29, 37, 0.63)">
          Left to spend
        </Typography>
        <Typography sx={{ paddingBottom: 0.75 }} fontSize={22} color="#232530">
          ${(budgetGoal - totalCost).toFixed(2)}
        </Typography>
      </Box>
    </div><svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="gradientColors" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="rgba(153, 107, 255, 0.50)" />
            <stop offset="50%" stopColor="rgba(196, 166, 252, 0.40)" />
            <stop offset="100%" stopColor='#EFE2FA' />
          </linearGradient>
        </defs>
      </svg><div className="w-100 d-flex flex-row align-items-baseline justify-content-center">
        <Gauge
          variant="determinate"
          value={(totalCost / budgetGoal) * 100}
          valueMax={budgetGoal}
          startAngle={-90}
          endAngle={90}
          width={450}
          height={200}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 40,
              fontWeight: 'medium',
              transform: 'translate(0px, -60px)',
              fontFamily: 'Roboto'
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: 'url(#gradientColors)',
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: 'rgba(231, 233, 243, 0.80)',
            },
          }}
          text={({ value }) => `${value.toFixed(2)}%`} />
      </div><div className='w-100 pb-3 d-flex flex-row align-items-center justify-content-between'>
        <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" color="rgba(27, 29, 37, 0.63)">
            Current grocery list total
          </Typography>
          <Typography variant="h5" color="#232530">
            ${totalCost}
          </Typography>
        </Box>
        <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" color="rgba(27, 29, 37, 0.63)">
            Maximum goal budget
          </Typography>
          <Typography variant="h5" color="#232530">
            ${budgetGoal.toFixed(2)}
          </Typography>
        </Box>
      </div></>
  );
};

export default CalculatedTotal;