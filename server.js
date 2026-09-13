const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MODEL = process.env.AI_MODEL || 'llama-3.3-70b';
const AI_URL = process.env.AI_URL || 'https://api.cerebras.ai/v1/chat/completions';

app.use(express.json({ limit: '64kb' }));
app.use(express.static(__dirname));

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(m => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
    .slice(-20)
    .map(m => ({ role: m.role, content: m.content.slice(0, 12000) }));
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, subject, history } = req.body || {};
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }
    if (message.length > 8000) {
      return res.status(413).json({ error: 'message is too long' });
    }
    if (!process.env.AI_API_KEY) {
      return res.status(503).json({ error: 'AI_API_KEY is not configured on the server' });
    }

    const system = `You are Nova Tutor, a rigorous and friendly tutor. Teach from first principles, build a clear master chain before details, use Hinglish when the user does, define difficult terms in brackets, and never invent facts. Current subject: ${String(subject || 'General').slice(0, 100)}.`;
    const messages = [
      { role: 'system', content: system },
      ...cleanHistory(history),
      { role: 'user', content: message.trim() }
    ];

    const upstream = await fetch(AI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.4, max_tokens: 1800 })
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      console.error('AI provider error:', upstream.status, data);
      return res.status(502).json({ error: 'AI provider request failed' });
    }
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) return res.status(502).json({ error: 'AI provider returned no answer' });
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'Index.Html')));
app.listen(PORT, () => console.log(`Nova Tutor running on port ${PORT}`));
