# 🏏 CricketIQ — Elite AI Cricket Analyst

**CricketIQ** is a production-grade, high-fidelity sports analytics platform that transforms plain-English questions into deep, visual, and narrative cricket insights. Designed with a "Broadcast-Quality" aesthetic, it blends the data density of a Bloomberg Terminal with the visual flair of ESPN CricInfo.

![CricketIQ Hero](src/assets/hero.png)

---

## 🚀 The Vision
Most cricket analytics are either too simple (scorecards) or too complex (massive spreadsheets). **CricketIQ** bridges this gap by using a Large Language Model (Claude 3.5 Sonnet) as a reasoning engine to interpret natural language, query a structured dataset, and generate an editorial-style breakdown including:
- **Narrative Analysis**: Intelligent, human-like explanations.
- **Visual Evidence**: Animated charts that "draw" themselves in real-time.
- **Contextual Simplification**: A "Newbie Mode" that explains complex cricket jargon to newcomers.
- **Auditory Insights**: Native Text-to-Speech for a hands-free analyst experience.

---

## ✨ Key Features

### 🧠 AI-Driven Intelligence
- **Natural Language Processing**: Ask questions like *"Why did GT lose the powerplay vs RCB?"* or *"Compare Kohli and Rohit's death-over strike rates."*
- **Structured Data Extraction**: Claude uses function calling to fetch specific match/player stats from local JSON stores, ensuring 100% factual accuracy.
- **Editorial Narrative**: Answers are delivered in a sophisticated, italicized serif font (`Libre Baskerville`) with a typewriter streaming effect.

### 📊 Dynamic Visualizations
- **The Scoring Worm (D3.js)**: A custom SVG implementation that animates the run-trajectory of a match using `stroke-dashoffset` transitions.
- **Phase-by-Phase Breakdown**: Immediate visual feedback on the three critical phases of a T20 match: Powerplay, Middle Overs, and Death Overs.
- **Run-Rate Comparisons**: Spring-animated bar charts that grow from 0% to their final value with a natural overshoot effect.
- **Animated Metric Cards**: Values count up from zero using custom easing functions (`easeOutExpo`).

### 🎨 Broadcast-Grade UI/UX
- **Aesthetic**: A deep charcoal base (`#0D1117`) with electric teal accents (`#1D9E75`).
- **Typography**: 
  - `Syne` for bold, architectural UI headers.
  - `Libre Baskerville` for the intellectual, editorial AI narrative.
  - `DM Mono` for precise, high-density statistical data.
- **Motion Design**: Powered by **Framer Motion**. Includes ambient background "blobs" for depth, staggered component entry, and glowing insight strips.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Ultra-fast reactive UI |
| **Styling** | Tailwind CSS + Custom CSS | Modern utility styling & keyframe animations |
| **Motion** | Framer Motion + D3.js | High-fidelity orchestration & complex SVG paths |
| **AI Engine** | Anthropic Claude API | NLP interpretation & data synthesis |
| **Backend** | Node.js + Express | API Proxy & secure key management |
| **Data** | Local JSON Dataset | High-performance mock IPL 2024/25 stats |
| **Audio** | Web Speech API | Browser-native text-to-speech |

---

## 🏗 Architecture: How it Works

1. **The Query**: User enters a natural language question in the `QueryBar`.
2. **The Reasoning**: The Express server sends the query to Claude. Claude decides which "Tool" (function) to call (e.g., `get_match_powerplay_stats`).
3. **The Fetch**: The server executes the function against the local JSON data and returns the raw stats to Claude.
4. **The Synthesis**: Claude analyzes the data and returns a precise JSON object containing the narrative, metrics, and chart data.
5. **The Render**: The React frontend receives the JSON and triggers a coordinated sequence of animations:
   - $\text{Answer Banner} \rightarrow \text{Metric Cards} \rightarrow \text{Charts} \rightarrow \text{Insight Strip} \rightarrow \text{Follow-up Chips}$

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- Anthropic API Key

### Installation
```bash
# Clone the repository
git clone https://github.com/rushillllchhaya/feature-cricketiq-core.git
cd cricketiq

# Install dependencies
npm install
```

### Environment Setup
Create a `.env` file in the root directory:
```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
```

### Running the App
```bash
# Start the backend server
cd server && node index.js

# Start the frontend development server (in a new terminal)
cd .. && npm run dev
```
Open your browser to `http://localhost:5173`.

---

## 🧪 Sample Queries to Try
- 📊 *"Why did GT lose the powerplay vs RCB?"*
- 🎯 *"Who is the best death bowler this season?"*
- ⚔️ *"Compare Virat Kohli and Rohit Sharma's powerplay strike rates"*
- 📈 *"Which team has the highest dot ball percentage in 2024?"*
- 🎓 *"Explain Jasprit Bumrah's economy rate (Newbie Mode ON)"*

---

## 📜 License
MIT © 2026 CricketIQ Team
