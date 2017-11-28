
// Will be used to the save the loaded JSON data
var allData = [];
var scatterData;

// Date parser to convert strings to date objects
var parseDate = d3.timeParse("%Y");

// Set ordinal color scale
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Variables for the visualization instances
var areachart, timeline;


// Start application by loading the data
loadData();

function loadData() {
    d3.json("data/forestdata.json", function(error, jsonData){
        if(!error){
            allData = jsonData;

            // Convert Pence Sterling (GBX) to USD and years to date objects
            allData.layers.forEach(function(d){
                for (var column in d) {
                    if (d.hasOwnProperty(column) && column != "Year") {
                        d[column] = parseFloat(d[column])/100000000;
                    } else if(d.hasOwnProperty(column) && column == "Year") {
                        d[column] = parseDate(d[column].toString());
                    }
                }
            });

            allData.years.forEach(function(d){
                d.Expenditures = parseFloat(d.Expenditures) - 35000000;
                d.Year = parseDate(d.Year.toString());
            });

            console.log(allData)

            // Update color scale (all column headers except "Year")
            // We will use the color scale later for the stacked area chart
            colorScale.domain(d3.keys(allData.layers[0]).filter(function(d){ return d != "Year"; }))

            createVis();
        }
    });
}

queue()
    .defer(d3.csv, "data/all.csv")
    .await(function(error, all) {

        all.forEach(function (d) {
            d[1990] = +d[1990];
            d[1991] = +d[1991];
            d[1992] = +d[1992];
            d[1993] = +d[1993];
            d[1994] = +d[1994];
            d[1995] = +d[1995];
            d[1996] = +d[1996];
            d[1997] = +d[1997];
            d[1998] = +d[1998];
            d[1999] = +d[1999];
            d[2000] = +d[2000];
            d[2001] = +d[2001];
            d[2002] = +d[2002];
            d[2003] = +d[2003];
            d[2004] = +d[2004];
            d[2005] = +d[2005];
            d[2006] = +d[2006];
            d[2007] = +d[2007];
            d[2008] = +d[2008];
            d[2009] = +d[2009];
            d[2010] = +d[2010];
            d[2011] = +d[2011];
            d[2012] = +d[2012];
            d[2013] = +d[2013];
            d[2014] = +d[2014];
            d[2015] = +d[2015];
            d.Population = +d.Population || 0;
            d.GDP = +d.GDP || 0;
            d.Rate = +d.Rate || 0;
            d.Region = d.Region || 0;
        });
    scatterdata = all;
    createScatter();
});


function createVis() {

    areachart = new StackedAreaChart("area", allData.layers);
    timeline = new Timeline("timeline", allData.years);

}

function createScatter() {

    scatter = new scatter("icons", scatterdata);

}

function brushed() {

    // Get the extent of the current brush
    var selectionRange = d3.brushSelection(d3.select(".brush").node());

    // Convert the extent into the corresponding domain values
    var selectionDomain = selectionRange.map(timeline.x.invert);

    areachart.x.domain(selectionDomain);
    areachart.wrangleData();

}
