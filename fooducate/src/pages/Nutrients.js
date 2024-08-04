import React from 'react';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Chatbot from '../components/Chatbot';
import ChatHistory from '../components/ChatHistory';
import UpdateMealImages from '../components/UpdateMealImages';

function Nutrients() {
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          bgcolor: '#F0F3FF',
          height: '100vh',
          overflow: 'auto',
          width: '100%',
        }}
      >
        <Grid container sx={{ paddingLeft: 1.5 }} spacing={1.5} columns={12}>
          <Grid item xs={8}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                backgroundColor: "#FCFCFD",
                flexDirection: 'column',
                height: '100%',
                borderRadius: 4,
              }}
            >
              <Chatbot />
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                backgroundColor: "#FCFCFD",
                flexDirection: 'column',
                height: '100vh',
                borderRadius: 4,
              }}
            >
              <ChatHistory />
            </Paper>
          </Grid>
        </Grid>
        <Grid container sx={{ paddingLeft: 1.5, paddingTop: 1.5 }} spacing={1.5} columns={12}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                backgroundColor: "#FCFCFD",
                flexDirection: 'column',
                borderRadius: 4,
              }}
            >
              <UpdateMealImages />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Nutrients;











/*import React from 'react'
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Chatbot from '../components/Chatbot';
import ChatHistory from '../components/ChatHistory';
import UpdateMealImages from '../components/UpdateMealImages';

function Nutrients() {
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
        <Navbar />
            <Box
            component="main"
            sx={{
                bgcolor: '#F0F3FF',
                height: '100vh',
                overflow: 'auto',
                width: '100%',
               
            }}
            >
                <Grid container sx={{ paddingLeft: 1.5 }} spacing={1.5} columns={12}>
                    <Grid item xs={8}>
                        <Paper
                            
                            sx={{
                                p: 2,
                                display: 'flex',
                                backgroundColor: "#FCFCFD",
                                flexDirection: 'column',
                                height: '100%',
                                borderRadius: 4
                                }}
                                >
                            <Chatbot />       
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
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
                            <ChatHistory />      
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            </Box>

  )
}

export default Nutrients*/