const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mcpClient = require('./mcpClient');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

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
    // This is a simplification: we use the stats for the current phase
    // and assume the rest of the game follows a blended average.
    let avgRR = 7.5; // Default
    if (overs < 6) avgRR = phaseStats.powerplay.avgRR;
    else if (overs < 15) avgRR = phaseStats.middle.avgRR;
    else avgRR = phaseStats.death.avgRR;

    // Wicket Penalty Factor: more wickets = lower expected run rate
    // 0 wickets: 1.0, 10 wickets: 0.5
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
    // We multiply RR diff by 10 to make small changes more impactful in the sigmoid
    const x = (crr - oppRR) * 10 + (wicketDiff * 2);

    const probability = 1 / (1 + Math.exp(-x));
    return parseFloat(probability.toFixed(4));
  }
};

/**
 * API Endpoints
 */

app.get('/api/live-prediction', async (req, res) => {
  const { matchId } = req.query;

  if (!matchId) {
    return res.status(400).json({ error: 'matchId is required' });
  }

  try {
    const matchData = await mcpClient.getMatchData(matchId);

    // Get phase stats (simplified: we get them for the current batting team)
    const powerplay = await mcpClient.getPhaseStats(matchData.battingTeam, 'powerplay');
    const middle = await mcpClient.getPhaseStats(matchData.battingTeam, 'middle');
    const death = await mcpClient.getPhaseStats(matchData.battingTeam, 'death');
    const phaseStats = { powerplay, middle, death };

    // In a real scenario, we'd fetch the opponent's data too
    // For mock/demo, we simulate opponent data
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

module.exports = { Heuristics }; // Export for testing
