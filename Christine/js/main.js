
// Will be used to the save the loaded JSON data
var allData = [];

// Date parser to convert strings to date objects
var parseDate = d3.timeParse("%Y");

// Set ordinal color scale
var colorScale = d3.scaleOrdinal(d3.schemeCategory20);

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
                        d[column] = parseFloat(d[column])**1.5/100000000;
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


function createVis() {

    areachart = new StackedAreaChart("area", allData.layers);
    timeline = new Timeline("timeline", allData.years);

}

function brushed() {

    // Get the extent of the current brush
    var selectionRange = d3.brushSelection(d3.select(".brush").node());

    // Convert the extent into the corresponding domain values
    var selectionDomain = selectionRange.map(timeline.x.invert);

    areachart.x.domain(selectionDomain);
    areachart.wrangleData();

}
