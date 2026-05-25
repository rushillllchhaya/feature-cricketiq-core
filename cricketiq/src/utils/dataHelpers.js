export const TEAM_COLORS = {
  CSK: '#FDB913', MI: '#004BA0', RCB: '#EC1C24', GT: '#1C1C2B',
  KKR: '#3A225D', DC: '#004C93', RR: '#EA1A85', PBKS: '#ED1B24',
  SRH: '#FF822A', LSG: '#A72056'
};

export const BAR_COLORS = {
  teal: '#1D9E75', blue: '#378ADD', amber: '#EF9F27', red: '#E24B4A', purple: '#8B5CF6'
};

export const JARGON = {
  'Powerplay': 'The first 6 overs of an innings where only 2 fielders are allowed outside the inner circle',
  'Middle Overs': 'Overs 7-15, the consolidation phase between powerplay and death',
  'Death Overs': 'The final 5 overs (16-20) where batters try to score quickly',
  'Run Rate': 'Average runs scored per over (6 balls)',
  'Strike Rate': 'Runs scored per 100 balls faced — higher means more aggressive',
  'Economy': 'Average runs conceded per over by a bowler — lower is better',
  'Dot Ball': 'A delivery where no run is scored',
  'NRR': 'Net Run Rate — a tiebreaker stat comparing scoring rates',
};

export function formatDelta(trend) {
  if (trend === 'up') return '▲';
  if (trend === 'down') return '▼';
  return '—';
}

export function getStatusColor(status) {
  if (status === 'good') return 'var(--accent-teal)';
  if (status === 'bad') return 'var(--accent-red)';
  return 'var(--accent-amber)';
}
