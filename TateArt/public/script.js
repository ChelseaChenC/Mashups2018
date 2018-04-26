d3.jsonp = function (url, callback) {
  function rand() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      c = '', i = -1;
    while (++i < 15) c += chars.charAt(Math.floor(Math.random() * 52));
    return c;
  }

  function create(url) {
    var e = url.match(/callback=d3.jsonp.(\w+)/),
      c = e ? e[1] : rand();
    d3.jsonp[c] = function(data) {
      callback(data);
      delete d3.jsonp[c];
      script.remove();
    };
    return 'd3.jsonp.' + c;
  }

  var cb = create(url),
    script = d3.select('head')
    .append('script')
    .attr('type', 'text/javascript')
    .attr('src', url.replace(/(\{|%7B)callback(\{|%7D)/, cb));
};

function formatArtistName(name) {
  const nameParts = name.split(", ")
  nameParts.unshift(nameParts.splice(1,1))
  return nameParts.join(" ")
}



d3.csv("artist.csv", function(d){
  return {
    artist: formatArtistName(d.name),//.split(/,(.+)/).reverse().join(" "),
    gender: d.gender,
    year: + d.year,
    place: d.place.replace(/,/, '<br/>'),
    image: d.image,
    tatePage: d.url
  }
},  function(error, data){
  if (error) throw error;
    // console.log(data);

    var width = 6000;
    var height = window.innerHeight;
    var padding = 20;

    var margin = {
        top: 5,
        right: 80,
        bottom: 30,
        left: 10
      };

    var counters = {};

    data.forEach((item) => {
      if (item.year in counters) {
        counters[item.year]++;
      } else {
        counters[item.year] = 1;
      }
      item.Y = counters[item.year];
    });

    data.forEach((item) => {
      item.Y -= counters[item.year]/2;
    });
    var textElm;

    var yScale = d3.scaleLinear()
                   .domain(d3.extent(data, d=> {return d.Y;}))
                   .range ([height-100, 10]);


    var xScale = d3.scaleLinear()
                   .domain(d3.extent(data, d=> {return d.year;}))
                   .range([10, width-10]);

    var labelScale = d3.scaleLinear()
                       .domain([10, width-10])
                       .range(d3.extent(data, d=> {return d.year;}))

    var mouseG = d3.select("svg").append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "grey")
      .style("stroke-width", "3px")
      .style("opacity", "1");


    var mouseLabel = mouseG.append('svg:g');
    mouseLabel
      .classed("mouse-label", true)
      .attr('transform', 'translate(0, 5)');

    mouseLabel.append('svg:rect')
      .attr('fill', 'grey')
      .attr('y', '-19.5')
      .attr('width', '42')
      .attr('height', '30');

    var mouseLabelText = mouseLabel
      .append("svg:text")
      .attr('x', '2')
      .style('fill', 'white');
      
      
      // .style('background-color', 'pink')
      // .attr('x', 0)
      // ;


    // var yearLabel = mouseG.append("#leftContent")
    //   .classed('yearLabel', true)
    //   .attr('x', 50)
    //   .attr('y', 50);




    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')

      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        mouseLabel.attr('transform', 'translate(' + mouse[0] + ', 50)')
        mouseLabelText.text(Math.round(labelScale(mouse[0])))
      });
      

    var svg = d3.select("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("fill", function(d){
          if (d.gender === "Male"){
            return "#2574A9";
          } else if (d.gender === "Female"){
            return "#E08283";
          } else if(d.gender === "U"){
            return "white"
          } else{
            return "black";
          };
      })
      .attr("r", 4)
      .attr("cy", function(d) {
        return yScale(d.Y);
      })
      .attr("cx", function(d) {
        return xScale(d.year);
      })
      .on('mousemove touchmove', showTooltip)
      .on('mouseout touchend', hideTooltip) 
      .on('click', tooltip2Show)



      function showTooltip(d) {
      var artist = d3.select('#artist');
      artist
          .text(d.artist);

      var birth = d3.select('#birth');
      birth
          .text(d.year);
     

      var thumbnail = d3.select('#thumbnail');
      thumbnail
          .attr("src", d.image);

      var tooltip = d3.select('.tooltip');
          
      tooltip    
          .style('opacity', 1)
          .style('left',  d3.event.pageX + 'px' )
          .style('top',   d3.event.pageY + 'px');



    }

    function hideTooltip(d) {
      d3.select('.tooltip')      
          .style('opacity', 0);
    }

    var wikiURL = 'http://en.wikipedia.org/w/api.php?callback=d3.jsonp.wikipedia&action=opensearch&format=json&search='

    function tooltip2Show(d){

        var artist2 = d3.select('#artist2');
        artist2
            .text(d.artist);
        
        var birth2 = d3.select('#birth2');
        birth2
            .text(d.year);

        var place2 = d3.select('#place2');
        place2
            .html(d.place);    

        var thumbnail2 = d3.select('#thumbnail2');
        thumbnail2
          .attr("src", d.image);    
  
        var tateUrl = d3.select('#tateLink') ;
        tateUrl
            .attr('href', d.tatePage);     
  
        var tooltip2 = d3.select(".tooltip2")
            .style('opacity', 1)
            .style('left',  (d3.event.pageX-200) + 'px' )
            .style('top',   d3.event.pageY + 'px');  

      d3.jsonp(wikiURL + d.artist, function(data) {
        console.log(wikiURL);
        var urlResults = data[3];
        d3.select("#wikiLink")
            .classed("hidden", urlResults.length == 0);
        if (urlResults.length > 0) {
          d3.select("#wikiLink")
              .attr('href', urlResults[0]);
        }
        tooltip2.classed("hidden", false);
      });
      d3.event.stopPropagation();
    } 

    var tooltip2 = d3.select(".tooltip2");
    var tooltipWithContent = d3.selectAll('.tooltip2, .tooltip2 *');


      function equalToEventTarget() {
          return this == d3.event.target;
      }

      d3.select("body").on("click",function(){
          var outside = tooltipWithContent.filter(equalToEventTarget).empty();
          if (outside) {
              tooltip2.classed("hidden", true);
          }
      });
        

    var xAxis = d3.axisBottom(xScale);   
    d3.select("svg")
      .append("g")
      .attr("transform", "translate(0," + (height - 80)+")")
      .call(xAxis)      
      .style("fill", "grey");


    // var yAxis = d3.axisLeft(yScale);   
    // d3.select("svg")
    //   .append("g")
    //   .attr("display", "none")      
    //   .call(yAxis);  


})


$(document).ready(function() {

  /* This is basic - uses default settings */
  
  $("#wikiLink").fancybox({type: 'iframe', 
                           'autoSize': false,
                           'fitToView' : false,
                           width: 800, 
                           height: 500
                           });





  // $("#tateLink").fancybox({type: "iframe",
  //                           'autoSize': false,
  //                           'fitToView': false});


  // $( '#tateLink' ).on( 'click', function() {
  //    window.open( 'http://www.bing.com/', '_blank' );
})
























