import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Navbar from '../components/Navbar';
import Paper from '@mui/material/Paper';
import MealTargets from '../components/MealTargets';
import DailyNutrients from '../components/DailyNutrients';
import WeeklySuggestions from '../components/WeeklySuggestions';
import MonthlyNutrients from '../components/MonthlyNutrients';
import GroceryList from './GroceryList';

import GroceryListCard from '../components/GroceryListCard';

function Dashboard() {
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
                padding: 2
            }}
            >
                <Grid container spacing={1.5} columns={12}>
                    <Grid item xs={6}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                backgroundColor: "#FEFEFF",
                                flexDirection: 'column',
                                height: 300,
                                borderRadius: 4,
                                
                                }}
                                > 

                            <DailyNutrients/>         
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper
                            
                            sx={{
                                p: 2,
                                display: 'flex',
                                backgroundColor: "#FEFEFF",
                                flexDirection: 'column',
                                height: 300,
                                borderRadius: 4
                                }}
                                >
                            <WeeklySuggestions />          
                        </Paper>
                    </Grid>
                    
                        <Grid item xs={8}>
                            <Paper
                                
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    backgroundColor: "#FEFEFF",
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly',
                                    height: 150,
                                    borderRadius: 4
                                    }}
                                    >  
                                    <MealTargets />        
                            </Paper>
                            <Paper
                                
                                sx={{
                                    p: 2,
                                    marginTop: 1.5,
                                    display: 'flex',
                                    backgroundColor: "#FEFEFF",
                                    flexDirection: 'column',
                                    height: 450,
                                    borderRadius: 4
                                    }}
                                    > 
                                <MonthlyNutrients />         
                            </Paper>
                        </Grid>

                    <Grid item xs={4}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                backgroundColor: "#FEFEFF",
                                flexDirection: 'column',
                                height: '100%',
                                borderRadius: 4
                                }}
                                >      
                            <GroceryListCard />    
                        </Paper>
                    </Grid>
                </Grid>
            </Box>


       </Box>
    )
}

export default Dashboard
