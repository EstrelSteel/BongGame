var WIDTH;
var HEIGHT;
var can;
var ctx;
var paddles = [];

function drawPaddles() {
    var p;
    for(var i = 0; i < paddles.length; i++) {
        p = paddles[i];
        switch(p.t) {
        case 0:
            ctx.fillRect(p.x, p.y, p.w, p.h);
            break;
        }
    }
}

function doKeyDown(e) {
	switch(e.keyCode) {
	case 87: //W
		break;
	case 83: //S
		break;
	case 38: //UP ARROW
		break;
	case 40: //DOWN ARROW
		break;
	case 32: //SPACE
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
    
    paddles[0] = { x: 20, y: HEIGHT / 2 - 50, w: 20, h: 100, t: 0 };
    paddles[1] = { x: WIDTH - 40, y: HEIGHT / 2 - 50, w: 20, h: 100, t: 0 };
    
  	return setInterval(draw, 30);
}

function draw() {
	clear();
    drawPaddles();
}

init();
draw();
window.addEventListener('keydown', doKeyDown, true);