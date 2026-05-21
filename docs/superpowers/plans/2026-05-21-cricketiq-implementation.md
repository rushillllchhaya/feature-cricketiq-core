# CricketIQ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a broadcast-quality cricket analyst web app with AI narratives, real-time win probability, and interactive D3/Recharts visualizations using Gemini 1.5 Pro and MCP cricket data.

**Architecture:** Hybrid Intelligence approach. A "Fast Path" (Heuristic JS Engine) for real-time tickers and a "Deep Path" (Gemini 1.5 Pro $\rightarrow$ MCP Server) for expert analysis.

**Tech Stack:** React 18, Vite, Tailwind CSS, D3.js, Recharts, Node.js/Express, Gemini 1.5 Pro/Flash, Duckworth-MCP.

---

## File Structure

### Server (`/server`)
- `index.js`: Express server, API endpoints, and Heuristic Engine.
- `geminiClient.js`: Gemini API wrapper, prompt management, and tool definitions.
- `mcpClient.js`: Client to interface with Duckworth-MCP/Cricket-MCP.
- `.env`: API keys and config.

### Frontend (`/src`)
- `main.jsx` & `App.jsx`: Application entry and layout.
- `components/`
    - `QueryBar.jsx`: NLP input with spinning ball animation.
    - `AnswerBanner.jsx`: Typewriter narrative with `Libre Baskerville`.
    - `InsightStrip.jsx`: Glowing teal insight block.
    - `MetricCards.jsx`: Animated count-up stats.
    - `PredictiveTicker.jsx`: Win Prob gauge and Expected Total.
    - `WormChart.jsx`: D3.js cumulative run chart with draw-on animation.
    - `PowerplayChart.jsx`: Recharts bar chart with spring animation.
    - `NewbieToggle.jsx`: Jargon-simplification switch.
    - `LoadingSkeletons.jsx`: Cricket-themed shimmer placeholders.
- `hooks/`
    - `useAnalyst.js`: The main pipeline (Query $\rightarrow$ Backend $\rightarrow$ Render).
    - `useCountUp.js`: Number animation logic.
    - `useSpeech.js`: Web Speech API wrapper for TTS.
- `styles/`
    - `animations.css`: All keyframe definitions (slideUp, glowPulse, typewriter, and shimmer).
    - `index.css`: Tailwind and Typography (Syne, Libre Baskerville, DM Mono).

---

## Implementation Tasks

### Task 1: Foundation & Environment Setup
- [ ] **Step 1: Initialize project structure**
  `mkdir -p server src/components src/hooks src/styles`
- [ ] **Step 2: Setup `.env`**
  Create `.env` with `GEMINI_API_KEY` and `PORT=3001`.
- [ ] **Step 3: Configure Frontend Dependencies**
  `npm init -y` and install `react`, `react-dom`, `vite`, `tailwindcss`, `recharts`, `d3`, `lucide-react`.
- [ ] **Step 4: Configure Backend Dependencies**
  `cd server && npm init -y && npm install express dotenv cors @google/generative-ai`
- [ ] **Step 5: Commit foundation**

### Task 2: The Data Engine (MCP & Heuristics)
- [ ] **Step 1: Implement `mcpClient.js`**
  Create a wrapper to call the selected cricket MCP server for ball-by-ball and phase stats.
- [ ] **Step 2: Implement Heuristic Predictive Engine in `index.js`**
  Write the `calculateWinProb` and `calculateExpectedTotal` functions using the weighted-average formula from the spec.
- [ ] **Step 3: Create `/api/live-prediction` endpoint**
  Endpoint that returns current Win Prob and Expected Total for a given match ID.
- [ ] **Step 4: Verify predictions with mock data**
  Run a script to ensure the math outputs realistic numbers.
- [ ] **Step 5: Commit data engine**

### Task 3: The Brain (Gemini Integration)
- [ ] **Step 1: Implement `geminiClient.js`**
  Setup Gemini 1.5 Pro and Flash. Define the system prompt and the tools (mapping to MCP functions).
