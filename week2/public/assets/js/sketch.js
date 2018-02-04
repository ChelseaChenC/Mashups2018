let bubbles = [];
let canvas;
// let img;

// let weather;

// let api = 'http://api.openweathermap.org/data/2.5/weather?q=';
// let apiKey = 'de466b967a32811e5f43df6e178f8bae';
// let units = '&units=metric';
// let input;



function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");

  for (var i = 0; i < 1; i++) {
    bubbles[i] = new Bubble(random(width), random(height));
  }
  stroke(136, 119, 236);

  // let button = select("#submit");
  // button.mousePressed(weatherAsk);

  // input = select("#city");
}


//generate balls by mousePressed
function mousePressed() {
  bubbles.push(new Bubble(mouseX, mouseY));
}


//reduce balls by keyPressed
function keyPressed() {
  bubbles.splice(0, 1);
}

function draw() {
  //background pics
  background(255);
  // image(img, 100, 100, 100, 100);


  //fuzzy balls
  for (var i = 0; i < bubbles.length; i++) {
    bubbles[i].display();
    bubbles[i].shadows();
    bubbles[i].color();
    bubbles[i].update();
  }

  //  if(weather){
  //   let humidity = weather.main.humidity;
  //   let temp = weather.main.temp; 
  //   ellipse(100, 100, temp, temp);
  //   ellipse(300, 100, humidity, humidity);
  // }
}

// function weatherAsk() {
//   let url = api + "Brighton" + apiKey + units;
//   loadJSON(url, gotData);
// }


// function gotData(data) {
//   weather = data;
// }