import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Paper, Grid, IconButton, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from 'axios';

const PAT = process.env.REACT_APP_CLARIFAI_PAT;
const USER_ID = process.env.REACT_APP_CLARIFAI_USER_ID;
const APP_ID = process.env.REACT_APP_CLARIFAI_APP_ID;
const MODEL_ID = process.env.REACT_APP_CLARIFAI_MODEL_ID;
const MODEL_VERSION_ID = process.env.REACT_APP_CLARIFAI_MODEL_VERSION_ID;

export default function Chatbot() {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newMessage = { text: null, image: URL.createObjectURL(file), type: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    const description = await analyzeImage(file);
    if (description) {
      const nutritionalInfo = await getNutritionalInfo(description);
      if (nutritionalInfo) {
        const aiResponse = { text: nutritionalInfo, type: 'ai' };
        setMessages(prevMessages => [...prevMessages, aiResponse]);
      }
    }
  };

  const analyzeImage = async (imageFile) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        const raw = JSON.stringify({
          "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
          },
          "inputs": [
            {
              "data": {
                "image": {
                  "base64": base64Image
                }
              }
            }
          ]
        });

        const requestOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
          },
          body: raw
        };

        try {
          console.log("Sending image to Clarifai Food Model...");
          const response = await fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, requestOptions);
          const result = await response.json();
          console.log("Clarifai Food Model response:", result);
          const description = result.outputs[0].data.concepts[0].name;
          resolve(description);
        } catch (error) {
          console.error('Error analyzing image: ', error);
          reject(error);
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file: ', error);
        reject(error);
      };
    });
  };

  const getNutritionalInfo = async (description) => {
    try {
      console.log(`Getting nutritional info for: ${description}`);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Give me the nutritional breakdown of ${description}` }],
          max_tokens: 150,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      console.log("OpenAI API response:", response.data);
      return response.data.choices[0].message.content.trim();
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
        max_tokens: 150,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      });

      console.log("OpenAI API response:", response.data);
      const aiResponse = { text: response.data.choices[0].message.content.trim(), type: 'ai' };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }} ref={chatContainerRef}>
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
              }}
            >
              {msg.image ? (
                <img src={msg.image} alt="uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              ) : (
                <Typography variant="body1">{msg.text}</Typography>
              )}
            </Paper>
          </Box>
        ))}
      </Box>
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
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
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message"
          value={message}
          onChange={handleInputChange}
          sx={{
            ml: 2,
            mr: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          endIcon={<SendIcon />}
          sx={{ minWidth: '80px', maxWidth: '100px', height: '40px', borderRadius: '20px' }}
        >
          Send
        </Button>
      </Paper>
    </Box>
  );
}
