import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const matches = JSON.parse(readFileSync(join(__dirname, 'data/matches.json'), 'utf-8'));
const players = JSON.parse(readFileSync(join(__dirname, 'data/players.json'), 'utf-8'));
const teams = JSON.parse(readFileSync(join(__dirname, 'data/teams.json'), 'utf-8'));

const tools = [
  {
    name: "get_match_powerplay_stats",
    description: "Get powerplay (overs 1-6) stats for a team in a specific match or across season",
    input_schema: {
      type: "object",
      properties: {
        team: { type: "string", description: "Team short code like CSK, MI, RCB, GT, KKR, DC, RR, PBKS, SRH, LSG" },
        opponent: { type: "string", description: "Opponent team short code" },
        match_id: { type: "string", description: "Specific match ID like M001" }
      },
      required: ["team"]
    }
  },
  {
    name: "get_player_stats",
    description: "Get season stats for a specific player",
    input_schema: {
      type: "object",
      properties: {
        player_name: { type: "string", description: "Full player name" },
        stat_type: { type: "string", enum: ["batting", "bowling", "fielding", "all"] },
        phase: { type: "string", enum: ["powerplay", "middle", "death", "all"] }
      },
      required: ["player_name"]
    }
  },
  {
    name: "get_team_phase_comparison",
    description: "Compare run rates and wickets across phases for one or multiple teams",
    input_schema: {
      type: "object",
      properties: {
        teams: { type: "array", items: { type: "string" }, description: "Array of team short codes" },
        phase: { type: "string", enum: ["powerplay", "middle", "death", "all"] },
        season: { type: "string" }
      },
      required: ["teams"]
    }
  },
  {
    name: "get_match_worm_data",
    description: "Get ball-by-ball cumulative run data for the worm chart",
    input_schema: {
      type: "object",
      properties: {
        match_id: { type: "string", description: "Match ID like M001" },
        team: { type: "string", description: "Team short code" }
      },
      required: ["match_id"]
    }
  }
];

function executeToolCall(name, input) {
  switch (name) {
    case 'get_match_powerplay_stats': {
      const { team, opponent, match_id } = input;
      if (match_id) {
        const match = matches.find(m => m.id === match_id);
        if (!match) return { error: "Match not found" };
        const innings = match.innings1.team === team ? match.innings1 : match.innings2.team === team ? match.innings2 : null;
        if (!innings) return { error: "Team not in this match" };
        return { match_id, team, opponent: match.team1 === team ? match.team2 : match.team1, powerplay: innings.phases.powerplay, total: innings.total, wickets: innings.wickets, result: match.result };
      }
      if (opponent) {
        const match = matches.find(m => (m.team1 === team && m.team2 === opponent) || (m.team1 === opponent && m.team2 === team));
        if (!match) return { error: "Match not found between these teams" };
        const innings = match.innings1.team === team ? match.innings1 : match.innings2;
        const oppInnings = match.innings1.team === opponent ? match.innings1 : match.innings2;
        return { match_id: match.id, team, opponent, team_powerplay: innings.phases.powerplay, opponent_powerplay: oppInnings.phases.powerplay, team_total: innings.total, opponent_total: oppInnings.total, result: match.result, date: match.date, venue: match.venue };
      }
      const teamData = teams.find(t => t.id === team);
      const teamMatches = matches.filter(m => m.team1 === team || m.team2 === team);
      const ppStats = teamMatches.map(m => {
        const inn = m.innings1.team === team ? m.innings1 : m.innings2;
        return { match_id: m.id, vs: m.team1 === team ? m.team2 : m.team1, ...inn.phases.powerplay };
      });
      return { team, season_avg: teamData?.phases?.powerplay, matches: ppStats };
    }
    case 'get_player_stats': {
      const { player_name, stat_type = 'all', phase = 'all' } = input;
      const player = players.find(p => p.name.toLowerCase().includes(player_name.toLowerCase()));
      if (!player) return { error: "Player not found" };
      const result = { name: player.name, team: player.team, role: player.role };
      if ((stat_type === 'all' || stat_type === 'batting') && player.batting) {
        result.batting = phase === 'all' ? player.batting : { ...player.batting, phase_detail: player.batting.phase[phase] };
      }
      if ((stat_type === 'all' || stat_type === 'bowling') && player.bowling) {
        result.bowling = phase === 'all' ? player.bowling : { ...player.bowling, phase_economy_detail: player.bowling.phase_economy[phase] };
      }
      return result;
    }
    case 'get_team_phase_comparison': {
      const { teams: teamCodes, phase = 'all' } = input;
      return teamCodes.map(code => {
        const team = teams.find(t => t.id === code);
        if (!team) return { team: code, error: "Not found" };
        if (phase === 'all') return { team: code, name: team.name, phases: team.phases, bowling_phases: team.bowling_phases, season: team.season };
        return { team: code, name: team.name, batting: team.phases[phase], bowling: team.bowling_phases[phase], season: team.season };
      });
    }
    case 'get_match_worm_data': {
      const { match_id, team } = input;
      const match = matches.find(m => m.id === match_id);
      if (!match) return { error: "Match not found" };
      return {
        match_id, team1: match.team1, team2: match.team2, date: match.date, venue: match.venue, result: match.result,
        innings1: { team: match.innings1.team, worm: match.innings1.worm, total: match.innings1.total, wickets: match.innings1.wickets, phases: match.innings1.phases },
        innings2: { team: match.innings2.team, worm: match.innings2.worm, total: match.innings2.total, wickets: match.innings2.wickets, phases: match.innings2.phases }
      };
    }
    default:
      return { error: "Unknown tool" };
  }
}

