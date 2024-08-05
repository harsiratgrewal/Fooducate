import { Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'; // Adjust the import based on your file structure
import { useAuthState } from 'react-firebase-hooks/auth';
import dayjs from 'dayjs';

const categories = ['breakfast', 'lunch', 'dinner', 'snacks', 'sweets'];

const getStartOfWeek = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day; // adjust when day is sunday
  return new Date(date.setDate(diff));
};

const getEndOfWeek = (date) => {
  const day = date.getDay();
  const diff = date.getDate() + (6 - day); // adjust when day is sunday
  return new Date(date.setDate(diff));
};

export default function WeeklyNutrients() {
  const [user] = useAuthState(auth);
  const [weeklyMacronutrients, setWeeklyMacronutrients] = useState([
    { day: 'Sun', carbs: 0, proteins: 0, fats: 0 },
    { day: 'Mon', carbs: 0, proteins: 0, fats: 0 },
    { day: 'Tue', carbs: 0, proteins: 0, fats: 0 },
    { day: 'Wed', carbs: 0, proteins: 0, fats: 0 },
    { day: 'Thu', carbs: 0, proteins: 0, fats: 0 },
    { day: 'Fri', carbs: 0, proteins: 0, fats: 0 },
    { day: 'Sat', carbs: 0, proteins: 0, fats: 0 }
    
  ]);
  const [weekRange, setWeekRange] = useState("");

  useEffect(() => {
    if (user) {
      const today = new Date();
      const startOfWeek = getStartOfWeek(new Date(today));
      const endOfWeek = getEndOfWeek(new Date(today));
      setWeekRange(`${startOfWeek.toLocaleDateString('en-us', { weekday: 'long', month: 'long', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-us', { weekday: 'long', month: 'long', day: 'numeric' })}`);
      fetchWeeklyNutrients(user.uid);
    }
  }, [user]);

  const fetchWeeklyNutrients = async (uid) => {
    try {
      const startOfWeek = dayjs().startOf('week').toDate();
      const endOfWeek = dayjs().endOf('week').toDate();
      const q = query(collection(db, 'mealplans'), where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      const mealPlans = querySnapshot.docs.map(doc => doc.data()).filter(mealPlan => {
        const mealDate = new Date(mealPlan.date); // Convert to JavaScript Date object if stored as a string
        return mealDate >= startOfWeek && mealDate <= endOfWeek;
      });

      const recipeIdsByDay = {
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: []
      };

      mealPlans.forEach(mealPlan => {
        const day = dayjs(new Date(mealPlan.date)).format('ddd');
        recipeIdsByDay[day].push(mealPlan.recipeId);
      });

      const allRecipesByDay = {
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: []
      };

      for (const category of categories) {
        const categoryCollection = collection(db, category);
        const querySnapshot = await getDocs(categoryCollection);
        querySnapshot.docs.forEach((doc) => {
          for (const day in recipeIdsByDay) {
            if (recipeIdsByDay[day].includes(doc.id)) {
              allRecipesByDay[day].push(doc.data());
            }
          }
        });
      }

      const totalMacronutrientsByDay = {
        Mon: { carbs: 0, proteins: 0, fats: 0 },
        Tue: { carbs: 0, proteins: 0, fats: 0 },
        Wed: { carbs: 0, proteins: 0, fats: 0 },
        Thu: { carbs: 0, proteins: 0, fats: 0 },
        Fri: { carbs: 0, proteins: 0, fats: 0 },
        Sat: { carbs: 0, proteins: 0, fats: 0 },
        Sun: { carbs: 0, proteins: 0, fats: 0 }
      };

      for (const day in allRecipesByDay) {
        allRecipesByDay[day].forEach(recipe => {
          totalMacronutrientsByDay[day].carbs += recipe.nutrients.carbs;
          totalMacronutrientsByDay[day].proteins += recipe.nutrients.protein;
          totalMacronutrientsByDay[day].fats += recipe.nutrients.fat;
        });
      }

      setWeeklyMacronutrients([
        { day: 'Sun', ...totalMacronutrientsByDay.Sun },
        { day: 'Mon', ...totalMacronutrientsByDay.Mon },
        { day: 'Tue', ...totalMacronutrientsByDay.Tue },
        { day: 'Wed', ...totalMacronutrientsByDay.Wed },
        { day: 'Thu', ...totalMacronutrientsByDay.Thu },
        { day: 'Fri', ...totalMacronutrientsByDay.Fri },
        { day: 'Sat', ...totalMacronutrientsByDay.Sat }
      ]);
    } catch (error) {
      console.error("Error fetching weekly nutrients: ", error);
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h5" color="#232530">
        Weekly macronutrients
      </Typography>
      <Typography variant="100%" color="#232530">
        {weekRange}
      </Typography>
      <BarChart
        xAxis={[{ scaleType: 'band', data: weeklyMacronutrients.map(day => day.day), barGapRatio: 0.4, categoryGapRatio: 0.6 }]}
        series={[
          { data: weeklyMacronutrients.map(day => day.carbs), stack: 'A', label: 'Carbs', color: '#996BFF'  },
          { data: weeklyMacronutrients.map(day => day.proteins), stack: 'A', label: 'Proteins', color: '#39379C' },
          { data: weeklyMacronutrients.map(day => day.fats), stack: 'A', label: 'Fats', color: '#5D5AE6' },
        ]}
        borderRadius={30}
        slotProps={{
           bar: {
                borderRadius: 8,
            },
          legend: {
            direction: 'row',
            position: { vertical: 'top', horizontal: 'right' },
            padding: 0,
          }
        }}
      />
    </React.Fragment>
  );
}