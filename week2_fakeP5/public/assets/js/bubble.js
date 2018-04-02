class Bubble {

  constructor(x, y) {
    this.x = x;
    this.col = color(136, 119, 236);
    this.path = [];  
    this.y = y; 
	  this.r = 8;
		this.index = 0;
	}
  
	display() {
  	fill(this.col);
  	ellipse(this.x, this.y, this.r*2, this.r*2 );
	}
   
  shadows() {  
    noFill();
    for (var i = 0; i < this.path.length; i++) {
      var pos = this.path[i];
      //draw new circles
      ellipse(pos.x, pos.y, i*1.2, i*1.2);  	
    }  	
  }
  
   color() {
    this.col = color(random(255));
  }

  
  update() {
    this.x += random(-2, 2);
    this.y += random(-2, 2);   
    for (var i = 0; i < this.path.length; i++) {
      //shadows move 
      this.path[i].x += random(-3, 3);
      this.path[i].y += random(-3, 3);
    }
		var v = createVector(this.x, this.y);
		this.path[this.index] = v;
		this.index = (this.index + 1) % 70;
  }
  

}