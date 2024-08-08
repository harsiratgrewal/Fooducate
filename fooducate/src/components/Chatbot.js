import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Paper, Grid, IconButton, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from 'axios';

const KEY = process.env.REACT_APP_API_KEY;

export default function Chatbot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const [error, setError] = useState('');
  const handleImageUpload = async (e) => {

    const imageFile = e.target.files[0];
    if (!imageFile.type.startsWith('image/')) {
      setError('The selected file is not an image. Please upload an image file.');
      return;
    }
    if (imageFile) {
      const newMessage = { text: null, image: URL.createObjectURL(imageFile), type: 'user' };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      const description = await analyzeImageWithBackend(imageFile);
      if (description) {
        const nutritionalInfo = await getNutritionalInfo(description);
        if (nutritionalInfo) {
          const aiResponse = { text: nutritionalInfo, type: 'ai' };
          setMessages(prevMessages => [...prevMessages, aiResponse]);
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
          messages: [{ role: 'user', content: `Give a 2-3 line brief nutritional breakdown (just include one line of names/quantities, total calories, and then a very brief benefit) of the following items: ${description}` }],
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
      const info = formatDescription(response.data.choices[0].message.content);
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

    try {
      console.log("Sending message to OpenAI API...");
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
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
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Scroll to the bottom of the chat container when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const formatDescription = (description) => {
    const parts = description.split('###').filter(part => part.trim() !== '');
  
    return parts.map((part, index) => {
      const lines = part.trim().split('\n').filter(line => line.trim() !== '');

      let title = lines[0];
      title = title.replace(/\*\*/g, '');

      const details = lines.slice(1).map((line, index) => (
        <li key={index}>{line.replace(/\*\*/g, '').trim()}</li>
      ));
  
      return (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h3>{title}</h3>
          <ul>
            {details}
          </ul>
        </div>
      );
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff' }} ref={chatContainerRef}>
        <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium' }}>
          AI Nutritional Helper
        </Typography>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Paper
              sx={{
                p: 1,
                m: 1,
                backgroundColor: msg.type === 'user' ? '#e0f7fa' : '#f5f5f5',
                maxWidth: '60%',
                borderRadius: '10px',
                border: '1px solid #ddd',
              }}
            >
              {msg.image ? (
                <img src={msg.image} alt="uploaded" style={{ maxWidth: '100%', borderRadius: '10px' }} />
              ) : (
                <Typography variant="body1">{msg.text}</Typography>
              )}
            </Paper>
          </Box>
        ))}
      </Box>
      <Paper sx={{ p: 2, mt: 2, borderRadius: '10px', border: '1px solid #ddd' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message"
              value={message}
              onChange={handleInputChange}
              sx={{ borderRadius: '10px' }}
            />
          </Grid>
          <Grid item>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-button-file"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="upload-button-file">
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              endIcon={<SendIcon />}
              sx={{ borderRadius: '10px' }}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
