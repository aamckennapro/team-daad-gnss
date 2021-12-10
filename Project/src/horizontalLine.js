// line2.js
// The linegraph file specifically for the index.html page. 
// Adapted from https://www.d3-graph-gallery.com/graph/line_basic.html
// Written by Aaron McKenna
// Since this is line2, this is an experimental version with mouseover and zoom elements. Unlike line.js, you cannot switch lines.
import * as d3 from "https://cdn.skypack.dev/d3@7";

// let device_width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

let brushOn = false;

let curCsvPath = 'src/dataDaily.csv';

var margin = {top: 10, right: 60, bottom: 80, left: 60},
    width = 1600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

let text_width = (width/2 > 800 - margin.left - margin.right) ? width/2 : 400;
let text_height = ((height + margin.top + 20) > 400 - margin.top - margin.bottom) ? (height + margin.top + 30) : 220;

// if (device_width < 1500) {
//     margin = {top: 10, right: 60, bottom: 80, left: 60},
//     width = 1000 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;
//     if (device_width < 900) {
//         margin = {top: 10, right: 60, bottom: 80, left: 60},
//         width = 590 - margin.left - margin.right,
//         height = 400 - margin.top - margin.bottom;
//         if (device_width < 450) {
//             margin = {top: 10, right: 60, bottom: 80, left: 60},
//             width = 300 - margin.top - margin.bottom,
//             height = 300 - margin.top - margin.bottom;
//         } 
//     }
// }

var x = d3.scaleTime().range([ 0, width]);
var y = d3.scaleLinear().range([ height, 0 ]);

const legendWidth = width/5;

// append the svg object to the body of the page
const svg = d3.select("#horizontal_linegraph")
  .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0, 0, 1600, 400")
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var time = d3.timeParse("%-m-%-d %H"); // Why are these two seemingly similar vars necessary?
var format = d3.timeFormat("%-m-%-d %H"); // Let me explain! The time var is used for the real
                                          // data. The data starts off as a string, time turns
                                          // that into an int that D3 can use. format reformats
                                          // the integer into a string that is nicely displayed on the axis.

var keys = ["GPS", "GLONASS", "Galileo", "BeiDou"]; 

function generateLine2Graph(csvPath) {

    d3.csv(csvPath).then(function(data) {
        const lineGroup = d3.group(data, d => d.satellite);
        // Add X axis
        x.domain(d3.extent(data, function(d) {return time(d.timestamp); }))
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .attr("class", "x axis")
            .call(d3.axisBottom(x).ticks(12).tickFormat(format));
        d3.select(".x.axis").style("font-size", "14px");

        // Add Y axis
        y.domain([0, d3.max(data, function(d) { return +d.horizontalerror; })])
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y));
        d3.select(".y.axis").style("font-size", "14px");

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", text_width)
            .attr("y", text_height)
            .text("Time (Month-Day Hour)")
            .style("font-size", "18px");
        
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top * 15)
            .text("Horizontal Error (m)")
            .style("font-size", "18px");
        
        const color = d3.scaleOrdinal()
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999']);

        // Legends
        svg.selectAll("rectangles") // legend rectangles
            .data(lineGroup)
            .enter()
            .append("rect")
                .attr("id", (d => d[0]))
                .attr("class", "legend h")
                .attr("x", function(d, i) { return legendWidth * i + margin.left * 4; })
                .attr("y", height + margin.top + 40)
                .attr("width", 20)
                .attr("height", 20)
                .style("fill", function(d) { return color(d[0]); })
        
        svg.selectAll("labels") // legend text
            .data(lineGroup)
            .enter()
            .append("text")
                .attr("id", (d => d[0]))
                .attr("class", "legend h") // applies a class for styling
                .attr("x", function(d, i) { return (legendWidth * i) + 25 + margin.left * 4; })
                .attr("y", height + margin.top + 55)
                .style("fill", function(d) { return color(d[0]); })
                .text(function(d) { return d[0] })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle");

        svg.selectAll(".legend.h")
            .on("click", function(event, d) {
                var opac = d3.selectAll("#" + d[0] + ".line.h").style("opacity");
                if (opac == 1) {
                    opac = 0;
                } else {
                    opac = 1;
                }
                d3.selectAll("#" + d[0] + ".line.h")
                    .transition()
                    .duration(100)
                    .attr("opacity", opac);
            })   

        // Now it's Line Time™
        svg.selectAll(".line.h") 
            .data(lineGroup)             
            .join("path")
                .attr("id", (d => d[0]))
                .attr("class", "line h")
                .attr("fill", "none")
                .attr("stroke", function(d){ return color(d[0]) })
                .attr("stroke-width", 8.0)
                .attr("d", function(d) {
                    return d3.line()
                        .x(function(d) { return x(time(d.timestamp)); })
                        .y(function(d) { return y(+d.horizontalerror); })
                        (d[1])
                })
                .on("mouseover", function(event, d) {
                    console.log("mousing over graph!");
                    svg.selectAll(".line.h")
                        .transition()
                        .duration(100)
                        .attr("stroke-opacity", "0.5")
                        .attr("stroke", "#B8B8B8"); // makes all lines gray (or appear faded)
                    d3.select(this)
                        .attr("stroke-opacity", "1.0")
                        .transition()
                        .duration(100)
                        .attr("stroke", function(d){ return color(d[0]); })
                        .attr("stroke-width", 10.0) // bolds the line
                })
                .on("mouseout", function(event, d) {
                    svg.selectAll(".line.h")
                        .attr("stroke-opacity", "1.0")
                        .transition()
                        .duration(100)
                        .attr("stroke", function(d){ return color(d[0]); }); // gives all lines their original color
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr("stroke-width", 8.0); // resets bold on line mousedover
                });
                svg.append("g")
                    .attr("class", "brush")
                    .call(brush);

                    svg.select(".brush").style("display", "none")
                
        console.log("Reached bottom of first d3 function");
    });
}

