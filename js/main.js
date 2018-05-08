$(document).ready(function() {
    
  var getMax = function(){
    return $(document).height() - $(window).height();
  }
    
  var getValue = function(){
    return $(window).scrollTop();
  }
    
  if ('max' in document.createElement('progress')) {
    // Browser supports progress element
    var progressBar = $('progress');
        
    // Set the Max attr for the first time
    progressBar.attr({ max: getMax() });

    $(document).on('scroll', function(){
      // On scroll only Value attr needs to be calculated
      progressBar.attr({ value: getValue() });
    });
      
    $(window).resize(function(){
      // On resize, both Max/Value attr needs to be calculated
      progressBar.attr({ max: getMax(), value: getValue() });
    }); 
  
  } else {

    var progressBar = $('.progress-bar'), 
        max = getMax(), 
        value, width;
        
    var getWidth = function() {
      // Calculate width in percentage
      value = getValue();            
      width = (value/max) * 100;
      width = width + '%';
      return width;
    }
        
    var setWidth = function(){
      progressBar.css({ width: getWidth() });
    }
        
    $(document).on('scroll', setWidth);
    $(window).on('resize', function(){
      // Need to reset the Max attr
      max = getMax();
      setWidth();
    });
  }
});

$(document).ready(function() {
    $('select').material_select();
});

$("#enter-button").click(function() {
    $('html, body').animate({
        scrollTop: $("#section1").offset().top
    }, 500);
});

$("#more-button").click(function() {
    //open in new tab
    window.open("https://www.worldwildlife.org/threats/deforestation", "_blank");
});

$("#learn-button").click(function() {
    //open in new tab
    window.open("https://link-springer-com.ezp-prod1.hul.harvard.edu/article/10.1007/s00267-003-0230-z", "_blank");
});

// $("#donate-button").click(function() {
//     //open in new tab
//     window.open("https://www.charitynavigator.org/index.cfm?bay=search.results&cgid=4&cuid=11", "_blank");
// });

AOS.init({
    duration: 1200,
})

$(document).keydown(function(e) {
    if (e.which == 32) {
        return false;
    }
});

//animate panimated panes
var container = document.getElementById('section7');
var windowHeight = window.innerHeight;
var windowWidth = window.innerWidth;
var scrollArea = 1000 - windowHeight;
var panelLeft = document.getElementsByClassName('animated-panel')[0];
var panelRight = document.getElementsByClassName('animated-panel')[1];
var panelCenter = document.getElementsByClassName('animated-panel')[2];

// update position of square 1 and square 2 when scroll event fires.
window.addEventListener('scroll', function() {
  var scrollTop = window.pageYOffset || window.scrollTop;
  var scrollPercent = 1 - Math.min(Math.max(container.getBoundingClientRect().top, 0), windowHeight) / windowHeight;
  
  panelLeft.style.left = -window.innerWidth*0.3 + scrollPercent*window.innerWidth*0.4 + 'px';
  panelRight.style.right = -window.innerWidth*0.3 + scrollPercent*window.innerWidth*0.4 + 'px';
});







//initialize visualizations
var youDrawItVis = new youDrawItVis("youDrawItvis", "data/world.csv");
var orderedVis = new OrderedVis("Orderedvis", "data/country_rates.csv");

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
                        d[column] = parseFloat(d[column]);
                    } else if(d.hasOwnProperty(column) && column == "Year") {
                        d[column] = parseDate(d[column].toString());
                    }
                }
            });

            allData.years.forEach(function(d){
                d.Total = parseFloat(d.Total) - 120;
                d.Year = parseDate(d.Year.toString());
            });

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

    //Tree grid
    var treeGrid = new TreeGrid("slider", all);
    //Scatter plot
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