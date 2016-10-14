// Bong

//===============================================
//              ENGINE STUFF
//        ( Deep engine functionality )
//===============================================

// How often should the game sample information?
var TICK_RATE = 60.0;
// if( window.device == devices.CONSOLE ) { TICK_RATE = 15.0 }

// If you don't know what these two variables do,
// this game was made for you.
var WIDTH = 400;
var HEIGHT = 400;
// Get the canvas from the page.
var canvas = document.getElementById('bongZone');
// Set the size of the canvas.
canvas.width = WIDTH;
canvas.height = HEIGHT;
// Get the (d)rawing conte(x)t.
var dx = canvas.getContext('2d');

// Request an update from the window. Run 'onTick()' when we DO get an update.
var frameUpdate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (onTick) {
	window.setTimeout(onTick, 1000.0 / TICK_RATE);
};

// This is where we will store our key states.
// This is better than directly getting the
// key state because it uses booleans which
// makes the input BUTTERY SMOOTH!
var keys = {};

// If a key is down, add it to the keys object so we can
// sample it in our input loop.
window.addEventListener('keydown', function (event) {
    keys[event.keyCode] = true;
});

// When the key is up, delete the keyCode from the keys object
// to keep the input loop speedy for those console players.
window.addEventListener('keyup', function (event) {
	delete keys[event.keyCode];
});

// Time of our last tick.
var lastTick = Date.now();

// Calculate our delta, and pass it to our render and update functions.
function tick() {
	var now = Date.now();
	var delta = (now - lastTick) * 0.01;
	lastTick = now;
	update(delta);
	render(delta);
	frameUpdate(tick);
}
// Start the loop.
frameUpdate(tick);

// Linear Interpolation
function lerp(from, to, fac) 
{
    return ((from * (1.0 - fac)) + (to * fac));
}

//===============================================
//             GAME CONTENT STUFF
//         ( Base objects for the game )
//===============================================

// Game Objects
var gameObjects = [];

// Ball object
function Ball(x, y, size) {
	// Position XY
	this.x = x;
	this.y = y;

	// Color and Diameter.
	this.size = size;
	this.color = '#000';

	// Velocity XY
	this.velX = (Math.random() * 2 - 1) * 10;
	this.velY = (Math.random() * 2 - 1) * 10;
	// Air resistance (Should the velocity slow over time? By how much?)
	this.resistance = 5;

	// Five Seconds til DEATH.
	this.lifetime = 5 * 1000;
}

// Update Ball Object
Ball.prototype.update = function(delta) {

	// When we multiply a varialbe (resistance, for example) by the delta
	// It's basically that number of units per second.
	// Make sesne?


	this.x += this.velX * delta;
	this.y += this.velY * delta;

	// IS THIS WORKING!?!?!?!
	lerp(this.velX, 0.0, this.resistance * delta);
	lerp(this.velY, 0.0, this.resistance * delta);

	this.lifetime -= delta;

	if(this.lifetime <= 0)
		gameObjects.splice(gameObjects.indexOf(this), 1);
};

// Render Ball Object
Ball.prototype.render = function(delta) {
	dx.fillStyle = this.color;
	dx.beginPath();
    dx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI, false);
    dx.fill();
    dx.lineWidth = 1;
    dx.strokeStyle = '#FF0000';
    dx.stroke();
};

//===============================================
//              GAME STUFF
// ( Actual game logic and adding of objects )
//===============================================


function update(delta) {
	for (var key in keys) {
        key = Number(key);
        if (key == 37) {
        	// LEFT ARROW
        	gameObjects.push(new Ball(200, 200, 10));
        }
    }
    
    // Update all game objects.
    gameObjects.forEach(function(gameObject){
    	gameObject.update(delta);
    });
}

function render(delta) {
	// Clear the canvas.
	dx.clearRect(0, 0, WIDTH, HEIGHT);
    // Draw delta time.
    dx.fillStyle = '#000000';
	dx.font = '25px Arial';
	dx.fillText('Delta: ' + (delta * 100) + 'ms', 10, 50);

	// Render all game objects.
	gameObjects.forEach(function(gameObject){
    	gameObject.render(delta);
    });
}


// TODO:
//- Make "master" game object with Update, Render, and auto-remove logic.
//- Figure out the whole velocity thing with the ball
//- Better input sampling (the key array is good, I'm talking about the loop part in update() )
//- Add DLC. Lots and lots of DLC.
