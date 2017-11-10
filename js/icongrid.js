var dateSlider = document.getElementById('slider');
function timestamp(str){
    return new Date(str).getTime();   
}
noUiSlider.create(dateSlider, {
// Create two timestamps to define a range.
    range: {
        min: timestamp('2010'),
        max: timestamp('2016')
    },
    tooltips: true,
// Steps of one week
    step: 7 * 24 * 60 * 60 * 1000,

// Two more timestamps indicate the handle starting positions.
    start: timestamp('2011'),

});

var n = 70;
for(var i=0; i<n; i++) {
  var frac = 0.33;
  if(i < Math.floor(frac * n)) {
    $("#icongrid").append(
      $("<i class='fa fa-tree tree-filled'></i>")
    );
  } else {
    $("#icongrid").append(
      $("<i class='fa fa-tree tree-blank'></i>")
    );
  }
  
}
  