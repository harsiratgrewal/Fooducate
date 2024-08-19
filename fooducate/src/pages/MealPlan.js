import React from 'react'
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Grid';
// import Chatbot from '../components/Chatbot';
// import ChatHistory from '../components/ChatHistory';
// import AddMeal from '../components/AddMeal';
import MealPlanScheduler from '../components/MealPlanScheduler';

function MealPlan() {
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
        <Navbar/>
        <Box
            component="main"
            sx={{
                bgcolor: '#F0F3FF',
                height: '100vh',
                overflow: 'auto',
                width: '100%',
               
            }}
            >
                <MealPlanScheduler />
            </Box>
    </Box>
  )
}

export default MealPlan