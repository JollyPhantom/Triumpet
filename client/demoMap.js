$(document).ready(function(){

  var roomHeight = 36;
  var roomWidth = 20;
  var width = $(document).width();
  var height = $(document).height();
  var scale = Math.max(height/roomHeight, width/roomWidth);

  var feetToPixel = function(ft){
    var foot = width/scale;
    return ft*foot;
  }

  var coorsToString = function(coors, convertToPixel){
    var result = '';

    for(var i = 0; i < coors.length; i++){
      var x = coors[i][0];
      var y = coors[i][1];
      if(convertToPixel){
        x = feetToPixel(x);
        y = feetToPixel(y);
      }
      result = result+x+','+y+' ';
    }

    return result;
  }

  var createShelves = function(x,y,w,h){
    return {
      x:feetToPixel(x),
      y:feetToPixel(y),
      width:feetToPixel(w),
      height:feetToPixel(h)
    }
  }


  var svg = d3.select('#map').append('svg')
              .attr('width',width)
              .attr('height',height);


  var floorplan = svg.append('polygon')
                    .attr('points',coorsToString([
                      [0,0],
                      [20,0],
                      [20,36],
                      [0,36]
                      ],true))
                    .attr('fill','white')
                    .attr('stroke','blue');

  var shelf1 = createShelves(5,0,15,1);
  var shelf2 = createShelves(19,0,1,36);
  var shelf3 = createShelves(5,35,15,1);
  var shelf4 = createShelves(0,9,1,18);
  var shelf5 = createShelves(5,17,10,1);
  var shelf6 = createShelves(5,18,10,1);


  var shelves = [shelf1, shelf2, shelf3, shelf4, shelf5, shelf6];

  svg.selectAll('rect').data(shelves)
    .enter().append('rect')
    .attr('x',function(d){return d.x})
    .attr('y',function(d){return d.y})
    .attr('width',function(d){return d.width})
    .attr('height',function(d){return d.height})
    .attr('stroke','black')
    .attr('fill','red')



});