// Add and initialize brush for zooming
const brush = d3.brushX() 
.extent([[0,0], [width,height]])
.on("end", function(event, d) {
    const extent = event.selection
    zoom(extent, curCsvPath) // will change to dataUser if it exists
})  

let idleTimeout
function idled() { idleTimeout = null; }

d3.select(".horizontal-submit").on("click", function(event, d) {
    console.log("line2 Pressed submit");
    curCsvPath = 'src/dataDateVis.csv' 
    updateGraph(curCsvPath);
});

// Use button to toggle brush on and off
d3.select(".horizontal-toggle-brush").on("click", function(event, d) {
    if (brushOn) {
        svg.select(".brush").style("display", "none")
        brushOn = false;
        this.style.backgroundColor = "white";
        this.style.fillOpacity = "0";
    } else {
        svg.select(".brush").style("display", "contents")
        brushOn = true
        this.style.backgroundColor = "green";
        this.style.fillOpacity = "1";
    }
});

// for whatever reason, the main function doesn't make it past here.
//console.log("Made it to line 67");

// Zoom to specified area, called  when a brush stroke ends
function zoom(extent, new_csv_path) {
    d3.csv(new_csv_path).then(function(new_data) {
        if(!extent){
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            x.domain(d3.extent(new_data, function(d) {return time(d.timestamp); }))
        } else {
            x.domain([x.invert(extent[0]), x.invert(extent[1])])
            svg.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }

        const lineGroup = d3.group(new_data, d => d.satellite);
        const color = d3.scaleOrdinal()
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

        svg.select(".x.axis")
            .transition()
            .duration(500)
            .call(d3.axisBottom(x).ticks(12).tickFormat(format));
        svg.selectAll(".line.h") 
            .data(lineGroup)
            .join("path")
            .transition()
            .duration(700)
            .attr("d", function(d) {
                return d3.line()
                    .x(function(d) { return x(time(d.timestamp)); })
                    .y(function(d) { return y(+d.horizontalerror); })
                    (d[1])
            })
            .transition()
            .duration(200)
            .attr("stroke", function(d){ return color(d[0]) })
            .attr("fill", "none")
            .attr("stroke-width", 8.0);
    });
}

function updateGraph(new_csv_path) { // Updates the graph AFTER listening for an event to occur.
    console.log("updateGraph running");

    d3.csv(new_csv_path).then(function(new_data) {
        // Rescale colorRange, x, and y for new data
        const lineGroup = d3.group(new_data, d => d.satellite);
        const color = d3.scaleOrdinal()
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

        x = d3.scaleTime()
            .domain(d3.extent(new_data, function(d) { return time(d.timestamp); }))
            .range([0, width]);

        y = d3.scaleLinear()
            .domain([0, d3.max(new_data, function(d) { return +d.horizontalerror; })])
            .range([height, 0]);

        svg.select(".x.axis")
            .transition()
            .duration(500)
            .call(d3.axisBottom(x).ticks(12).tickFormat(format));
        svg.select(".y.axis")
            .transition()
            .duration(500)
            .call(d3.axisLeft(y));
        svg.selectAll(".line.h") 
            .data(lineGroup)
            .join("path")
            .attr("stroke", "white")
            .transition()
            .duration(500)
            .attr("d", function(d) {
                return d3.line()
                    .x(function(d) { return x(time(d.timestamp)); })
                    .y(function(d) { return y(+d.horizontalerror); })
                    (d[1])
            })
            .transition()
            .duration(200)
            .attr("stroke", function(d){ return color(d[0]) })
            .attr("fill", "none")
            .attr("stroke-width", 4.0);
    });
} 


generateLine2Graph('src/dataDaily.csv'); // this is the default display