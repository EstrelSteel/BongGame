var WIDTH = 400;
var HEIGHT = 400;
var can;
var ctx;
var x = 200;
var y = 200;
var xVel = 5;
var yVel = 5;
var w = 20;
var h = 20;
var start = true;
var xP = 20;
var yP = 160;
var wP = 20;
var hP = 80;
var score = 0;

function doKeyDown(e) {
	switch(e.keyCode) {
	case 87: //W
		yVel = yVel - 2;
		break;
	case 83: //S
		yVel = yVel + 2;
		break;
	case 38: //UP ARROW
		yP = yP - 10;
		break;
	case 40: //DOWN ARROW
		yP = yP + 10;
		break;
	case 32: //SPACE
		start = true;
		break;
	}
}

function clear() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function init() {
	can = document.getElementById("canvas");
  	ctx = can.getContext("2d");
  	WIDTH = can.width;
  	HEIGHT = can.height;
  	return setInterval(draw, 30);
}

function draw() {
	clear();
	ctx.fillRect(x, y, w, h);
	ctx.fillRect(xP, yP, wP, hP);
	ctx.fillRect(WIDTH - (xP + wP), yP, wP, hP);
	if(start) {
		ctx.fillText("SCORE: " + score, 20, 20);
		x = x + xVel;
		y = y + yVel;
		
		if(y < 0 || y > HEIGHT) {
			yVel = yVel * -1;
		}
		if((x + w > xP && x < xP + wP) && (y + h > yP && y < yP + hP)) {
			yVel = 5;
			xVel = xVel * -1;
			score = score + 1;
		}
		//		 40	   > 400 - (20 + 20)
		else if((x + w > WIDTH - (xP + wP) && x < WIDTH - wP) && (y + h > yP && y < yP + hP)) {
			yVel = -5;
			xVel = xVel * -1;
			score = score + 1;
		}
		
		if(x < -20 || x > WIDTH + 20) {
			start = true;
			x = 200;
			y = 200;
			xVel = 5;
			yVel = 5;
			yP = 160;
			score = 0;
		}
		
	}
	else {
		ctx.fillText("BONG 3.0a", 20, 20);
	}
}

init();
draw();
window.addEventListener('keydown', doKeyDown, true);