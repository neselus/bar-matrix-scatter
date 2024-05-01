import React, { Component } from "react";
import * as d3 from "d3";
class Scatterplot extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount(){
        console.log(this.props.data3);
    }
    componentDidUpdate() {
        var data=this.props.data3

        //set the dimensions and margins of the graph
        var margin = {top: 10, right: 10, bottom: 30, left: 20},
        w = 1000 - margin.left - margin.right,
        h = 300 - margin.top - margin.bottom;

        var container = d3.select(".scatterplot_svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .select(".g_1")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

        //Add x axis
        var x_data=data.map(item=>item.total_bill)
        const x_scale = d3.scaleLinear().domain([0,d3.max(x_data)]).range([margin.left, w]);
        container.selectAll(".x_axis_g").data([0]).join('g').attr("class",'x_axis_g')
        .attr("transform", `translate(0, ${h})`).call(d3.axisBottom(x_scale));

        //Add y axis
        var y_data=data.map(item=>item.tip)
        const y_scale = d3.scaleLinear().domain([0,d3.max(y_data)]).range([h, 0]);
        container.selectAll(".y_axis_g").data([0]).join('g').attr("class",'x_axis_g')
        .attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y_scale));

        container.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", function (d) {
            return x_scale(d.total_bill);
        })
        .attr("cy", function (d) {
            return y_scale(d.tip);
        })
        .attr("r", 3)
        .style("fill", "#ADADAD");
    }
    render() {
        return (
            <svg className="scatterplot_svg">
                <g className="g_1"></g>
            </svg>
        );
    }
}
export default Scatterplot;