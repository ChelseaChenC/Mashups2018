let bubbles = [];
let canvas;
var weather;

let api = 'http://api.openweathermap.org/data/2.5/weather?q=';
let apiKey = '&APPID=001b0f58045147663b1ea518d34d88b4';
let units = '&units=metric';

let input;



function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");

  for (var i = 0; i < 1; i++) {
    bubbles[i] = new Bubble(random(width), random(height));
  }
  stroke(136, 119, 236);

  var button = select('#submit');
  button.mousePressed(weatherAsk);

  input = select('#city');
}

function weatherAsk() {
  let url = api + input.value() + apiKey + units;
  loadJSON(url, gotData);
}


function gotData(data) {
  weather = data;
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

   if(weather){
    let humidity = weather.main.humidity;
    ellipse(1200, 500, humidity, humidity);
  }

  // image(img, windowWidth-100, windowHeight-100, 100, 100);
}

function flower(){

}
