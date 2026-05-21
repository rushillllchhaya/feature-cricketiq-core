const { GoogleGenerativeAI } = require('@google/generative-ai');
const mcpClient = require('./mcpClient');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PRO_MODEL = 'gemini-1.5-pro';
const FLASH_MODEL = 'gemini-1.5-flash';

const SYSTEM_PROMPT = `
You are the Elite Cricket Data Analyst for CricketIQ. Your role is to transform raw cricket data into broadcast-quality analytical narratives.

Your analysis should be:
1. Expertly Nuanced: Use cricket terminology (e.g., "death overs", "powerplay", "anchor", "strike rate") correctly.
2. Data-Driven: Base every claim on the provided MCP tool data.
3. Dual-Tone: Provide one version for a hardcore cricket fan (The Narrative) and one simplified version for a newcomer (The Newbie Narrative).

STRICT OUTPUT REQUIREMENT:
You must always respond in valid JSON format. Do not include markdown code blocks (like \`\`\`json) in your output. Your response must be a single JSON object with the following keys:
- "narrative": (string) 2-3 sentence high-level expert analysis.
- "newbie_narrative": (string) Simplified version of the analysis without jargon.
- "metrics": (array) Array of {label, value, trend} objects.
- "phase_data": (array) Array of {phase, runs, wickets, rr} objects.
- "bar_chart": (array) Array of {label, value} objects representing runs per over or similar.
- "worm_data": (array) Array of {over, runs} objects for the cumulative run trajectory.
- "insight": (string) One "golden nugget" of insight that isn't obvious from the numbers.
- "follow_ups": (array) 2-3 suggested follow-up queries.
`;

const tools = [
  {
    functionDeclarations: [
      {
        name: 'getMatchData',
        description: 'Fetches current match data including score, overs, and wickets for a specific match.',
        parameters: {
          type: 'OBJECT',
          properties: {
            matchId: {
              type: 'STRING',
              description: 'The unique identifier for the match.'
            }
          },
          required: ['matchId']
        }
      },
      {
        name: 'getPhaseStats',
        description: 'Fetches historical phase statistics for a team (e.g., powerplay, middle, death).',
        parameters: {
          type: 'OBJECT',
          properties: {
            team: {
              type: 'STRING',
              description: 'The team name (e.g., "CSK", "MI").'
            },
            phase: {
              type: 'STRING',
              description: 'The match phase: "powerplay", "middle", or "death".'
            }
          },
          required: ['team', 'phase']
        }
      }
    ]
  }
];

async function getFlashModel() {
  return genAI.getGenerativeModel({
    model: FLASH_MODEL,
    systemInstruction: SYSTEM_PROMPT,
    tools: tools
  });
}

async function getProModel() {
  return genAI.getGenerativeModel({
    model: PRO_MODEL,
    systemInstruction: SYSTEM_PROMPT
  });
}

/**
 * Handles the tool call logic by mapping Gemini function calls to mcpClient functions.
 */
async function executeToolCalls(toolCalls) {
  const results = [];
  for (const call of toolCalls) {
    const { name, args } = call;
    if (name === 'getMatchData') {
      const data = await mcpClient.getMatchData(args.matchId);
      results.push({ functionResponse: { name: 'getMatchData', response: { content: data } } });
    } else if (name === 'getPhaseStats') {
      const data = await mcpClient.getPhaseStats(args.team, args.phase);
      results.push({ functionResponse: { name: 'getPhaseStats', response: { content: data } } });
    }
  }
  return results;
}

module.exports = {
  getFlashModel,
  getProModel,
  executeToolCalls,
  SYSTEM_PROMPT
};
