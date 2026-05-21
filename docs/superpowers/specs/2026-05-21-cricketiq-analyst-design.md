# CricketIQ Design Specification
**Date:** 2026-05-21
**Status:** Proposed
**Author:** Claude Code

## 1. Project Overview
CricketIQ is a production-grade, broadcast-quality cricket analyst web application. It transforms plain-English queries into deep analytical insights using a hybrid approach of Large Language Model (LLM) reasoning and a real-time predictive heuristic engine.

### Core Value Proposition
- **Narrative Intelligence:** Expert-level cricket analysis delivered in a typewriter-streamed narrative.
- **Predictive Accuracy:** Real-time "Win Probability" and "Expected Total" trackers.
- **Broadcast Aesthetics:** High-fidelity dark-mode UI with fluid animations and data-rich visualizations.

---

## 2. Technical Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Custom CSS Animations (no component libraries)
- **Visualization:** 
  - **Recharts:** Powerplay bar charts, season trends.
  - **D3.js:** The "Worm Chart" (cumulative run trajectory).
- **Fonts:**
  - UI/Headings: `Syne` (sans-serif)
  - AI Narratives: `Libre Baskerville` (serif)
  - Stats/Labels: `DM Mono` (monospace)

### Backend & AI
- **Runtime:** Node.js + Express (API Proxy)
- **AI Models (Google Gemini API):**
  - **Gemini 1.5 Pro:** The "Brain" - High-reasoning for the AI Analyst Sector.
  - **Gemini 1.5 Flash:** The "Reflex" - Low-latency query parsing and tool mapping.
- **Data Layer:** 
  - **MCP Servers:** `Duckworth-MCP` and `Cricket-MCP` for ball-by-ball historical and live data.
  - **Heuristic Engine:** Custom JS implementation for real-time predictive math.

---

## 3. System Architecture

### The Hybrid Intelligence Model
The system is split into two primary "Intelligence Sectors":

#### A. AI Analyst Sector (The "Deep" Path)
- **Purpose:** Narrative analysis, contextual insight, and counterfactuals.
- **Flow:** User Query $\rightarrow$ Gemini 1.5 Flash (Parse) $\rightarrow$ MCP Tool Call $\rightarrow$ Data $\rightarrow$ Gemini 1.5 Pro (Analyze) $\rightarrow$ JSON Narrative Response.
- **Key Output:** 2-3 sentence expert analysis, "Newbie" version, and key metrics.

#### B. Predictive Engine Sector (The "Fast" Path)
- **Purpose:** Real-time Win Probability (%) and Expected Total.
- **Flow:** Current Match State $\rightarrow$ Heuristic Engine (Weighted Averages of Historical Phase Stats) $\rightarrow$ Numerical Output.
- **Key Output:** Floating probability percentage and projected score.

### Data Flow Diagram
`User` $\rightarrow$ `QueryBar` $\rightarrow$ `Express Server` $\rightarrow$ `Gemini (Routing)` $\rightarrow$ `MCP Servers (Data)` $\rightarrow$ `Gemini (Analysis)` $\rightarrow$ `Frontend` $\rightarrow$ `Heuristic Engine (Live Ticker)`

---

## 4. UI/UX Design (The Command Center)

### Layout
A three-column "Command Center" optimized for dark-mode visibility.
- **Center (Analysis Hub):** Narrative Banner $\rightarrow$ Glowing Insight Strip $\rightarrow$ Animated Metric Cards.
- **Right (The Ticker):** Win Probability Gauge $\rightarrow$ Expected Total Tracker $\rightarrow$ Live Match State.
- **Bottom/Left (Controls):** Query Bar (with spinning ball animation) $\rightarrow$ Contextual Follow-up Chips.

### Visual Requirements (Non-Negotiable)
- **Colors:** Base `#0D1117`, Primary Accent `#1D9E75` (Electric Teal).
- **Animations:** 
  - **Metric Cards:** Count-up from 0 to final value.
  - **Worm Chart:** `stroke-dashoffset` draw-on animation.
  - **Narrative:** Typewriter streaming effect.
  - **Loading:** Cricket-themed skeleton shimmer with cycling status messages.

---

## 5. Implementation Details

### Predictive Engine Logic (Heuristic)
$\text{Expected Total} = \text{Current Runs} + (\text{Remaining Balls} \times \text{Phase Average RR} \times \text{Wicket Penalty Factor})$
$\text{Win Prob} = \text{Sigmoid}(\text{Current Run Rate} - \text{Opponent RR} + \text{Wicket Differential})$

### Error Handling & Safeguards
- **JSON Guard:** Strict schema validation for Gemini responses; auto-retry on parse failure.
- **Data Truth:** MCP raw data always overrides LLM-generated numbers in metric cards.
- **Graceful Degrade:** Predictive engine uses cached state if MCP server latency exceeds 500ms.

### Environment Configuration (`.env`)
```env
GEMINI_API_KEY=your_google_gemini_key_here
PORT=3001
NODE_ENV=development
```

---

## 6. Success Criteria
- [ ] All visual animations trigger on every new query.
- [ ] Win Probability updates in $<100ms$ on state change.
- [ ] AI Narrative takes $<3s$ to begin streaming.
- [ ] Newbie Mode correctly transforms jargon into simple explanations.
- [ ] Worm chart renders accurately from ball-by-ball MCP data.
