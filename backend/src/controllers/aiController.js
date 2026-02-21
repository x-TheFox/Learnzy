const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// POST /api/ai/simplify
const simplifyText = async (req, res) => {
  const { text, readingLevel } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    const prompt = `Simplify the following text for a ${readingLevel || 'beginner'} reading level. Use short sentences, simple words, and clear structure. Return only the simplified text.\n\nText: ${text}`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.5,
    });

    const simplified = completion.choices[0].message.content.trim();
    res.json({ simplified });
  } catch (error) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};

// POST /api/ai/quiz-hint
const getQuizHint = async (req, res) => {
  const { question, subject } = req.body;
  if (!question) {
    return res.status(400).json({ message: 'Question is required' });
  }

  try {
    const prompt = `You are a helpful tutor for students with ADHD and dyslexia. Provide a short, clear hint (2-3 sentences) for the following ${subject || ''} question without giving away the answer:\n\n${question}`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    const hint = completion.choices[0].message.content.trim();
    res.json({ hint });
  } catch (error) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};

// POST /api/ai/focus-check
const focusCheck = async (req, res) => {
  const { responsePattern } = req.body;

  try {
    const prompt = `Based on the following quiz response pattern (time taken per question, correct/incorrect sequence), estimate the student's focus level from 0-100 and provide one brief, encouraging tip:\n\n${JSON.stringify(responsePattern)}`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    const analysis = completion.choices[0].message.content.trim();
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};

module.exports = { simplifyText, getQuizHint, focusCheck };
