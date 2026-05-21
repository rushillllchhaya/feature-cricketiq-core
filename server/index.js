const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mcpClient = require('./mcpClient');
const { getFlashModel, getProModel, executeToolCalls } = require('./geminiClient');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

/**
 * JSON Validation Wrapper
 * Retries the AI call once if the output is not valid JSON.
 */
async function withJsonValidation(aiCallFn) {
  let response = await aiCallFn();
  try {
    // Some models wrap JSON in markdown code blocks
    const cleanJson = response.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.warn('Invalid JSON received, retrying once...');
    response = await aiCallFn();
    const cleanJson = response.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanJson);
  }
}

/**
 * Heuristic Predictive Engine
 */
const Heuristics = {
  /**
   * Calculates the expected final total based on current state and phase averages.
   * @param {Object} matchData
   * @param {Object} phaseStats
   * @returns {number}
   */
  calculateExpectedTotal(matchData, phaseStats) {
    const { score, wickets, overs, totalOvers } = matchData;
    const remainingBalls = (totalOvers * 6) - Math.floor(overs * 6);

    // Determine current phase for the remaining balls
    let avgRR = 7.5; // Default
    if (overs < 6) avgRR = phaseStats.powerplay.avgRR;
    else if (overs < 15) avgRR = phaseStats.middle.avgRR;
    else avgRR = phaseStats.death.avgRR;

    // Wicket Penalty Factor: more wickets = lower expected run rate
    const wicketPenaltyFactor = Math.max(0.5, 1.0 - (wickets * 0.05));

    const expectedAdditionalRuns = remainingBalls * (avgRR / 6) * wicketPenaltyFactor;
    return Math.round(score + expectedAdditionalRuns);
  },

  /**
   * Calculates win probability using a sigmoid function.
   * @param {Object} matchData
   * @param {Object} opponentData
   * @returns {number}
   */
  calculateWinProbability(matchData, opponentData) {
    const crr = matchData.currentRunRate || 0;
    const oppRR = opponentData ? opponentData.currentRunRate : 6.0;
    const wicketDiff = (opponentData ? opponentData.wickets : 0) - matchData.wickets;

    // x = (Difference in RR * weight) + (Wicket Diff * weight)
    const x = (crr - oppRR) * 10 + (wicketDiff * 2);

    const probability = 1 / (1 + Math.exp(-x));
    return parseFloat(probability.toFixed(4));
  }
};

/**
 * API Endpoints
 */

app.post('/api/analyse', async (req, res) => {
  const { query, matchId } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // 1. Query -> Flash (Tool Selection)
    const flashModel = await getFlashModel();
    const flashResult = await flashModel.generateContent([query]);

    // Handle tool calls from the response
    const toolCalls = flashResult.response.functionCalls();

    let contextData = '';
    if (toolCalls && toolCalls.length > 0) {
      // 2. Execute tools via mcpClient
      const toolResults = await executeToolCalls(toolCalls);

      // Aggregate tool results for the Pro model
      contextData = toolResults.map(r => `${r.functionResponse.name}: ${JSON.stringify(r.functionResponse.response.content)}`).join('\n');
    }

    // 3. Data -> Pro (Narrative Analysis)
    const proModel = await getProModel();

    const analysisPrompt = `
      User Query: ${query}
      Match ID: ${matchId || 'Not provided'}
      Retrieved Data:
      ${contextData || 'No additional data retrieved.'}

      Generate the final expert analysis in the required JSON format.
    `;

    const finalAnalysis = await withJsonValidation(async () => {
      const result = await proModel.generateContent(analysisPrompt);
      return result.response.text();
    });

    res.json(finalAnalysis);
  } catch (error) {
    console.error('Analysis Pipeline Error:', error);
    res.status(500).json({ error: 'Internal server error during AI analysis', details: error.message });
  }
});

app.get('/api/live-prediction', async (req, res) => {
  const { matchId } = req.query;

  if (!matchId) {
    return res.status(400).json({ error: 'matchId is required' });
  }

  try {
    const matchData = await mcpClient.getMatchData(matchId);

    const powerplay = await mcpClient.getPhaseStats(matchData.battingTeam, 'powerplay');
    const middle = await mcpClient.getPhaseStats(matchData.battingTeam, 'middle');
    const death = await mcpClient.getPhaseStats(matchData.battingTeam, 'death');
    const phaseStats = { powerplay, middle, death };

    const mockOpponentData = {
      score: 150,
      wickets: 5,
      currentRunRate: 7.5,
    };

    const expectedTotal = Heuristics.calculateExpectedTotal(matchData, phaseStats);
    const winProbability = Heuristics.calculateWinProbability(matchData, mockOpponentData);

    res.json({
      matchId,
      winProbability,
      expectedTotal,
      timestamp: new Date().toISOString(),
      debug: {
        currentRR: matchData.currentRunRate,
        wicketPenalty: Math.max(0.5, 1.0 - (matchData.wickets * 0.05))
      }
    });
  } catch (error) {
    console.error('Prediction Error:', error);
    res.status(500).json({ error: 'Internal server error calculating predictions' });
  }
});

app.listen(PORT, () => {
  console.log(`CricketIQ Data Engine running on port ${PORT}`);
});

module.exports = { Heuristics };
