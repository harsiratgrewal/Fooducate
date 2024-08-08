import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import bodyParser from 'body-parser';

const KEY = process.env.OPENAI_API_KEY;

const app = express();
const port = 5000;

const openai = new OpenAI({
  apiKey: KEY
});


app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.post('/analyze-image', async (req, res) => {
  const { base64Image } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe the type and quantities of food in this image. Use this format- quantity food, quantity food, quantity food..."
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
