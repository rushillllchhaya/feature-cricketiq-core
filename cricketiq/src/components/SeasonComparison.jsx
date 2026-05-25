import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { TEAM_COLORS } from '../utils/dataHelpers';

const SEASON_DATA = {
  CSK: [7.2, 8.1, 7.8, 6.9, 8.4, 7.5, 7.8, 8.0, 7.6, 7.9, 8.2, 7.4, 7.8, 8.1],
  MI:  [9.2, 8.5, 7.8, 9.0, 8.8, 7.2, 8.9, 8.1, 9.3, 7.6, 8.4, 9.1, 8.6, 8.9],
  RCB: [7.8, 8.4, 8.0, 8.6, 7.5, 8.2, 7.9, 8.8, 8.1, 8.5, 7.7, 8.2, 8.6, 8.2],
  GT:  [6.0, 5.8, 7.2, 6.5, 6.8, 5.5, 6.3, 7.0, 6.1, 6.9, 5.7, 6.3, 6.8, 6.3],
  KKR: [8.8, 8.2, 9.0, 8.5, 7.9, 8.8, 8.4, 9.2, 8.0, 8.5, 8.9, 8.1, 8.5, 8.5],
  SRH: [9.5, 8.8, 9.2, 9.8, 8.5, 9.1, 8.9, 9.4, 9.0, 8.7, 9.3, 8.6, 9.1, 9.1],
};

export default function SeasonComparison() {
  const teamCodes = Object.keys(SEASON_DATA);

  return (
    <div className="card animate-slide-up delay-700" style={{ marginTop: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Season Powerplay Trends
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {teamCodes.map(code => {
          const chartData = SEASON_DATA[code].map((v, i) => ({ match: i + 1, rr: v }));
          return (
            <div key={code} style={{ padding: 12, background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{code}</span>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  avg {(SEASON_DATA[code].reduce((a, b) => a + b) / SEASON_DATA[code].length).toFixed(1)}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={50}>
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="rr" stroke={TEAM_COLORS[code] || '#1D9E75'} strokeWidth={2} dot={false} />
                  <Tooltip
                    contentStyle={{ background: '#161B22', border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, fontSize: 12, fontFamily: 'DM Mono' }}
                    labelStyle={{ color: '#8B949E' }}
                    itemStyle={{ color: '#F0F6FC' }}
                    formatter={(v) => [`${v} RR`, 'PP Rate']}
                    labelFormatter={(v) => `Match ${v}`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}
