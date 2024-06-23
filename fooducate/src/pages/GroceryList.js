import React from 'react'
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import FullGroceryList from '../components/FullGroceryList';

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
                padding: 2
            }}
            >
                <Grid container spacing={1.5} columns={12}>
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                backgroundColor: "#FCFCFD",
                                flexDirection: 'column',
                                height: '100vh',
                                borderRadius: 4
                                }}
                                > 
                            <FullGroceryList />        
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
    </Box>
  )
}

export default GroceryList