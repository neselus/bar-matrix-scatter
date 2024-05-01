import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CorrelationMatrix = ({ data2 }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!data2 || data2.length === 0) return;

    // Clean and filter data
    const cleanedData = data2.map(entry => ({
      total_bill: parseFloat(entry.total_bill),
      tip: parseFloat(entry.tip),
      size: parseInt(entry.size)
    }));
    const filteredData = cleanedData.filter(entry => !Object.values(entry).some(isNaN));

    // Draw chart
    const drawChart = (data) => {
      const svg = d3.select(chartRef.current);
      svg.selectAll('*').remove();

      const margin = { top: 50, right: 50, bottom: 100, left: 100 };
      const width = 400 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const variables = Object.keys(data[0]);

      const matrix = [];
      variables.forEach((rowVar, i) => {
        variables.forEach((colVar, j) => {
          const correlation = calculateCorrelation(data, rowVar, colVar);
          matrix.push({
            rowVar,
            colVar,
            value: correlation
          });
        });
      });

      //const colorRange = ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'];
      const colorScale = d3.scaleSequential()
        .domain([-1, 1])
        .interpolator(d3.interpolateRdYlBu);

      const x = d3.scaleBand()
        .domain(variables)
        .range([margin.left, width + margin.left]);

      const y = d3.scaleBand()
        .domain(variables)
        .range([margin.top, height + margin.top]);

      svg.append('text')
        .attr('x', (width + margin.left + margin.right) / 2 + 20)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '1.1em')
        .text('Correlation Matrix');

      svg.selectAll()
        .data(matrix)
        .enter().append('rect')
        .attr('x', d => x(d.colVar))
        .attr('y', d => y(d.rowVar))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .style('fill', d => d.value === 1 ? '#2ca02c' : colorScale(d.value));

      svg.selectAll()
        .data(matrix)
        .enter().append('text')
        .attr('x', d => x(d.colVar) + x.bandwidth() / 2)
        .attr('y', d => y(d.rowVar) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .style('fill', d => d.value === 1 ? '#ffffff' : d3.lab(colorScale(d.value)).l > 70 ? 'black' : 'white')
        .text(d => d3.format('.2f')(d.value));

      svg.selectAll('.rowLabel')
        .data(variables)
        .enter().append('text')
        .attr('class', 'rowLabel')
        .attr('x', margin.left - 20)
        .attr('y', (d, i) => y(variables[i]) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .text(d => d);

      svg.selectAll('.colLabel')
        .data(variables)
        .enter().append('text')
        .attr('class', 'colLabel')
        .attr('x', (d, i) => x(variables[i]) + x.bandwidth() / 2)
        .attr('y', margin.top + height + 20)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .text(d => d);

      svg.append('g')
        .attr('transform', `translate(0, ${margin.top})`)
        .call(d3.axisLeft(y));

      svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisTop(x));

      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width + margin.left + 50}, ${margin.top})`);

      const legendData = [-1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1];
      legend.selectAll('.legend-item')
        .data(legendData)
        .enter().append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * 20)
        .attr('width', 20)
        .attr('height', 20)
        .style('fill', d => d === 1 ? '#2ca02c' : colorScale(d));

      legend.selectAll('.legend-text')
        .data(legendData)
        .enter().append('text')
        .attr('x', 30)
        .attr('y', (d, i) => i * 20 + 12)
        .text(d => d3.format('.2f')(d));
    };

    drawChart(filteredData);
  }, [data2]);
  
  const calculateCorrelation = (data, rowVar, colVar) => {
    const mean = variable => d3.mean(data, d => d[variable]);
    const stdDev = variable => Math.sqrt(d3.variance(data, d => d[variable]));

    const numerator = d3.mean(data, d => (d[rowVar] - mean(rowVar)) * (d[colVar] - mean(colVar)));
    const denominator = stdDev(rowVar) * stdDev(colVar);
    return numerator / denominator;
  };

  return <svg ref={chartRef} width={600} height={600} />;
};

export default CorrelationMatrix;
