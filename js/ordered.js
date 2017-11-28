OrderedVis = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
}


OrderedVis.prototype.initVis = function() {

    var vis = this;

    var margin = {top:50, right:50, bottom:120, left:50};

    var width = 650 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    var allData = [];
    var posData = [];
    var negData = [];
    d3.csv(vis.data, function(data) {

        data.forEach(function (d) {
            var initial = d['2000 [YR2000]'];
            var final = d['2015 [YR2015]'];
            var change = (final - initial) / initial;
            if (d['Country Name'] != "" && !isNaN(change)) {
                if (change < 0) {
                    negData.push({'country': d['Country Name'], 'change': change});
                }
                else {
                    posData.push({'country': d['Country Name'], 'change': change});
                }

                allData.push({'country': d['Country Name'], 'change': change})
            }
        });

        allData.sort(function(a, b) {
            return a.change - b.change;
        });
        // console.log(allData);
        posData.sort(function(a, b) {
            return a.change - b.change;
        });
        negData.sort(function(a, b) {
            return a.change - b.change;
        });

        var changeScale = d3.scaleLinear()
            .domain([-1., 1.])
            .range([height, 0]);

        var indexScale = d3.scaleLinear()
            .domain([0, negData.length + posData.length])
            .range([0, width]);

        var svg = d3.select("body").select("#" + vis.parentElement)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var areaNeg = d3.area()
            .x(function(d, index) { return indexScale(index); })
            .y1(function(d) { return changeScale(d.change); })
            .y0(height / 2);

        var pathNeg = svg.append("path")
            .datum(negData)
            .attr("class", "areaNeg")
            .attr("d", areaNeg);

        var areaPos = d3.area()
            .x(function(d, index) { return indexScale(index + negData.length); })
            .y1(function(d) { return changeScale(d.change); })
            .y0(height / 2);

        var pathPos = svg.append("path")
            .datum(posData)
            .attr("class", "areaPos")
            .attr("d", areaPos);

        var lineSvg = svg.append("g");

        var focus = svg.append("g")
            .style("display", "none");


        focus.append("line")
            .attr("class", "x")
            .style("stroke", "grey")
            .attr("y1", 0)
            .attr("y2", height);

        focus.append("text")
            .attr("class", "txt");

        focus.append("text")
            .attr("class", "txtRate");

        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {
            var x0 = Math.round(indexScale.invert(d3.mouse(this)[0]));
            if (x0 >= allData.length) {
                x0 = allData.length - 1;
            }

            var anchor = "start";
            var displacement = 8;
            if (x0 > negData.length) {
                anchor = "end";
                displacement = -8;
            }

            focus.select("text.txt")
                .attr("transform",
                    "translate(" + (indexScale(x0) + displacement) + ",40)")
                .attr("text-anchor", anchor)
                .text(allData[x0]['country']);

            focus.select("text.txtRate")
                .attr("transform",
                    "translate(" + (indexScale(x0) + displacement) + ",53)")
                .attr("text-anchor", anchor)
                .text("Change in forest area: " + (100 * allData[x0]['change']).toFixed(2) + "%");

            focus.select("line.x")
                .attr("transform",
                    "translate(" + indexScale(x0) + ",0)");
        }

        var xAxis = d3.axisBottom()
            .scale(indexScale)
            .tickFormat("")
            .ticks(0);

        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + height / 2 + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("y", -3)
            .attr("x", 10)
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

        var yAxis = d3.axisLeft()
            .scale(changeScale)
            .tickFormat(d3.format(".0%"));

        svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", "translate(0"  + ", 0)")
            .call(yAxis);

        svg.append("text")
            .text("Forest Area Change (2000-2015)")
            .attr("class", "title")
            .attr("x", width / 2)
            .attr("y", 0);
    });

}




