import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import back from '../img/back.jpg';
import Chatbot from '../components/Chatbot';
import ChatHistory from '../components/ChatHistory';

function Nutrients() {
  const [sessionKey, setSessionKey] = useState(sessionStorage.getItem('sessionKey'));

  const loadSession = (key) => {
    const selectedSession = JSON.parse(localStorage.getItem(key));
    sessionStorage.setItem('currentSession', JSON.stringify(selectedSession));
    sessionStorage.setItem('sessionKey', key);
    setSessionKey(key);
  };

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
          height: '100vh',
          backgroundImage: `url(${back})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Grid container spacing={0} columns={12} sx={{ flexGrow: 1, height: '100%' }}>
          <Grid item xs={10} sx={{ height: '100%' }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                backgroundColor: 'rgba(255, 255, 255, 0.0)',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 0,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
                <Chatbot sessionKey={sessionKey} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={2} sx={{ height: '100%' }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 0,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 1 }}>
                <ChatHistory loadSession={loadSession} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Nutrients;
