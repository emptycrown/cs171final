
youDrawItVis = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.filteredData = this.data;

    this.initVis();
}


youDrawItVis.prototype.initVis = function() {
    var vis = this;

    var margin = {top: 50, right: 50, bottom: 120, left: 50};

    var width = 700 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // Parse the date / time
    var bisectDate = d3.bisector(function (d) {
        return d.date;
    }).left;

    d3.csv(vis.data, function (data) {
        var parseTime = d3.timeParse("%Y-%m-%d");
        data.forEach(function (d) {
            d.date = parseTime(d.date);
            d.population = +d.population;
        });

        var maxDate = d3.max(data, function (d) {
            return d.date;
        });
        var minDate = d3.min(data, function (d) {
            return d.date;
        });
        var dateScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, width]);

        var maxPopulation = d3.max(data, function (d) {
            return d.population;
        });
        var minPopulation = d3.min(data, function (d) {
            return d.population;
        });
        var populationScale = d3.scaleLinear()
            // .domain([minPopulation, maxPopulation])
            .domain([5,50])
            .range([height, 0]);


        vis.svg = d3.select("body").select("#" + vis.parentElement)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var area = d3.area()
            .x(function (d) {
                return dateScale(d.date);
            })
            .y1(function (d) {
                return populationScale(d.population);
            })
            .y0(height);

        vis.line = d3.line()
            .x(function (d) {
                return dateScale(d.date);
            })
            .y(function (d) {
                return populationScale(d.population);
            })
            .curve(d3.curveLinear);


        var lineSvg = vis.svg.append("g");

        var focus = vis.svg.append("g")
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

        var mouse = false;
        var lastCoordinate = -1;
        var drawData = [];
        var displayData = data.slice(0, 11);
        vis.correctData = data.slice(10);
        var corrected = false;

        vis.svg.append("path")
            .datum(displayData)
            .attr("d", vis.line)
            .attr("stroke-width", 2)
            .attr("stroke", "#9bc5c3")
            .attr("fill", "none")
            .attr("id", "display");

        vis.svg.append("path")
            .datum(drawData)
            .attr("d", vis.line)
            .attr("stroke-width", 2)
            .attr("stroke", "#A8BFFF")
            .attr("fill", "none")
            .attr("id", "user")
            .attr("stroke-dasharray", "5 2");

        // append the rectangle to capture mouse
        vis.svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function () {
                focus.style("display", null);
            })
            .on("mouseout", function () {
                focus.style("display", "none");
            })
            .on("mousemove", mouseclick)
            .on("mousedown", increment)
            .on("mouseup", decrement)
            .on("mouseout", decrement);

        $("#done-button").click(showCorrect);

        function showCorrect() {
            vis.svg.append("path")
                .datum(vis.correctData)
                .attr("d", vis.line)
                .attr("stroke-width", 2)
                .attr("stroke", "#FF1744")
                .attr("fill", "none")
                .attr("id", "correct");
        }

        function increment() {
            d3.event.preventDefault();
            mouse = true;
            var x0 = dateScale.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                iSelect = x0 - d0.date > d1.date - x0 ? i : i - 1;
            lastCoordinate = iSelect - 10;
            console.log("MOUSE PRESSED");

            // if (!corrected) {
            //     svg.append("path")
            //         .datum(correctData)
            //         .attr("d", line)
            //         .attr("stroke-width", 2)
            //         .attr("stroke", "red")
            //         .attr("fill", "none")
            //         .attr("id", "correct");
            //     corrected = true;
            // }
        }

        function decrement() {
            mouse = false;
            lastCoordinate = -1;
            console.log("UP")
        }

        function mouseclick() {
            d3.event.preventDefault();
            // console.log(d3.mouse(this));
            if (mouse) {
                var x0 = dateScale.invert(d3.mouse(this)[0]),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d = x0 - d0.date > d1.date - x0 ? d1 : d0,
                    iSelect = x0 - d0.date > d1.date - x0 ? i : i - 1;
                // console.log(iSelect);
                if (iSelect > 10) {
                    var effSelect = iSelect - 10;
                    if (effSelect > drawData.length - 1) {
                        for (var i = drawData.length; i <= effSelect; i++) {
                            drawData.push({
                                date: data[i + 10].date,
                                population: populationScale.invert(d3.mouse(this)[1])
                            });
                        }
                    }

                    drawData[effSelect].population = populationScale.invert(d3.mouse(this)[1]);

                    console.log(effSelect + ", " + lastCoordinate);
                    if (effSelect < lastCoordinate) {
                        for (i = effSelect; i < lastCoordinate; i++) {
                            drawData[i].population = drawData[effSelect].population;
                        }
                    }
                    if (effSelect > lastCoordinate && lastCoordinate >= 0) {
                        for (i = lastCoordinate + 1; i < effSelect; i++) {
                            drawData[i].population = drawData[effSelect].population;
                        }
                    }

                    lastCoordinate = effSelect;

                    var rect = vis.svg.select("#user");
                    rect.enter()
                        .merge(rect)
                        .attr("d", vis.line);
                    rect.exit().remove();

                }

                // var rect = svg.select("#actual");
                // rect.enter()
                //     .merge(rect)
                //     .attr("d", line);
                // rect.exit().remove();
            }
        }


        var xAxis = d3.axisBottom()
            .scale(dateScale)
            .tickFormat(d3.timeFormat("%Y"));

        vis.svg.append("g")
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

        vis.svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", "translate(0" + ", 0)")
            .call(yAxis);

        var xaxis_group = vis.svg.append("g");
        var yaxis_group = vis.svg.append("g");

        xaxis_group
            .append("text")
            .attr("x", (width/2))
            .attr("y", height + margin.bottom/2)
            .style("font-size", 12)
            .text("Year")
            .attr("stroke", "black");

        yaxis_group
            .append("text")
            .attr("transform", "translate(" + -margin.left*3/4 + "," + height*3/4 +") rotate(-90)")
            .text("Women in STEM Occupations (%)")
            .style("font-size", 12)
            .attr("stroke", "black");

        vis.svg.append("text")
            .text("Percentage of Women in STEM")
            .attr("class", "youdrawit-title")
            .attr("x", width / 2)
            .attr("y", 0);

        vis.svg.append("text")
            .text("Draw Here!")
            .attr("class", "youdrawit-subtitle")
            .attr("x", width*5/12)
            .attr("y", 40);

    });

}

// youDrawItVis.prototype.updateVis = function() {
//     var vis = this;
//
//     vis.svg.append("path")
//         .datum(vis.correctData)
//         .attr("d", vis.line)
//         .attr("stroke-width", 2)
//         .attr("stroke", "red")
//         .attr("fill", "none")
//         .attr("id", "correct");
// }


