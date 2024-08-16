import { Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'; // Adjust the import based on your file structure
import { useAuthState } from 'react-firebase-hooks/auth';

const categories = ['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'];

export default function DailyNutrients() {
  const [user] = useAuthState(auth);
  const [macronutrients, setMacronutrients] = useState({ carbs: 0, proteins: 0, fats: 0 });

  useEffect(() => {
    if (user) {
      fetchDailyNutrients(user.uid);
    }
  }, [user]);

  const fetchDailyNutrients = async (uid) => {
    try {
      const todayDateString = new Date().toDateString(); // Get today's date as a string
      const q = query(collection(db, 'mealplans'), where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      const mealPlans = querySnapshot.docs.map(doc => doc.data()).filter(mealPlan => {
        const mealDate = new Date(mealPlan.date); // Convert Firestore timestamp to Date
        return mealDate.toDateString() === todayDateString; // Compare dates as strings
      });
 

      const recipeIds = mealPlans.map(mealPlan => mealPlan.recipeId);
      const allRecipes = [];

      for (const category of categories) {
        const categoryCollection = collection(db, category);
        const querySnapshot = await getDocs(categoryCollection);
        querySnapshot.docs.forEach((doc) => {
          if (recipeIds.includes(doc.id)) {
            allRecipes.push(doc.data());
          }
        });
      }


      const totalMacronutrients = allRecipes.reduce((acc, recipe) => {
        acc.carbs += recipe.nutrients.carbs;
        acc.proteins += recipe.nutrients.protein;
        acc.fats += recipe.nutrients.fat;
        return acc;
      }, { carbs: 0, proteins: 0, fats: 0 });


      setMacronutrients(totalMacronutrients);
    } catch (error) {
      console.error("Error fetching daily nutrients: ", error);
    }
  };

  const todayString = new Date().toLocaleDateString('en-us', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  

  return (
    <React.Fragment>
      <Typography variant="h5" color="#232530">
        Today's macronutrients
      </Typography>
      <Typography variant="subtitle1" color="#232530">
        {todayString}
      </Typography>
      <div className='w-100 p-0 mt-0 d-flex flex-row justify-content-center'>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: macronutrients.carbs, label: 'Carbs', color: '#996BFF' },
              { id: 1, value: macronutrients.proteins, label: 'Proteins', color: '#39379C' },
              { id: 2, value: macronutrients.fats, label: 'Fats', color: '#5D5AE6' },
            ],
            outerRadius: 115,
            innerRadius: 75,
            cornerRadius: 5,
            cx: 125,
            arcLabel: (item) => `${item.value}g`,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            
          },
        ]}
        margin={{ left: 0 }}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: 'white',
            
          },
        }}
        height={350}
        slotProps={{
          legend: {
            direction: 'column',
            position: { vertical: 'middle', horizontal: 'right' },
            padding: 3,
            itemGap: 25
          },
        }}
      />
      </div>
    </React.Fragment>
  );
}