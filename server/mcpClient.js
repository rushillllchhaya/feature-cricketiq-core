const dotenv = require('dotenv');
dotenv.config();

/**
 * MCP Client wrapper for cricket data.
 * Interfaces with external MCP servers or falls back to realistic mock data.
 */
const mcpClient = {
  /**
   * Fetches current match data including score, overs, and wickets.
   * @param {string} matchId
   * @returns {Promise<Object>}
   */
  async getMatchData(matchId) {
    try {
      // In a real scenario, this would be an MCP tool call.
      // For now, we simulate an MCP call that might fail or return a response.
      if (process.env.MCP_SERVER_URL) {
        // Mocking an actual network call logic here if needed
        // const response = await fetch(`${process.env.MCP_SERVER_URL}/match/${matchId}`);
        // return response.json();
        throw new Error('MCP Server not connected in development');
      }

      return this._getMockMatchData(matchId);
    } catch (error) {
      console.warn('MCP Client error, using mock data:', error.message);
      return this._getMockMatchData(matchId);
    }
  },

  /**
   * Fetches historical phase statistics for a team.
   * @param {string} team
   * @param {string} phase ('powerplay', 'middle', 'death')
   * @returns {Promise<Object>}
   */
  async getPhaseStats(team, phase) {
    try {
      if (process.env.MCP_SERVER_URL) {
        // Mocking an actual network call logic here
        // const response = await fetch(`${process.env.MCP_SERVER_URL}/stats/${team}/${phase}`);
        // return response.json();
        throw new Error('MCP Server not connected in development');
      }

      return this._getMockPhaseStats(team, phase);
    } catch (error) {
      console.warn('MCP Client error, using mock data:', error.message);
      return this._getMockPhaseStats(team, phase);
    }
  },

  // --- Mock Data Generators ---

  _getMockMatchData(matchId) {
    // Returns a realistic IPL-style match state
    // matchId: '123' -> Team A 100/2 (15.0 overs), Team B not started.
    const mocks = {
      '123': {
        matchId: '123',
        battingTeam: 'CSK',
        bowlingTeam: 'MI',
        score: 102,
        wickets: 2,
        overs: 15.0,
        totalOvers: 20,
        target: null, // batting first
        currentRunRate: 6.8,
        recentWickets: 1,
      },
      '456': {
        matchId: '456',
        battingTeam: 'RCB',
        bowlingTeam: 'KKR',
        score: 140,
        wickets: 6,
        overs: 14.2,
        totalOvers: 20,
        target: 180,
        currentRunRate: 9.7,
        recentWickets: 3,
      }
    };

    return mocks[matchId] || mocks['123'];
  },

  _getMockPhaseStats(team, phase) {
    const stats = {
      powerplay: { avgRR: 8.5, wicketProb: 0.1 },
      middle: { avgRR: 7.5, wicketProb: 0.15 },
      death: { avgRR: 11.0, wicketProb: 0.25 },
    };

    // In a real app, this would vary by team. For mock, we return global phase averages.
    return stats[phase] || stats.middle;
  }
};

module.exports = mcpClient;
