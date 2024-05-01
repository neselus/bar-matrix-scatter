import React, { Component } from "react";
import * as d3 from "d3";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYAxis: "total_bill",
      selectedXAxis: "day",
      yAxisLabels: {
        total_bill: "Total Bill",
        tip: "Tip",
        size: "Size",
      },
      xAxisLabels: {
        sex: "Sex",
        smoker: "Smoker",
        day: "Day",
        time: "Time",
      },
    };
  }

  componentDidMount() {
    this.updateChart();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.data1 !== this.props.data1 ||
      prevState.selectedYAxis !== this.state.selectedYAxis ||
      prevState.selectedXAxis !== this.state.selectedXAxis
    ) {
      this.updateChart();
    }
  }

  updateChart() {
    const { data1 } = this.props;
    const { selectedYAxis, selectedXAxis } = this.state;
    const yAxisLabel = this.state.yAxisLabels[selectedYAxis];
    const xAxisLabel = this.state.xAxisLabels[selectedXAxis];

    const margin = { top: 10, right: 10, bottom: 50, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const container = d3
      .select(".barchart_svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .select(".g_2")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const tempData = d3.rollup(
      data1,
      (d) => d3.mean(d, (v) => v[selectedYAxis]),
      (d) => d[selectedXAxis]
    );

    const xScale = d3
      .scaleBand()
      .domain([...tempData.keys()])
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(tempData.values())])
      .nice()
      .range([height, 0]);

    container.selectAll("*").remove();

    container
      .append("g")
      .attr("class", "x_axis_g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    container.append("g").attr("class", "y_axis_g").call(d3.axisLeft(yScale));

    container
      .selectAll("rect")
      .data(tempData.entries())
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d[0]))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d[1]))
      .attr("fill", "#ADADAD");

    container
      .selectAll(".bar-label")
      .data(tempData.entries())
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => xScale(d[0]) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d[1]) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d3.format(".2f")(d[1]));

    container
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
      .style("text-anchor", "middle")
      .text(xAxisLabel);

    container
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yAxisLabel);
  }

  handleYAxisChange = (e) => {
    this.setState({ selectedYAxis: e.target.value });
  };

  handleXAxisChange = (e) => {
    this.setState({ selectedXAxis: e.target.value });
  };

  render() {
    const { selectedYAxis, selectedXAxis } = this.state;

    return (
      <div>
        <div>
          <label htmlFor="yAxis">Select Target: </label>
          <select id="yAxis" value={selectedYAxis} onChange={this.handleYAxisChange}>
            <option value="total_bill">Total Bill</option>
            <option value="tip">Tip</option>
            <option value="size">Size</option>
          </select>
        </div>
        <div>
          <div>
            <input
              type="radio"
              id="sex"
              value="sex"
              checked={selectedXAxis === "sex"}
              onChange={this.handleXAxisChange}
            />
            <label htmlFor="sex">Sex</label>

            <input
              type="radio"
              id="smoker"
              value="smoker"
              checked={selectedXAxis === "smoker"}
              onChange={this.handleXAxisChange}
            />
            <label htmlFor="smoker">Smoker</label>

            <input
              type="radio"
              id="day"
              value="day"
              checked={selectedXAxis === "day"}
              onChange={this.handleXAxisChange}
            />
            <label htmlFor="day">Day</label>

            <input
              type="radio"
              id="time"
              value="time"
              checked={selectedXAxis === "time"}
              onChange={this.handleXAxisChange}
            />
            <label htmlFor="time">Time</label>
          </div>
        </div>
        <svg className="barchart_svg">
          <g className="g_2"></g>
        </svg>
      </div>
    );
  }
}

export default BarChart;
