import React from 'react';
import * as d3 from 'd3';
import { meshCatsAndSubcats } from './meshDiseaseCategories';

class ForceDiagram extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let diseases = this.props.diseaseSubCats;

    let w = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;

    var h = (window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight) - 200;

    let dataset = {
      nodes: diseases.map(cat => ({disease: cat})),
      edges: diseases.map((cat, i) => ({ source: 0, target: i }))
    };

    //code for force diagram based off of Scott Murray's demo in
    //his awesome book, 'Interactive Data Visualization'
    let force = d3.forceSimulation(dataset.nodes)
            .force("charge", d3.forceManyBody().strength(-1500))
            .force("link", d3.forceLink(dataset.edges))
            .force("center", d3.forceCenter().x(w/2).y(h/2));

    let colors = d3.scaleOrdinal(d3.schemeCategory10);

    let svg = d3.select("#forceDiagram")
                .attr("viewBox", `0 0 ${w} ${h}`)

    let edges = svg.selectAll("line")
      .data(dataset.edges)
      .enter()
      .append("line")
      .style("stroke", "#ccc")
      .style("stroke-width", 1);

    let nodes = svg.selectAll("circle")
      .data(dataset.nodes)
      .enter()
      .append("circle")
      .attr("class", "diseaseNode")
      .attr("r", (d, i) => {
        return i === 0 ? 10 : 5;
      })
      .style("fill", function(d, i) {
        return colors(i);
      })
      .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded));

    let labels = svg.selectAll(".labels")
       .data(dataset.nodes)
       .enter()
       .append("text")
       .attr("class", "nodeLabel")
       .text(function(d) { return d.disease; })
       .style("text-anchor", "middle")
       .style("fill", "#555")
       .style("font-family", "Arial")
       .style("font-size", (d, i) => {
         return i === 0 ? 16 : 12;
       });

    force.on("tick", function() {

      edges.attr("x1", function(d) { return d.source.x; })
           .attr("y1", function(d) { return d.source.y; })
           .attr("x2", function(d) { return d.target.x; })
           .attr("y2", function(d) { return d.target.y; });

      nodes.attr("cx", function(d) { return d.x; })
           .attr("cy", function(d) { return d.y; });

      labels.attr("x", function(d){ return d.x; })
            .attr("y", function (d, i) {
              return i === 0 ? d.y - 20 : d.y - 10;
            });
    });

    function dragStarted(d) {
      if (!d3.event.active) force.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragging(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragEnded(d) {
      if (!d3.event.active) force.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

  render() {
    return <svg id="forceDiagram"></svg>;
  }
}

export default ForceDiagram;
