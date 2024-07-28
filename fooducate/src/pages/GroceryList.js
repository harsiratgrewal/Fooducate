import React from 'react'
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import FullGroceryList from '../components/FullGroceryList';
import Header from '../components/Header';
import CalculatedTotal from '../components/CalculatedTotal';

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
                    <Grid item xs={12}>
            <div className="row mt-1 g-2">
              <div className="col-12">
                  <div className="row mb-2">
                       <Header />
                   </div>
              </div>
              <div className="col-7">
            <Paper
              elevation={1}
              sx={{
                p: 2,
                display: 'flex',
                backgroundColor: "#FEFEFF",
                flexDirection: 'column',
                height: '100%',
                borderRadius: 5,
                  // Add this line
              }}
            >
              <FullGroceryList />
            </Paper>
            </div>
            <div className="col-5">
            <Paper
              elevation={1}
              sx={{
                p: 2,
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
            </div>
          </Grid>
          <Grid item xs={4} sx={{ paddingBottom: 0, paddingTop: 0 }}>
            <Paper
              elevation={2}
              sx={{
                
                display: 'flex',
                backgroundColor: "#FEFEFF",
                flexDirection: 'column',
                height: '100vh',
                padding: 0,
                overflow: 'auto'
                
                
              }}
            >
              
            </Paper>
          </Grid>
                </Grid>
            </Box>
    </Box>
  )
}

export default GroceryList