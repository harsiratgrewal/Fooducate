import React from 'react'
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import FullGroceryList from '../components/FullGroceryList';
import Header from '../components/Header';
import CalculatedTotal from '../components/CalculatedTotal';
import SearchMeals from '../components/SearchMeals';
import FavoritedMealsCard from '../components/FavoritedMealsCard';

function GroceryList() {
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
            <Grid container sx={{ paddingLeft: 1.5 }} spacing={1.5} columns={16}>
                <Grid item xs={11} sx={{ paddingBottom: 0, height: '100%' }}>
                    <div className="row mt-1 g-2">
                    <div className="col-12">
                        <div className="row mb-2">
                            <Header />
                        </div>
                    </div>
                        <div className="col-5 h-100vh">
                          <div style={{height: '100%'}}>
                        
                        <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            display: 'flex',
                            backgroundColor: "#FEFEFF",
                            flexDirection: 'column',
                            height: '100%',
                            borderRadius: 5,
                        }}
                        >
                        <FullGroceryList />
                        </Paper>
                        </div>
                        
                        </div>
                        <div className="col-7 d-flex justify-content-between h-100vh flex-column">
                            <div style={{height: '100%'}}>
                            <Paper
                            elevation={0}
                            sx={{
                                p: 1,
                                display: 'flex',
                                backgroundColor: "#FEFEFF",
                                flexDirection: 'column',
                                height: '100%',
                                borderRadius: 3,
                                // Add this line
                            }}
                            >
                            <CalculatedTotal />
                            </Paper>
                            </div>
                        
                            <div style={{height: '100%'}}>
                            <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                display: 'flex',
                                backgroundColor: "#FEFEFF",
                                flexDirection: 'column',
                                height: '100%',
                                borderRadius: 3,
                                marginTop: 2
                                // Add this line
                            }}
                            >
                            <FavoritedMealsCard />
                            </Paper>
                            </div>
                        
                        </div>
                        </div>
          </Grid>
          <Grid item xs={5} sx={{ paddingBottom: 0, paddingTop: 0 }}>
            <Paper
              elevation={0}
              sx={{
                
                display: 'flex',
                backgroundColor: "#FEFEFF",
                flexDirection: 'column',
                height: '100%',
                padding: 0.75,
                overflow: 'auto'
                
                
              }}
            >
                <SearchMeals />
              
            </Paper>
          </Grid>
                </Grid>
            </Box>
    </Box>
  )
}

export default GroceryList