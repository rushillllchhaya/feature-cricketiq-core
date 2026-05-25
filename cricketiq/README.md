# 🏏 CricketIQ — AI-Powered Cricket Match Analyst

Ask plain-English questions about IPL 2024 matches and get AI-generated visual breakdowns with animated charts, spoken explanations, and deep per-match insight.

## Quick Start

```bash
# 1. Install dependencies
cd cricketiq
npm install

# 2. Add your Anthropic API key
# Edit .env and replace 'your_key_here' with your actual key
# ANTHROPIC_API_KEY=sk-ant-...

# 3. Start the backend (Terminal 1)
npm run server

# 4. Start the frontend (Terminal 2)
npm run dev

# 5. Open http://localhost:5173
```

## Sample Queries

- "Why did GT lose the powerplay vs RCB?"
- "Who is the best death bowler this IPL season?"
- "Compare Rohit Sharma and Shubman Gill's powerplay strike rates"
- "Explain Jasprit Bumrah's economy rate in death overs"
- "Which team has the highest dot ball percentage in 2024?"

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Charts:** Recharts + D3.js
- **AI:** Claude claude-sonnet-4-20250514 via Anthropic API
- **TTS:** Web Speech API (browser-native)
- **Backend:** Node.js + Express
- **Data:** Local JSON mock dataset (IPL 2024)
