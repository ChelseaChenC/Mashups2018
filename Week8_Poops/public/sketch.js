var width = 1200,
    height = 800,
    padding = 2, // separation between nodes
    maxRadius = 5;
// total number of nodes
     // number of distinct clusters
var color = ["#91B496", "#F4B350", "#1E8BC3", "#E08283", "#BE90D4"];
var boroughs = ["Queens", "Brooklyn", "Manhattan", "Staten Island", "Bronx"];

var x = d3.scale.ordinal()
          .domain(d3.range(boroughs.length))
          .rangePoints([0, width], 3);

d3.json("https://data.cityofnewyork.us/resource/r27e-u3sy.json", function(error, data) {
    var nodes = data.map(function(item) {
      var i = boroughs.indexOf(item.borough);
      console.log(i, item.borough);
      return {
        radius: maxRadius,
        color: color[i],
        cx : x(i),
        cy : height/2,
        px: Math.floor(Math.random() * width),
        py: Math.floor(Math.random() * height)
      };
    });

    var svg = d3.select(".container").append("svg")
        .attr("width", width)
        .attr("height", height);

    var circle = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("cx", function(d) { return width/2; })
        .attr("cy", function(d) { return height/2; })
        .attr("r", function(d) { return 50; })
        .style("fill", function(d) { return d.color; });

    d3.select("#poop").on("click", function() {
        circle.transition().duration(4000)
        .attr("r", function(d) { return d.radius;})
        .attr("cx", function(d) { return d.px; })
        .attr("cy", function(d) { return d.py; })
        setTimeout(categorize, 3000);
    });

    function categorize() {
        var force = d3.layout.force()
                    .nodes(nodes)
                    .size([width, height])
                    .gravity(0)
                    .charge(-1)
                    .on("tick", tick)
                    .start();
    }
    function tick(e) {
      circle
          .each(gravity(0.15 * e.alpha))
          .each(collide(0.5))
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }


    // Move nodes toward cluster focus.
    function gravity(alpha) {
      return function(d) {
        d.y += (d.cy - d.y) * alpha;
        d.x += (d.cx - d.x) * alpha;
      };
    }


    // Resolve collisions between nodes.
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        var r = d.radius + maxRadius + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }
});



// function makeD3Chart(){
//   //Clear the container each time a new chart is made
//   $('#container').html('');
// }  


// let count = {
//   "Queens" : 0,
//   "Brooklyn" : 0,
//   "Manhattan" : 0,
//   "StatenIsland" : 0,
//   "Bronx" : 0,
// }


// let url = 'https://data.cityofnewyork.us/resource/r27e-u3sy.json';
// function setup() { 
//   createCanvas(800, 800);
//   loadJSON(url, gotData, errData);
// } 


// function gotData(data) {
//   for(let i=0; i<data.length; i++) {
//     if(data[i].borough == 'Queens') {
//       count.Queens++;
//     }
//     else if(data[i].borough == 'Brooklyn') {
//       count.Brooklyn++;
//     }
//     else if(data[i].borough == 'Manhattan') {
//       count.Manhattan++;
//     }
//     else if(data[i].borough == 'Staten Island') {
//       count.StatenIsland++;
//     }
//     else if(data[i].borough == 'Bronx') {
//       count.Bronx++;
//     }
//   }
//   console.log("Wooohooo");
// }

// // function draw(){
// //   background(0);
// //   ellipse(50, 100, count.Bronx, count.Bronx);
// //   ellipse(100, 200, count.StatenIsland, count.StatenIsland);

// // }

// function errData(data) {
//   console.log("Errrrrrr" + data);
// }

