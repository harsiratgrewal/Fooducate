import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Paper, IconButton, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
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
          messages: [{ role: 'user', content: `Give a 2-3 line brief nutritional breakdown (just include one line of names/quantities, total calories, and then a very brief benefit) for the following items: ${description}` }],
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
          border: '0px solid #6a1b9a',
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
            backgroundColor: '#6a1b9a',
            borderRadius: '10px 10px 0 0',
            p: 2,
            m: 0,
          }}
        >
          <SmartToyIcon sx={{ fontSize: 40, color: '#fff', mr: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff', m: 0 }}>
            Nutritional Helper
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, backgroundColor: 'rgba(255, 255, 255, 0.0)'}}>
          {messages.map((msg, index) => (
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
                <SmartToyIcon sx={{ fontSize: 20, color: '#6a1b9a', mr: 1 }} />
              )}
              <Paper
                sx={{
                  p: 1,
                  backgroundColor: msg.type === 'user' ? '#f3e5f5' : '#fff',
                  maxWidth: '60%',
                  borderRadius: '10px',
                  border: '1px solid #6a1b9a',
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
                <AccountBoxIcon sx={{ fontSize: 20, color: '#6a1b9a', ml: 1 }} />
              )}
            </Box>
          ))}
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 1,
          borderTop: '1px solid #6a1b9a',
          m: 0,
          backgroundColor: '#6a1b9a', // Light purple background
          borderRadius: '0 0 10px 10px', // Rounded bottom corners
        }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Type your message here..."
            value={message}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevents the default action (like form submission)
                handleSendMessage(); // Triggers the send message function
              }
            }}
            sx={{ 
              borderRadius: '0',
              backgroundColor: '#6a1b9a',
              '& .MuiInputBase-input': {
                padding: '10px',
                color: '#fff',
                fontSize: '16px', // Increase font size
                fontWeight: 'bold', // Make the input text bold
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
                color: '#fff', // Make the placeholder text white
                opacity: 1, // Ensure the placeholder is fully visible
              },
              '& .MuiInputBase-input:focus::placeholder': {
                opacity: 0, // Hide the placeholder on focus (when the text field is clicked)
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
