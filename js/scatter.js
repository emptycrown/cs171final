
scatter = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.filteredData = [];

    this.initVis();
}

scatter.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 0, right: 10, bottom: 40, left: 100};

    vis.width = 650 - vis.margin.left - vis.margin.right,
    vis.height = 450 - vis.margin.top - vis.margin.bottom;

    vis.padding = 20;

    $("#icon-select").material_select(updateVis);
    vis.svg = d3.select("#icons").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.filteredData = vis.data;

    updateVis();

   function updateVis() {
        vis.val = 2015;

       const region2id = {
           "East Asia & Pacific": "EArow",
           "Sub-Saharan Africa": "SSArow",
           "Middle East & North Africa": "MErow",
           "Europe & Central Asia": "EURrow",
           "Latin America & Caribbean": "LArow",
           "North America": "NArow",
           "South Asia": "SArow"
       };
       for(var region in region2id) {
           $("#"+region2id[region]).removeClass("selected");
       }
       if(vis.regionFilter) {
           $("#"+region2id[vis.regionFilter]).addClass("selected");
       }

        vis.data.forEach(function(d){
            d[1989] = (d[vis.val] - d[1990]) / d[1990] || 0;
        });

        vis.data = vis.data.filter(function (d) {
            return d[vis.val] > 2000;
        });

        var max_rate = d3.max(vis.data, function(d) {
            return d[1989];
        });

        var max_GDP = d3.max(vis.data, function(d) {
            return d.GDP;
        });

        var min_rate = d3.min(vis.data, function(d) {
            return d[1989];
        });

        var min_GDP = d3.min(vis.data, function(d) {
            return d.GDP;
        });

        var min_pop = d3.min(vis.data, function(d) {
            return d.Population;
        });

        var max_pop = d3.max(vis.data, function(d) {
            return d.Population;
        });

        var ratescale =  d3.scaleLinear()
            .domain([min_rate - 0.1, max_rate + 0.1])
            .range([vis.height-vis.padding, vis.padding]);

        var ratescalelog =  d3.scaleLog()
            .domain([min_rate + 0.1, max_rate + 0.2])
            .range([vis.height-vis.padding, vis.padding]);

        var GDPscale =  d3.scaleLinear()
            .domain([min_GDP - 1000, max_GDP + 1000])
            .range([vis.padding, vis.width-vis.padding]);

        var GDPscalelog =  d3.scaleLog()
            .domain([min_GDP + 100, max_GDP + 2000])
            .range([vis.padding, vis.width-vis.padding]);

        var radiusScale =  d3.scaleLinear()
            .domain([min_pop, max_pop])
            .range([5, 30]);

        var colorPalette = d3.scaleOrdinal(d3.schemeCategory10);

        colorPalette.domain(function (d){
            return d.Region;
        });

        vis.tooltip = d3.tip()
            .offset([0, -10])
            .attr("class", "mytooltip")
            .html(function(d) {
                return d["Country Name"] + "<br> (" + d["Country Code"] + ")"
            });

        vis.svg.call(vis.tooltip);

       vis.svg.selectAll("circle").remove();

        vis.circles = vis.svg.selectAll("circle")
            .data(vis.filteredData);

        vis.circles.enter()
            .append("circle")
            .on("mouseover", vis.tooltip.show)
            .on("mouseout",  vis.tooltip.hide)
            .merge(vis.circles)
            .transition(200)
            .attr("cx", function(d){
                return GDPscale(d.GDP);
            })
            .style("display", function(d) {
                return (!vis.regionFilter || d.Region == vis.regionFilter) ? "inline" : "none";
            })
            .attr("cy", function(d){
                return ratescale(d[1989]);
            })
            .attr("r", function(d){
                return radiusScale(d.Population);
            })
            .attr("stroke", "black")
            .attr("fill", function(d){
                return colorPalette(d.Region);
            })
            .attr("data-legend", function(d) {
                return d.Region
            });

        vis.svg.selectAll(".axis").remove();

        var xAxis = d3.axisBottom()
            .scale(GDPscalelog)
            .tickValues([200,500,1000,2000,5000,10000,20000, 40000,80000])
            .tickFormat(d3.format(",.0f"));

        var yAxis = d3.axisLeft()
            .scale(ratescale)
            .tickFormat(d3.format(".2g"));

        var xaxis_group = vis.svg.append("g");
        var yaxis_group = vis.svg.append("g");

        xaxis_group
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + ((vis.height-vis.padding)*2/3 - 12) + ")")
            .call(xAxis);

        yaxis_group
            .attr("class", "axis y-axis")
            .attr("transform", "translate(" + vis.padding + "," + -vis.padding +")")
            .call(yAxis);

        xaxis_group
            .append("text")
            .attr("x", (vis.width-3*vis.padding))
            .attr("y", -vis.padding/3)
            .text("GDP Per Capita (Log)")
            .attr("stroke", "black");

        yaxis_group
            .append("text")
            .attr("transform", "translate(" + -vis.margin.left/2 + "," + (vis.height-vis.padding)/3 +") rotate(-90)")
            .text("% Forest Growth (1990 - 2015)")
            .attr("stroke", "black");

    }

    function filterdataset(region) {
        if(vis.regionFilter == region) {
            vis.regionFilter = null;
        } else {
            vis.regionFilter = region;
        }
        updateVis();
    };

    document.getElementById("EArow").addEventListener("click", filterdataset.bind(null, "East Asia & Pacific"));
    document.getElementById("SSArow").addEventListener("click", filterdataset.bind(null, "Sub-Saharan Africa"));
    document.getElementById("MErow").addEventListener("click", filterdataset.bind(null, "Middle East & North Africa"));
    document.getElementById("EURrow").addEventListener("click", filterdataset.bind(null, "Europe & Central Asia"));
    document.getElementById("LArow").addEventListener("click", filterdataset.bind(null, "Latin America & Caribbean"));
    document.getElementById("NArow").addEventListener("click", filterdataset.bind(null, "North America"));
    document.getElementById("SArow").addEventListener("click", filterdataset.bind(null, "South Asia"));
}
