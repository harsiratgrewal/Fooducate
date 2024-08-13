import React from 'react';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import back from '../img/back.jpg';
import Chatbot from '../components/Chatbot';

function Nutrients() {
  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          bgcolor: '#F0F3FF',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',  // Ensure the main container takes the full height of the viewport
        }}
      >
        <Grid container spacing={2} columns={12} sx={{ flexGrow: 1, height: '100%' }}>
          <Grid item xs={12} sx={{ height: '100%' }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                backgroundColor: "#FCFCFD",
                backgroundImage: `url(${back})`,
                flexDirection: 'column',
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
                <Chatbot />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Nutrients;
