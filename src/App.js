import React, { Component } from "react";
import "./App.css"
import BarChart from "./BarChart";
import CorrelationMatrix from "./CorrelationMatrix";
import Scatterplot from "./Scatterplot";
import * as d3 from 'd3'
import tips from './tips.csv'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {data:[]};
  }
  componentDidMount(){
    var self=this
    d3.csv(tips,function(d){
      return{
        tip:parseFloat(d.tip),
        total_bill:parseFloat(d.total_bill),
        day:d.day,
        sex:d.sex,
        smoker:d.smoker,
        time:d.time,
        size:parseInt(d.size)
      }
    }).then(function(csv_data){
      self.setState({data:csv_data})
      //console.log(csv_data)
    })
    .catch(function(err){
      console.log(err)
    })
  }
  render() {
    return (
      <div className="parent">
        <div className="row-container">
          <div className="barchart"><BarChart data1={this.state.data}></BarChart></div>
          <div className="correlationmatrix"><CorrelationMatrix data2={this.state.data}></CorrelationMatrix></div>
        </div>
        <div className="scatterplot"><Scatterplot data3={this.state.data}></Scatterplot></div>
      </div>
    );
  }
  
}

export default App