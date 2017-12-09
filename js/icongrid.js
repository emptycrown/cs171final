

/*
 * StackedAreaChart - Object constructor function
 * @param _parentElement  -- the HTML element in which to draw the visualization
 * @param _data           -- the
 */

TreeGrid = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = {}; // see data wrangling

    this.initVis();
};


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

TreeGrid.prototype.initVis = function(){
    var vis = this;

    var dateSlider = document.getElementById(vis.parentElement);
    function timestamp(str){
        return +(new Date(str).getYear())+1900;   
    }
    noUiSlider.create(dateSlider, {
    // Create two timestamps to define a range.
        range: {
            min: 1990,
            max: 2015
        },
        tooltips: true,
        step: 1,
        format: {
          to: function ( value ) {
            return value;
          },
          from: function ( value ) {
            return value.replace(',-', '');
          }
        },

    // Two more timestamps indicate the handle starting positions.
        start: 1990,

    });

    dateSlider.noUiSlider.on('update', function( values, handle ){
      var year = values[handle];
      var frac = (vis.displayData[year] - vis.displayData[2015])*0.55 / (vis.displayData[1990] - vis.displayData[2015]) + 0.45;
      vis.updateVis(frac);
    });


    for(var year=1990; year<=2015; year++) {
      vis.displayData[year] = vis.data.map(function(d) {return d[year]}).reduce(function(a,b) {return a+b}, 0);
    }
    
    $("#play-icongrid").click(playVis);

    function playVis() {
      var id = window.setInterval(moveSlider, 200);
      var yr = 1990;
      function moveSlider() {
        if(yr > 2015) {
          window.clearInterval(id);
        } else {
          dateSlider.noUiSlider.set(yr);
          yr++;
        }
      }
    }

    vis.wrangleData();
};


/*
 * Data wrangling
 */

TreeGrid.prototype.wrangleData = function(){
    var vis = this;

    // Update the visualization
    vis.updateVis(100);
};



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

TreeGrid.prototype.updateVis = function(frac){
    var vis = this;

    $("#trees").empty();

    var n = 60;
    for(var i=0; i<n; i++) {
      if(i < Math.floor(frac * n)) {
        $("#trees").append(
          $("<i class='fa fa-tree tree-filled'></i>")
        );
      } else {
        $("#trees").append(
          $("<i class='fa fa-tree tree-blank'></i>")
        );
      }
      
    }
};


