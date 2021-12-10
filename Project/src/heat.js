src="https://d3js.org/d3.v7.js"

const margin = {top: 40, right: 40, bottom: 40, left: 40},
width = 1000 - margin.left - margin.right,
height = 1000 - margin.top - margin.bottom;

let text_width = (width/2 > 800 - margin.left - margin.right) ? width/2 : 400;
let text_height = ((height + margin.top + 20) > 400 - margin.top - margin.bottom) ? (height + margin.top + 30) : 220;

// append the svg object to the body of the page
const svg = d3.select("div#heat")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0, 0, 1000, 1000")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    //.classed("svg-content", true);

// global x, y, and color
// these are global since they do not change during graph update
const x = d3.scaleLinear()
    .domain([-5, 5])
    .range([ margin.left, width - margin.right ]);

const y = d3.scaleLinear()
    .domain([-5, 5])
    .range([ height - margin.bottom, margin.top ]);

const color = d3.scaleLinear()
    .domain([0, 1])
    .range([ "#2ef1ff", "#7b2eff"])

    

// read data
d3.csv("src/data4.csv").then(function(data) {


// Add X axis - returns x position in pixels based on data value
svg.append("g")
    .style("font-size", "24px")
    .attr("transform", `translate(0, ${height - margin.top})`)  // Move axis so it lines up with gridlines
    .call(d3.axisBottom(x));

// Add Y axis - returns y position in pixels based on data value
svg.append("g")
    .style("font-size", "24px")
    .attr("transform", `translate(${margin.right}, 0 )`)    // Move axis so it lines up with gridlines
    .call(d3.axisLeft(y));

svg.append("text")
    .attr("text-anchor", "middle")
    .attr("y", height + margin.top/2)
    .attr("x", width/2)
    .text("Horizontal Error (m)")
    .style("font-size", "26px");

svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 25)
    .attr("x", -width/2)
    .text("Vertical Error (m)")
    .style("font-size", "26px");

//Add x axis gridlines
const xAxisGrid = d3.axisBottom(x)
    .tickSize(height - margin.top - margin.bottom)
    .tickFormat('')
    .ticks(10);
svg.append('g')
    .attr('class', 'x axis-grid')
    .attr('transform', `translate(0,${margin.bottom})`)
    .call(xAxisGrid);

// Add y axis gridlines
const yAxisGrid = d3.axisLeft(y)
    .tickSize(-width + margin.left + margin.right)
    .tickFormat('')
    .ticks(10);
svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`) 
    .attr('class', 'y axis-grid')
    .call(yAxisGrid);

// Bullseye
for (let i = 1; i < 6; i++) {
    svg.append("g")
        .append("circle")
        .attr("r",((width - margin.top - margin.right)/10) * i)
        .attr("cx", (width + margin.left - margin.right)/2)
        .attr("cy", (height/2))
        .attr("fill", "none")
        .attr("stroke", "black")
}

// compute the density data
let densityData = d3.contourDensity()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); })
    .size([width, height])
    .bandwidth(13)
    (data)

// show the shape
svg.insert("g", "g")
    .selectAll("path")
    .data(densityData)
    .enter().append("path")
    .attr("d", d3.geoPath())
    .attr("fill", function(d) { return color(d.value); })
})

d3.select(".date-submit").on("click", function(event, d) {
    console.log("Updating heatmap");
    updateGraph("src/data5.csv") // will be dataUser.csv
});

function updateGraph(new_csv_path) {
    d3.csv(new_csv_path).then(function(new_data) {
        // compute new data
        let newDensity = d3.contourDensity()
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); })
            .size([width, height])
            .bandwidth(13)
            (new_data);

        svg.selectAll("path")
            .data(newDensity)
            .enter()
            .join("path")
            .style("opacity", 0)
            .attr("d", d3.geoPath())
            .transition()
            .duration(200)
            .style("opacity", 1);

        svg.selectAll("path")
            .data(newDensity)
            .transition()
            .duration(200)
            .attr("d", d3.geoPath());
    });
}