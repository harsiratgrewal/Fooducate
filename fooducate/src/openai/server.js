import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import bodyParser from 'body-parser';

const KEY = process.env.OPENAI_API_KEY;
const port = process.env.PORT || 5000;
const app = express();


const openai = new OpenAI({
  apiKey: KEY
});

app.use(cors({
  origin: 'https://www.fooducate.me',
  methods: ['GET', 'POST']
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.post('/send-message', async (req, res) => {
  const { message, sessionHistory } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `I am passing your chat history here- ${JSON.stringify(sessionHistory)} (if history is empty ignore this line) (don't mention about the history in response just use it). This is the current query (don't mention about the query just take it) (Just answer the question): ${message}`}],
      max_tokens: 500,
    });

    if (response.choices[0].message.content) {
      const aiResponse = response.choices[0].message.content.trim();
      res.json({ aiResponse });
    } else {
      res.status(500).json({ error: 'Failed to get a valid response from OpenAI API.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing the message' });
  }
});

app.post('/analyze-image', async (req, res) => {
  const { base64Image } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe the type and quantities of food in this image. Use this format quantity food, quantity food, quantity food..."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    if (response.choices[0].message.content) {
      const description = response.choices[0].message.content;
      res.json({ description });
    } else {
      res.status(500).json({ error: 'Failed to get a valid response from OpenAI API.' });
    }
  } catch (error) {
    console.error('Error analyzing image: ', error);
    res.status(500).json({ error: 'Error analyzing image' });
  }
});

app.post('/get-nutritional-info', async (req, res) => {
  const { description } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: `Give a 2-3 line brief nutritional breakdown (no headings or subheadings) (just include one line of names/quantities, total calories, and then a very brief benefit) for the following items: ${description}
        Use this format: 
        Quantity Name (Calories cal), Quantity Name (Calories). Total calories ~ (Amount) cal. Overall Benefit` }],
      max_tokens: 1000,
    });

    if (response.choices[0].message.content) {
      const nutritionalInfo = response.choices[0].message.content;
      res.json({ nutritionalInfo });
    } else {
      res.status(500).json({ error: 'Failed to get a valid response from OpenAI API.' });
    }
  } catch (error) {
    console.error('Error getting nutritional info: ', error);
    res.status(500).json({ error: 'Error getting nutritional info' });
  }
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Fooducate Backend Server!');
});