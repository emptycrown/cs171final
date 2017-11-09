
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

StationMap = function(_parentElement, _data) {

    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
}


/*
 *  Initialize station map
 */

StationMap.prototype.initVis = function() {
    var vis = this;
    var map = L.map(vis.parentElement).setView([42.378774, -71.117303], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var popupContent = "<strong>Maxwell Dworkin</strong><br/>";
    popupContent += "Harvard University";
// Create a marker and bind a popup with a particular HTML content
    L.marker([42.378774, -71.117303])
        .bindPopup(popupContent)
        .addTo(map);

    this.data.forEach(function(d) {
// Create a marker and bind a popup with a particular HTML content
        L.marker([d.lat, d.long])
            .bindPopup(d.name)
            .addTo(map);
    });

    $.getJSON('js/MBTA-Lines.json', function(lines) {
        console.log(lines);
        lines.features.forEach(function(f) {
            if(f.geometry.coordinates) {
                L.polyline(
                    f.geometry.coordinates.map(function(c) {return [c[1],c[0]]}),
                    {
                        color: f.properties.LINE,
                        opacity: 0.6,
                        weight: 10
                    }
                ).addTo(map);
            }
        })
    });



    vis.wrangleData();
}


/*
 *  Data wrangling
 */

StationMap.prototype.wrangleData = function() {
    var vis = this;

    // Currently no data wrangling/filtering needed
    // vis.displayData = vis.data;

    // Update the visualization
    vis.updateVis();

}


/*
 *  The drawing function
 */

StationMap.prototype.updateVis = function() {

}