const SYSTEM_PROMPT = `You are CricketIQ, an elite cricket data analyst. Users ask plain-English questions about IPL matches and players.

Your job:
1. Call the appropriate data function(s) to fetch stats
2. Analyse the data
3. Return a JSON response with this EXACT shape:

{
  "narrative": "2-3 sentence expert answer in past tense. Bold key numbers with **markdown**. Mention specific players by name.",
  "newbie_narrative": "Same insight but explained simply — define jargon (e.g., 'The powerplay is the first 6 overs where fielding restrictions apply'). Max 2 sentences.",
  "metrics": [
    { "label": "GT Powerplay", "value": "38/2", "delta": "RR 6.3", "trend": "down" }
  ],
  "phase_data": {
    "powerplay": { "run_rate": 6.3, "wickets": 2, "status": "bad" },
    "middle":    { "run_rate": 7.8, "wickets": 2, "status": "ok" },
    "death":     { "run_rate": 11.2, "wickets": 1, "status": "good" }
  },
  "bar_chart": [
    { "team": "GT",  "value": 6.3, "color": "red" },
    { "team": "RCB", "value": 8.2, "color": "teal" },
    { "team": "MI",  "value": 8.9, "color": "blue" },
    { "team": "CSK", "value": 7.6, "color": "amber" }
  ],
  "worm_data": {
    "team1": { "name": "GT", "data": [0,6,11,17,...] },
    "team2": { "name": "RCB", "data": [0,8,14,...] }
  },
  "insight": "Counterfactual or key takeaway in one sentence.",
  "follow_ups": [
    "Compare GT powerplay all season",
    "Which RCB bowler was most effective?",
    "Show Gill career powerplay stats vs pace"
  ]
}

IMPORTANT: metrics array should have up to 4 items. bar_chart should have 3-5 items. follow_ups exactly 3 items.
For bar_chart colors use: "teal" for good/best, "blue" for secondary, "amber" for neutral, "red" for worst.
For phase_data status: "good" if above league avg, "ok" if around avg, "bad" if below.
For worm_data, include data from a relevant match. If no specific match, use the most relevant one.
Return ONLY valid JSON. No markdown fences. No preamble.`;

async function analyseQuery(query, newbieMode = false, conversationHistory = []) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const messages = [
    ...conversationHistory,
    { role: 'user', content: query }
  ];

  let response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    tools,
    messages
  });

  // Handle tool use loop
  while (response.stop_reason === 'tool_use') {
    const toolBlocks = response.content.filter(b => b.type === 'tool_use');
    const toolResults = toolBlocks.map(block => ({
      type: 'tool_result',
      tool_use_id: block.id,
      content: JSON.stringify(executeToolCall(block.name, block.input))
    }));

    messages.push({ role: 'assistant', content: response.content });
    messages.push({ role: 'user', content: toolResults });

    response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools,
      messages
    });
  }

  const textBlock = response.content.find(b => b.type === 'text');
  if (!textBlock) throw new Error('No text response from Claude');

  try {
    return JSON.parse(textBlock.text);
  } catch {
    // Try to extract JSON from the response
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error('Could not parse Claude response as JSON');
  }
}

export { analyseQuery, executeToolCall };
