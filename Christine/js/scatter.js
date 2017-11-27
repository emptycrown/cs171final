//
// var margin = {top: 40, right: 10, bottom: 40, left: 100};
//
// var width = 800 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;
//
// var padding = 20;
//
// var svg = d3.select("#icons").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// var data;
//
// queue()
//     .defer(d3.csv, "data/all.csv")
//     .await(function(error, all){
//
//         all.forEach(function(d){
//             d[1990] = +d[1990];
//             d[1991] = +d[1991];
//             d[1992] = +d[1992];
//             d[1993] = +d[1993];
//             d[1994] = +d[1994];
//             d[1995] = +d[1995];
//             d[1996] = +d[1996];
//             d[1997] = +d[1997];
//             d[1998] = +d[1998];
//             d[1999] = +d[1999];
//             d[2000] = +d[2000];
//             d[2001] = +d[2001];
//             d[2002] = +d[2002];
//             d[2003] = +d[2003];
//             d[2004] = +d[2004];
//             d[2005] = +d[2005];
//             d[2006] = +d[2006];
//             d[2007] = +d[2007];
//             d[2008] = +d[2008];
//             d[2009] = +d[2009];
//             d[2010] = +d[2010];
//             d[2011] = +d[2011];
//             d[2012] = +d[2012];
//             d[2013] = +d[2013];
//             d[2014] = +d[2014];
//             d[2015] = +d[2015];
//             d.Population = +d.Population || 0;
//             d.GDP = +d.GDP || 0;
//             d.Rate = +d.Rate || 0;
//             d.Region = d.Region || 0;
//         });
//
//         // Store csv data in global variable
//
//         data = all;
//
//         updateVisualization();
//     });
//
// // Render visualization
//
// function updateVisualization() {
//
//     var val = d3.select("#icon-select").property("value");
//     data.forEach(function(d){
//         d[1989] = (d[val] - d[1990]) / d[1990] || 0;
//     });
//
//     data = data.filter(function (d) {
//         return d[val] > 2000;
//     });
//
//     var max_rate = d3.max(data, function(d) {
//         return d[1989];
//     });
//
//     var max_GDP = d3.max(data, function(d) {
//         return d.GDP;
//     });
//
//     var min_rate = d3.min(data, function(d) {
//         return d[1989];
//     });
//
//     var min_GDP = d3.min(data, function(d) {
//         return d.GDP;
//     });
//
//     var min_pop = d3.min(data, function(d) {
//         return d.Population;
//     });
//
//     var max_pop = d3.max(data, function(d) {
//         return d.Population;
//     });
//
//     var ratescale =  d3.scaleLinear()
//         .domain([min_rate - 0.1, max_rate + 0.1])
//         .range([height-padding, padding]);
//
//     var ratescalelog =  d3.scaleLog()
//         .domain([min_rate + 0.1, max_rate + 0.2])
//         .range([height-padding, padding]);
//
//     var GDPscale =  d3.scaleLinear()
//         .domain([min_GDP - 1000, max_GDP + 1000])
//         .range([padding, width-padding]);
//
//     var GDPscalelog =  d3.scaleLog()
//         .domain([min_GDP + 100, max_GDP + 2000])
//         .range([padding, width-padding]);
//
//     var radiusScale =  d3.scaleLinear()
//         .domain([min_pop, max_pop])
//         .range([5, 30]);
//
//     var colorPalette = d3.scaleOrdinal(d3.schemeCategory10);
//
//     colorPalette.domain(function (d){
//         return d.Region;
//     });
//
//     var tooltip = d3.tip()
//         .offset([0, -10])
//         .attr("class", "mytooltip")
//         .html(function(d) {
//             return d["Country Name"] + "<br> (" + d["Country Code"] + ")"
//         })
//
//     svg.call(tooltip)
//
//     var circles = svg.selectAll("circle")
//         .data(data)
//
//     circles.enter()
//         .append("circle")
//         .on("mouseover", tooltip.show)
//         .on("mouseout",  tooltip.hide)
//         .merge(circles)
//         .transition(200)
//         .attr("cx", function(d){
//             return GDPscale(d.GDP);
//         })
//         .attr("cy", function(d){
//             return ratescale(d[1989]);
//         })
//         .attr("r", function(d){
//             return radiusScale(d.Population);
//         })
//         .attr("stroke", "gray")
//         .attr("fill", function(d){
//             return colorPalette(d.Region);
//         })
//         .attr("data-legend", function(d) {
//             return d.Region
//         });
//
//     svg.selectAll(".axis").remove()
//
//     var xAxis = d3.axisBottom()
//         .scale(GDPscalelog)
//         .tickValues([200,500,1000,2000,5000,10000,20000, 40000,80000])
//         .tickFormat(d3.format(",.0f"));
//
//     var yAxis = d3.axisLeft()
//         .scale(ratescale)
//         .tickFormat(d3.format(".2g"));
//
//     var xaxis_group = svg.append("g");
//     var yaxis_group = svg.append("g");
//
//     xaxis_group
//         .attr("class", "axis x-axis")
//         .attr("transform", "translate(0," + ((height-padding)*2/3 - 12) + ")")
//         .call(xAxis);
//
//     yaxis_group
//         .attr("class", "axis y-axis")
//         .attr("transform", "translate(" + padding + "," + -padding +")")
//         .call(yAxis);
//
//     xaxis_group
//         .append("text")
//         .attr("x", (width-3*padding))
//         .attr("y", -padding/3)
//         .text("GDP Per Capita (Log)")
//         .attr("stroke", "black");
//
//     yaxis_group
//         .append("text")
//         .attr("transform", "translate(" + -margin.left/2 + "," + (height-padding)/3 +") rotate(-90)")
//         .text("% Change in Deforestation since 1990")
//         .attr("stroke", "black");
//
// }
//
// d3.select("#icon-select").on("change", updateVisualization);
//
