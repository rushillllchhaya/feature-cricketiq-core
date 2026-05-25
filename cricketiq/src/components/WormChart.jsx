import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function WormChart({ data }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 280;
    const margin = { top: 20, right: 20, bottom: 35, left: 45 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Get data arrays
    const team1Data = data.team1?.data || [];
    const team2Data = data.team2?.data || [];
    const maxOvers = Math.max(team1Data.length, team2Data.length);
    const maxRuns = Math.max(...team1Data, ...team2Data) * 1.1;

    const x = d3.scaleLinear().domain([0, maxOvers - 1]).range([0, w]);
    const y = d3.scaleLinear().domain([0, maxRuns]).range([h, 0]);

    // Phase regions
    const phases = [
      { start: 0, end: Math.min(6, maxOvers), color: 'rgba(29,158,117,0.04)', label: 'PP' },
      { start: 6, end: Math.min(15, maxOvers), color: 'rgba(55,138,221,0.03)', label: 'MID' },
      { start: 15, end: maxOvers, color: 'rgba(239,159,39,0.04)', label: 'DEATH' },
    ];

    phases.forEach(p => {
      if (p.start < maxOvers) {
        g.append('rect')
          .attr('x', x(p.start)).attr('y', 0)
          .attr('width', x(Math.min(p.end, maxOvers - 1)) - x(p.start))
          .attr('height', h)
          .attr('fill', p.color);
      }
    });

    // Phase dividers
    [6, 15].forEach(over => {
      if (over < maxOvers) {
        g.append('line')
          .attr('x1', x(over)).attr('x2', x(over))
          .attr('y1', 0).attr('y2', h)
          .attr('stroke', 'var(--border)').attr('stroke-dasharray', '4,4');
      }
    });

    // Axes
    g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).ticks(maxOvers > 10 ? 10 : maxOvers).tickFormat(d => `${d + 1}`))
      .call(g => g.selectAll('text').attr('fill', '#8B949E').style('font-family', 'DM Mono').style('font-size', '11px'))
      .call(g => g.selectAll('line').attr('stroke', 'var(--border)'))
      .call(g => g.select('.domain').attr('stroke', 'var(--border)'));

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .call(g => g.selectAll('text').attr('fill', '#8B949E').style('font-family', 'DM Mono').style('font-size', '11px'))
      .call(g => g.selectAll('line').attr('stroke', 'var(--border)'))
      .call(g => g.select('.domain').attr('stroke', 'var(--border)'));

    // Axis labels
    svg.append('text').attr('x', width / 2).attr('y', height - 2)
      .attr('text-anchor', 'middle').attr('fill', '#484F58')
      .style('font-size', '11px').style('font-family', 'DM Mono').text('Over');

    // Draw worm lines
    const line = d3.line().x((d, i) => x(i)).y(d => y(d)).curve(d3.curveMonotoneX);

    const drawLine = (lineData, color, label) => {
      if (!lineData.length) return;
      const path = g.append('path')
        .datum(lineData)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2.5)
        .attr('d', line);

      const totalLength = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition().duration(1400).ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);

      // End label
      g.append('text')
        .attr('x', x(lineData.length - 1) + 6)
        .attr('y', y(lineData[lineData.length - 1]))
        .attr('fill', color)
        .style('font-size', '11px').style('font-weight', '600').style('font-family', 'DM Mono')
        .text(label)
        .attr('opacity', 0)
        .transition().delay(1400).duration(300).attr('opacity', 1);
    };

    drawLine(team1Data, '#1D9E75', data.team1?.name || 'Team 1');
    drawLine(team2Data, '#378ADD', data.team2?.name || 'Team 2');

  }, [data]);

  if (!data) return null;

  return (
    <div className="card animate-slide-up delay-400" style={{ marginTop: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Scoring Worm
      </h3>
      <div ref={containerRef} style={{ width: '100%' }}>
        <svg ref={svgRef} style={{ width: '100%' }} />
      </div>
    </div>
  );
}
