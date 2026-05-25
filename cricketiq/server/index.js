import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyseQuery } from './claudeClient.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/analyse', async (req, res) => {
  try {
    const { query, newbieMode, conversationHistory } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_key_here') {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured. Add your key to .env file.' });
    }
    const result = await analyseQuery(query, newbieMode, conversationHistory || []);
    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasKey: !!process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_key_here' });
});

app.listen(PORT, () => {
  console.log(`🏏 CricketIQ server running on http://localhost:${PORT}`);
  console.log(`   API Key: ${process.env.ANTHROPIC_API_KEY ? '✓ configured' : '✗ missing'}`);
});
