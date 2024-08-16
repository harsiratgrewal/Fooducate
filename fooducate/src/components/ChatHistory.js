import { Stack, Typography, Paper, Button, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ChatHistory({ loadSession }) {
  const [chatSessions, setChatSessions] = useState([]);

  useEffect(() => {
    const sessionKeys = Object.keys(localStorage).filter(key => key.startsWith('session-'));
    const sessions = sessionKeys.map(key => {
      const [date, time] = key.replace('session-', '').split(' ');
      return { date, time, key };
    });
    setChatSessions(sessions);
  }, []);

  const handleNewSession = () => {
    const newSessionKey = `session-${new Date().toLocaleString()}`;
    sessionStorage.setItem('sessionKey', newSessionKey);
    sessionStorage.setItem('currentSession', JSON.stringify([]));
    localStorage.setItem(newSessionKey, JSON.stringify([]));

    loadSession(newSessionKey);
    setChatSessions(prevSessions => [...prevSessions, { date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString(), key: newSessionKey }]);
  };

  const handleDeleteSession = (sessionKey) => {
    localStorage.removeItem(sessionKey);
    setChatSessions(prevSessions => prevSessions.filter(session => session.key !== sessionKey));
  };

  return (
    <React.Fragment>
      <Typography
        variant="h5"
        color="#4B0082"
        sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}
      >
        Chat History
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNewSession}
        fullWidth
        sx={{ mb: 2, backgroundColor: '#996BFF', '&:hover': { backgroundColor: '#7D5BD2' } }}
      >
        New Session
      </Button>
      <Typography
        variant="subtitle1"
        color="#757575"
        sx={{ mb: 2, fontSize: '1rem', fontWeight: 'bold' }}
      >
        Previous Sessions
      </Typography>
      
      <Stack spacing={1}>
        {chatSessions.map((session, index) => (
          <Paper
          key={index}
          sx={{
            p: 1,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: '#E0BBE4',
            width: '100%',
            maxWidth: '350px',
            '&:hover': {
              backgroundColor: '#DDA0DD',
            },
          }}
          onClick={() => loadSession(session.key)}
        >
          <Typography
            variant="body2"
            color="#FF00FF"
            sx={{ fontSize: '0.950rem', flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {session.date} - {session.time}
          </Typography>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSession(session.key);
            }}
            sx={{
              color: '#FF00FF',
              padding: '0',
              width: "16px",
              minHeight: '16px',
              '& .MuiSvgIcon-root': {
                fontSize: '20x',
              },
            }}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Paper>
        ))}
      </Stack>
    </React.Fragment>
  );
}