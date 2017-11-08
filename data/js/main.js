

var margin = {top:50, right:50, bottom:120, left:50};

var width = 700 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// Parse the date / time
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

d3.csv("data/zaatari-refugee-camp-population.csv", function(data) {
    var parseTime = d3.timeParse("%Y-%m-%d");
    data.forEach(function (d) {
        d.date = parseTime(d.date);
        d.population = +d.population;
    });
    console.log(data);

    var maxDate = d3.max(data, function(d) {
        return d.date;
    });
    var minDate = d3.min(data, function(d) {
        return d.date;
    });
    var dateScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, width]);

    var maxPopulation = d3.max(data, function(d) {
        return d.population;
    });
    var minPopulation = d3.min(data, function(d) {
        return d.population;
    });
    var populationScale = d3.scaleLinear()
        .domain([minPopulation, maxPopulation])
        .range([height, 0]);


    var svg = d3.select("body").select("#left")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var area = d3.area()
        .x(function(d) { return dateScale(d.date); })
        .y1(function(d) { return populationScale(d.population); })
        .y0(height);

    var path = svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);



    var lineSvg = svg.append("g");

    var focus = svg.append("g")
        .style("display", "none");


    focus.append("line")
        .attr("class", "x")
        .style("stroke", "blue")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("text")
        .attr("class", "txt");

    focus.append("text")
        .attr("class", "txtDate");

    // append the rectangle to capture mouse
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { console.log("HERE"); focus.style("display", null); })
        .on("mouseout", function() { console.log("AAA"); focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = dateScale.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        focus.select("text.txt")
            .attr("transform",
                "translate(" + (dateScale(d.date) + 8) + ",40)")
            .text(d.population.toLocaleString());

        focus.select("text.txtDate")
            .attr("transform",
                "translate(" + (dateScale(d.date) + 8) + ",53)")
            .text(d.date.getFullYear() +'-' + (d.date.getMonth() + 1) + '-' + d.date.getDate());

        focus.select("line.x")
            .attr("transform",
                "translate(" + dateScale(d.date) + ",0)");
        console.log(dateScale(d.date));
        console.log(populationScale(d.population));
    }







    var xAxis = d3.axisBottom()
        .scale(dateScale)
        .tickFormat(d3.timeFormat("%B %Y"));

    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
            .attr("y", -3)
            .attr("x", 10)
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

    var yAxis = d3.axisLeft()
        .scale(populationScale);

    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(0"  + ", 0)")
        .call(yAxis);

    svg.append("text")
        .text("Camp Population")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", 0);








    var shelter = {};
    shelter["Caravans"] = .7968;
    shelter["Tents"] = .0951;
    shelter["Combination"] = .1081;

    var svg = d3.select("body").select("#right")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var percentageScale = d3.scaleLinear()
        .domain([0., 1.0])
        .range([height, 0]);

    var ordinalScale = d3.scaleOrdinal()
        .domain(['','Caravans', 'Combination', 'Tents',''])
        .range([0,50, 150, 250, 300]);

    for (var key in shelter) {
        svg.append("rect")
            .attr("class", "bars")
            .attr("x", ordinalScale(key) - 40)
            .attr("y", percentageScale(shelter[key]))
            .attr("width", 80)
            .attr("height", height - percentageScale(shelter[key]));

        svg.append("text")
            .text((100 * shelter[key]).toFixed(2) + "%")
            .attr("x", ordinalScale(key))
            .attr("y", percentageScale(shelter[key]) - 10)
            .attr("text-anchor", "middle");

    }

    var xAxis = d3.axisBottom()
        .scale(ordinalScale);

    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0"  + ',' + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 8)
        .attr("x", 0)
        .style("text-anchor", "middle");

    var yAxis = d3.axisLeft()
        .scale(percentageScale)
        .tickFormat(d3.format(".0%"));

    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(0"  + ", 0)")
        .call(yAxis);

    // svg.append("rect")
    //     .attr("x", 50)
    //     .attr("y", height - percentageScale(shelter["caravans"]))
    //     .attr("width", 80)
    //     .attr("height", percentageScale(shelter["caravans"]));
    //
    // svg.append("rect")
    //     .attr("x", 150)
    //     .attr("y", height - percentageScale(shelter["combination"]))
    //     .attr("width", 80)
    //     .attr("height", percentageScale(shelter["combination"]));
    //
    // svg.append("rect")
    //     .attr("x", 250)
    //     .attr("y", height - percentageScale(shelter["tents"]))
    //     .attr("width", 80)
    //     .attr("height", percentageScale(shelter["tents"]));



    console.log(ordinalScale("caravans"))
    console.log(ordinalScale("combination"))
    console.log(ordinalScale("tents"))

    svg.append("text")
        .text("Type of Shelter")
        .attr("class", "title")
        .attr("x", 170)
        .attr("y", 0);


    // svg.selectAll("circle")
    //     .data(data)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", function(d, index) {
    //         return dateScale(d.date);
    //     })
    //     .attr("cy", function(d, index) {
    //         return populationScale(d.population);
    //     })
    //     .attr("r", 5)
    //     .attr("stroke", "black");
    //
    // console.log(data[5]);
});




