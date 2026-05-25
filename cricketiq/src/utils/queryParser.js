const TEAMS = ['CSK','MI','RCB','GT','KKR','DC','RR','PBKS','SRH','LSG'];
const TEAM_NAMES = {
  CSK:'Chennai Super Kings', MI:'Mumbai Indians', RCB:'Royal Challengers Bengaluru',
  GT:'Gujarat Titans', KKR:'Kolkata Knight Riders', DC:'Delhi Capitals',
  RR:'Rajasthan Royals', PBKS:'Punjab Kings', SRH:'Sunrisers Hyderabad', LSG:'Lucknow Super Giants'
};

export function extractEntities(query) {
  const q = query.toLowerCase();
  const foundTeams = TEAMS.filter(t => q.includes(t.toLowerCase()));
  Object.entries(TEAM_NAMES).forEach(([code, name]) => {
    if (q.includes(name.toLowerCase()) && !foundTeams.includes(code)) foundTeams.push(code);
  });
  const phases = [];
  if (q.includes('powerplay') || q.includes('power play') || q.includes('pp')) phases.push('powerplay');
  if (q.includes('middle')) phases.push('middle');
  if (q.includes('death')) phases.push('death');
  return { teams: foundTeams, phases };
}
