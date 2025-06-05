import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate', async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // or "gpt-4o" or "gpt-3.5-turbo" depending on your access
      messages: [
        {
          role: "system",
          content: "You are an assistant that converts user requests into HTML/CSS code only. Do not explain, just return the code.",
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
    });

    const code = response.choices[0].message.content;
    res.json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating code");
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
