// Bong - Pong, but YOU'RE the ball. (So much power!!!)

//===============================================
//              ENGINE STUFF
//        ( Deep engine functionality )
//===============================================

// How often should the game sample information?
var TICK_RATE = 60.0;

// If you don't know what these two variables do,
// this game was made for you.
var WIDTH = 800;
var HEIGHT = 600;
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

// Store our keys in an array for SMOOTH INPUT.
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
// Publicly accessible delta time (initialized to our tickrate until the loop makes it accurate.)
var gameDelta = 1000.0 / TICK_RATE;


// Created this so we could get the delta from anywhere (specifically in isAlive(); )
function getDelta() {
    return gameDelta;
}

// Calculate our delta, and pass it to our render and update functions.
function tick() {
    // Set time to RIGHT NOW
	var now = Date.now();
    // The delta - How much time has passed since our last tick?
	var delta = (now - lastTick) * 0.01;
    // Update the public delta.
    gameDelta = delta;
    // Reset the "lastTick" for the next tick delta.
	lastTick = now;
    // Update the game. 
	update(delta);
    // Render the game.
	render(delta);
    // Call this function again for an infinite loop of gameplay.
	frameUpdate(tick);
}

// Start the loop.
frameUpdate(tick);

// Linear Interpolation Function
// Makes transitioning between numbers super smooth, I promise.
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
	this.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);

	// Velocity XY
	this.velX = (Math.random() * 2 - 1) * size;
	this.velY = (Math.random() * 2 - 1) * size;
	this.resistance = 5;

	this.lifetime = size;
}

// Update Ball Object
Ball.prototype.update = function(delta) {

    // Add velocity to the position.
	this.x += this.velX * delta;
	this.y += this.velY * delta;

    // Slow the object down over time.
	lerp(this.velX, 0.0, this.resistance * delta);
	lerp(this.velY, 0.0, this.resistance * delta);

    // Wall collision detection.
    if(this.x < (this.size / 2) | this.x > WIDTH - (this.size / 2)) {
        this.velX = -this.velX;
    }
    if(this.y < (this.size / 2) | this.y > HEIGHT - (this.size / 2)) {
        this.velY = -this.velY;
    }

    // Die after some time.
	this.lifetime -= delta;

    // Set the size to the lifetime so the object gets smaller and appears to fade away.
    this.size = this.lifetime;
    // Size needs to be above zero for rendering, let's keep it at 0.1
    if(this.size <= 0.1)
        this.size = 0.1;

};

// Render Ball Object
Ball.prototype.render = function(delta) {
    // In some cases, our object has already died and still got rendered.
    // Ignore it if it's already dead.
    if(this.lifetime <= 0)
        return;

    // Set the color.
	dx.fillStyle = this.color;
    // Begin the shape.
	dx.beginPath();
    // Make circle. A nice circle, that is.
    dx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI, false);
    // Fill the circle with the color.
    dx.fill();
    // Stroke size.
    dx.lineWidth = 1;
    // Stroke color.
    dx.strokeStyle = '#000';
    // Draw Stroke
    dx.stroke();
    // End the shape.
    dx.closePath();
};

// Called every frame by the gameObjects array.
// Used to update/render objects, and filter out dead ones to keep things speedy.
function isAlive(gameObject) {
    // Get delta for our update/render functions.
    var delta = getDelta();
    // Update/Render
    gameObject.update(delta);
    gameObject.render(delta);
    // Keep this object in the array if it's still alive.
    return gameObject.lifetime > 0;
}

//===============================================
//              GAME STUFF
// ( Actual game logic and adding of objects )
//===============================================

// Boolean for clearing the draw buffer.
var doClear = true;

function update(delta) {

    // Make sure we always clear the screen unless the inputs below say otherwise.
    doClear = true;

	for (var key in keys) {
        key = Number(key);

        // LEFT ARROW - Add balls with a size based on our canvas size (SCALABILITY, YAH!)
        if (key == 37)
        	gameObjects.push(new Ball( (WIDTH / 2) + (((Math.random() * 2) - 1) * (WIDTH / 10)), (HEIGHT / 2) + (((Math.random() * 2) - 1) * (HEIGHT / 10)), (WIDTH / HEIGHT) * 15));
        // SSSPPPAAAAACCCEEEEE - Keep the last frame's color on the screen for a really interesting effect.
        if (key == 32)
            doClear = false;
    }
}

// Timer for the Delta
var averageTrigger = 0;
// Delta that's updated intermittently.
var averageDelta = getDelta();

function render(delta) {
	// Clear the canvas.
    if(doClear)
	   dx.clearRect(0, 0, WIDTH, HEIGHT);

    // Render & Update all game objects.

    // This is in render(); because it really doesn't make sense performance wise to
    // parse the loop twice unless we were rendering more than we were updating, which isn't the case for our loop.

    // I used "filter" so we filter out all the dead objects.
    // It's faster than before, somehow.
    gameObjects = gameObjects.filter(isAlive);

    // Add to our average timer.
    averageTrigger += delta;
    // Update the on-screen Delta timer variable every 5th tick.
    // This is so our delta readings aren't flickering all over the place. I hate that.
    if(averageTrigger > delta * 5) {
        averageTrigger = 0;
        averageDelta = delta;
    }

    // Text color.
    dx.fillStyle = '#000000';
    // Font and size.
	dx.font = '25px Arial';
    // Clear a space for the delta and object count text so we can still read them
    // even if the draw buffer isn't being cleared.
    dx.clearRect(0,0, 175, 100);
    // Draw delta information.
	dx.fillText('Delta: ' + (averageDelta * 100) + 'ms', 10, 50);
    // Draw object information.
    dx.fillText('Objects: ' + gameObjects.length, 10, 75);

}