- [ ] **Step 2: Create `/api/analyse` endpoint**
  Implement the loop: User Query $\rightarrow$ Gemini Flash (Tool Selection) $\rightarrow$ MCP Data $\rightarrow$ Gemini Pro (Narrative Analysis) $\rightarrow$ Final JSON.
- [ ] **Step 3: Implement strict JSON validation**
  Add a wrapper to ensure the AI output matches the specified narrative/metrics/chart schema.
- [ ] **Step 4: Test full pipeline (Query $\rightarrow$ Response)**
  Verify that a query like "Why did GT lose the powerplay?" returns the correct JSON structure.
- [ ] **Step 5: Commit AI pipeline**

### Task 4: Core UI Shell & Aesthetics
- [ ] **Step 1: Setup Global CSS & Fonts**
  Import Syne, Libre Baskerville, and DM Mono. Configure Tailwind colors (charcoal base, electric teal accent).
- [ ] **Step 2: Implement `animations.css`**
  Define `slideUp`, `glowPulse`, `typewriter`, and `shimmer` keyframes.
- [ ] **Step 3: Build `App.jsx` layout**
  Implement the three-column "Command Center" grid.
- [ ] **Step 4: Implement `QueryBar.jsx`**
  Add focus states, teal underline, and the spinning cricket ball `⚪` animation.
- [ ] **Step 5: Commit UI shell**

### Task 5: The Analysis Hub (Center Column)
- [ ] **Step 1: Implement `AnswerBanner.jsx`**
  Build the narrative block with the character-by-character typewriter effect and `Libre Baskerville`.
- [ ] **Step 2: Implement `InsightStrip.jsx`**
  Create the teal bar with the `glowPulse` animation.
- [ ] **Step 3: Implement `MetricCards.jsx`**
  Build cards that use the `useCountUp` hook to animate values from 0.
- [ ] **Step 4: Implement `LoadingSkeletons.jsx`**
  Create shimmer placeholders and the cycling cricket-themed loading messages.
- [ ] **Step 5: Commit analysis hub**

### Task 6: The Predictive Ticker (Right Column)
- [ ] **Step 1: Implement `PredictiveTicker.jsx`**
  Build the "Tug-of-War" Win Probability gauge and the ticking Expected Total.
- [ ] **Step 2: Implement `useAnalyst.js` hook**
  Connect the frontend to `/api/analyse` and `/api/live-prediction` for real-time updates.
- [ ] **Step 3: Implement Live Update Polling**
  Ensure the Win Prob bar oscillates smoothly without layout shift.
- [ ] **Step 4: Commit predictive ticker**

### Task 7: High-Fidelity Visualizations (The Eye Candy)
- [ ] **Step 1: Implement `WormChart.jsx` (D3.js)**
  Create the scoring worm with `stroke-dashoffset` draw-on animation and phase-tinted backgrounds.
- [ ] **Step 2: Implement `PowerplayChart.jsx` (Recharts)**
  Create the horizontal bar chart with spring-easing grow-in animations.
- [ ] **Step 3: Implement `SeasonComparison.jsx`**
  Build mini sparklines for team trends across the season.
- [ ] **Step 4: Commit visualizations**

### Task 8: Polish & Edge Case Handling
- [ ] **Step 1: Implement `NewbieToggle.jsx`**
  Add the toggle that swaps narratives and injects jargon tooltips into metric labels.
- [ ] **Step 2: Implement `SpeakButton.jsx` (TTS)**
  Connect the narrative text to the Web Speech API via `useSpeech` hook.
- [ ] **Step 3: Implement `FollowUpChips.jsx`**
  Create the slide-in animation for contextual follow-up questions.
- [ ] **Step 4: Final End-to-End Verification**
  Test all sample queries from the spec and verify every animation triggers correctly.
- [ ] **Step 5: Final Commit & Cleanup**
