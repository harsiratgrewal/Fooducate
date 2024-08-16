import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Paper, IconButton, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from 'axios';

const KEY = process.env.REACT_APP_API_KEY;

export default function Chatbot({ sessionKey }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const savedMessages = JSON.parse(sessionStorage.getItem('currentSession')) || [];
    setMessages(savedMessages);
  }, [sessionKey]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const [error, setError] = useState('');
  const handleImageUpload = async (e) => {

    const imageFile = e.target.files[0];
    if (!imageFile){
      return;
    }
    if (!imageFile.type.startsWith('image/')) {
      setError('The selected file is not an image. Please upload an image file.');
      return;
    }
    if (imageFile) {
      const newMessage = { text: null, image: URL.createObjectURL(imageFile), type: 'user' };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      let sessionKey = sessionStorage.getItem('sessionKey');
      if (!sessionKey) {
          sessionKey = `session-${new Date().toLocaleString()}`;
          sessionStorage.setItem('sessionKey', sessionKey);
          localStorage.setItem(sessionKey, JSON.stringify([]));
      }

      const currentSession = JSON.parse(sessionStorage.getItem('currentSession')) || [];
      const updatedSession = [...currentSession, newMessage];
      sessionStorage.setItem('currentSession', JSON.stringify(updatedSession));

      const localStorageSession = JSON.parse(localStorage.getItem(sessionKey)) || [];
      const updatedLocalStorageSession = [...localStorageSession, newMessage];
      localStorage.setItem(sessionKey, JSON.stringify(updatedLocalStorageSession));

      const description = await analyzeImageWithBackend(imageFile);
      if (description) {
        const nutritionalInfo = await getNutritionalInfo(description);
        if (nutritionalInfo) {

          const aiResponse = { text: nutritionalInfo, type: 'ai' };
          setMessages(prevMessages => [...prevMessages, aiResponse]);
          const finalSession = [...updatedSession, aiResponse];
          sessionStorage.setItem('currentSession', JSON.stringify(finalSession));

          const finalLocalStorageSession = [...updatedLocalStorageSession, aiResponse];
          localStorage.setItem(sessionKey, JSON.stringify(finalLocalStorageSession));
        }
      }
    }
    return (
      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  };
  
  const analyzeImageWithBackend = async (imageFile) => {
    
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        try {
          const response = await axios.post('http://localhost:5000/analyze-image', { base64Image });
          console.log(response);
          if (response.data.description) {
            const description = response.data.description;
            resolve(description);
          }} catch (error) {
            console.error('Error analyzing image: ', error);
            reject(error);
          }
        };
      reader.onerror = (error) => {
        console.error('Error reading file: ', error);
        setError('Error reading file');
      };
    });
  };
  
  const getNutritionalInfo = async (description) => {
    try {
      console.log(`Getting nutritional info for: ${description}`);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: `Give a 2-3 line brief nutritional breakdown (no headings or sub headings) (just include one line of names/quantities, total calories, and then a very brief benefit) for the following items: ${description}
            Use this format: 
            Quantity Name (Calories cal), Quantity Name (Calories). Total calories ~ (Amount) cal. Overall Benefit` }],
          max_tokens: 1000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${KEY}`,
          },
        }
      );

      console.log("OpenAI API response:", response.data);
      const info = response.data.choices[0].message.content;
      return info;
    } catch (error) {
      console.error('Error getting nutritional info: ', error);
      return null;
    }
  };
 
  const handleSendMessage = async () => {
    if (!message) return;
    const newMessage = { text: message, type: 'user' };
    setMessages([...messages, newMessage]);
    setMessage('');
    let sessionKey = sessionStorage.getItem('sessionKey');
    if (!sessionKey) {
        sessionKey = `session-${new Date().toLocaleString()}`;
        sessionStorage.setItem('sessionKey', sessionKey);
        localStorage.setItem(sessionKey, JSON.stringify([]));
    }

    const currentSession = JSON.parse(sessionStorage.getItem('currentSession')) || [];
    const updatedSession = [...currentSession, newMessage];
    sessionStorage.setItem('currentSession', JSON.stringify(updatedSession));

    const localStorageSession = JSON.parse(localStorage.getItem(sessionKey)) || [];
    const updatedLocalStorageSession = [...localStorageSession, newMessage];
    localStorage.setItem(sessionKey, JSON.stringify(updatedLocalStorageSession));

    try {
      console.log("Sending message to OpenAI API...");
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `I am passing your chat history here- ${JSON.stringify(updatedSession)} (if history is empty ignore this line) (don't mention about the history in response just use it). This is the current query (don't mention about the query just take it) (Just answer the question): ${message}`}],
        max_tokens: 500,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KEY}`,
        },
      });

      console.log("OpenAI API response:", response.data);
      const aiResponse = { text: response.data.choices[0].message.content.trim(), type: 'ai' };
      setMessages(prevMessages => [...prevMessages, aiResponse]);

      const finalSession = [...updatedSession, aiResponse];
      sessionStorage.setItem('currentSession', JSON.stringify(finalSession));

      const finalLocalStorageSession = [...updatedLocalStorageSession, aiResponse];
      localStorage.setItem(sessionKey, JSON.stringify(finalLocalStorageSession));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      width: '100%',
      p: 2 
    }}>
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'hidden', 
          borderRadius: '15px', 
          border: '0px solid #996BFF',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'space-between'
        }} 
        ref={chatContainerRef}
      >
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#996BFF',
            borderRadius: '10px 10px 0 0',
            p: 2,
            m: 0,
          }}
        >
          <SmartToyIcon sx={{ fontSize: 40, color: '#fff', mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff', m: 0, fontSize: '28px' }}>
            Nutritional Helper
          </Typography>
        </Box>
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: 2, 
            backgroundColor: 'rgba(255, 255, 255, 0.0)' 
          }}
        >
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1,
                  alignItems: 'center'
                }}
              >
                {msg.type !== 'user' && (
                  <SmartToyIcon sx={{ fontSize: 20, color: '#996BFF', mr: 1 }} />
                )}
                <Paper
                  sx={{
                    p: 1,
                    backgroundColor: msg.type === 'user' ? '#f3e5f5' : '#fff',
                    maxWidth: '60%',
                    borderRadius: '10px',
                    border: '1px solid #996BFF',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column'
                  }}
                >
                  {msg.image && (
                    <img 
                      src={msg.image} 
                      alt="uploaded" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '150px',
                        borderRadius: '10px', 
                        marginBottom: '8px' 
                      }} 
                    />
                  )}
                  <Typography  
                    component="span"
                    style={{ 
                      fontSize: '16px',
                      lineHeight: '1.2',
                      margin: 0,
                      padding: 0
                    }}>
                    {msg.text}
                  </Typography>
                </Paper>
                {msg.type === 'user' && (
                  <AccountBoxIcon sx={{ fontSize: 20, color: '#996BFF', ml: 1 }} />
                )}
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ fontWeight: 'bold', fontSize: '24px' }}>
              Hello! I am your AI Nutritional Chatbot. Please type a message to start the conversation!
            </Typography>
          )}
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 1,
          borderTop: '1px solid #996BFF',
          m: 0,
          backgroundColor: '#996BFF',
          borderRadius: '0 0 10px 10px',
        }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Type your message here..."
            value={message}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            sx={{ 
              borderRadius: '0',
              backgroundColor: '#996BFF',
              '& .MuiInputBase-input': {
                padding: '10px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                caretColor: '#fff', 
              },
              '& .MuiInput-underline:before': {
                borderBottom: 'none',
              },
              '& .MuiInput-underline:after': {
                borderBottom: 'none',
              },
              '& .MuiInput-underline:hover:before': {
                borderBottom: 'none',
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#fff', 
                opacity: 1,
              },
              '& .MuiInputBase-input:focus::placeholder': {
                opacity: 0,
              },
              
            }}
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <React.Fragment>
                  <IconButton color="primary" aria-label="send message" component="span" onClick={handleSendMessage} sx={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
                    <SendIcon />
                  </IconButton>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-button-file"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="upload-button-file">
                    <IconButton color="primary" aria-label="upload picture" component="span" sx={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </React.Fragment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
