//The playable area width and height
//  If set to zero then it will match the whole canvas
var WIDTH = 400;
var HEIGHT = 400;
//Variable for the starting elements and stuff
//  Used to define if the game is running and
//  What key to start
var start;
//The canvas
var can;
//The drawing context
var ctx;
//Array the paddles in the game
var paddles = [];
//Array the balls in the game
var balls = [];
//Temp variables for loops and stuff
var p, b;
//What keys are/aren't being pressed
var keys = [];
//The background type
var bgType = 0;
//Scores for each ball/player
var scores = [];

//Fills the keys and scores array with data
function populateArrs() {
    //Sets all keys to not being pressed, so false
    for(var i = 0; i < 128; i++) {
        keys[i] = false;
    }
    //Sets all scores to zero
    for(var j = 0; j < balls.length + paddles.length; j++) {
        scores[j] = 0;
    }
}

//This function renders the background based on the type
function drawBackground() {
    switch(bgType) {
    case 0: //No background
        break;
    }
}

function drawPaddles() {
    for(var i = 0; i < paddles.length; i++) {
        p = paddles[i];
        switch(p.t) {
        case 0:
            ctx.fillRect(p.x, p.y, p.w, p.h);
            break;
        }
    }
}

function calcNewBallPosition(bi) {
    b = balls[bi];
    b.x = b.x + b.vx;
    b.y = b.y + b.vy;
    if(b.y + b.h >= HEIGHT || b.y <= 0) {
        b.vy = -b.vy;
        if(b.y <= 0) {
            b.y = 0;
        }
        else {
            b.y = HEIGHT - b.h;
        }
    }
    if(b.x + b.w >= WIDTH || b.x <= 0) {
        b.vx = -b.vx;
        scores[bi] = scores[bi] + 1;
         if(b.x <= 0) {
            b.x = 0;
        }
        else {
            b.x = WIDTH - b.w;
        }
    }
    for(var i = 0; i < paddles.length; i++) {
        p = paddles[i];
        if((b.x >= p.x && b.x <= p.x + p.w) || (b.x < p.x && b.x + b.w >= p.x)) {
            if((b.y >= p.y && b.y <= p.y + p.h) || (b.y < p.y && b.y + b.h >= p.y)) {
                b.vx = -b.vx;
                scores[i + balls.length] = scores[i + balls.length] + 1;
                if(p.x > WIDTH / 2) {
                    b.x = p.x - b.w;
                }
                else {
                    b.x = p.x + p.w;
                }
            }
        }
    }
    return b;
}

function drawBalls() {
    for(var i = 0; i < balls.length; i++) {
        b = balls[i];
        switch(b.t) {
        case 0: //SQUARE
            ctx.fillRect(b.x, b.y, b.w, b.h);
            break;
        case 1: //CIRCLE - WIP
            ctx.arc(b.x, b.y, (b.w + b.h) / 4, 0, 2 * Math.PI);
        }
    }
}

function drawScore() {
    ctx.fillRect(0, HEIGHT, WIDTH, 1);
    ctx.fillRect(WIDTH, 0, 1, HEIGHT);
    ctx.fillText("Score: ", 20, HEIGHT + 22);
    var flavour;
    for(var i = 0; i < scores.length; i++) {
        flavour = "null";
        if(i < balls.length) {
            flavour = balls[i].n;
            flavour = flavour + ": ";
        }
        else if(i < paddles.length + balls.length) {
            flavour = paddles[i - balls.length].n;
            flavour = flavour + ": ";
        }
        ctx.fillText(flavour + scores[i], 40, HEIGHT + (22 * (i + 2)));
    }
}

function doKeyDown(e) {
    keys[e.keyCode] = true;
    if(e.keyCode == start.key) {
        start.start = true;
    }
}

function doKeyRelease(e) {
    keys[e.keyCode] = false;
}

function clear() {
	ctx.clearRect(0, 0, can.width, can.height);
}

function init() {
	can = document.getElementById("canvas");
  	ctx = can.getContext("2d");
    ctx.font="20px ComicSansMS";
    if(WIDTH === 0 || HEIGHT === 0) {
        WIDTH = can.width;
        HEIGHT = can.height;
    }
    start = {
        start: false, key: 32
    };
    /*
    x = x-pos, y = y-pos, w = width, h = height, t = type,
        up = keycode up movement, down = keycode down movement
        ms = move-speed, n = name
    */
    paddles[0] = {
        x: 20, y: HEIGHT / 2 - 50, w: 20, h: 100, t: 0,
        up: 87, down: 83, ms: 5, n: "Left Paddle"
    };
    paddles[1] = {
        x: WIDTH - 40, y: HEIGHT / 2 - 50, w: 20, h: 100, t: 0,
        up: 79, down: 76, ms: 5, n: "Right Paddle"
    };
    /*
    x = x-pos, y = y-pos, w = width, h = height, t = type,
        vx = velocity-x, vy = velocity-y,
        up = keycode up movement, down = keycode down movement
        ms = move-speed, sc = speed-cap, n = name;
    */
    balls[0] = {
        x: WIDTH / 2 - 10, y: HEIGHT / 2 - 10, w: 20, h: 20, t: 0, vx: 5, vy: 5,
        up: 38, down: 40, ms: 1, sc: 10, n: "Ball"
    };
    
    populateArrs();
    
    setInterval(tick, 30);
  	return setInterval(draw, 30);
}

function draw() {
	clear();
    drawBackground();
    drawPaddles();
    drawBalls();
    drawScore();
}

function tick() {
    if(start.start) {
        for(var e = 0; e < balls.length; e++) {
            calcNewBallPosition(e);
        }
        for(var k = 0; k < keys.length; k++) {
            if(keys[k]) {
                for(var i = 0; i < paddles.length; i++) {
                    p = paddles[i];
                    if(k == p.up) {
                        p.y = p.y - p.ms;
                        if(p.y < 0) {
                            p.y = 0;
                        }
                    }
                    if(k == p.down) {
                        p.y = p.y + p.ms;
                        if(p.y + p.h > HEIGHT) {
                            p.y = HEIGHT - p.h;
                        }
                    }
                }
                
                for(var j = 0; j < balls.length; j++) {
                    b = balls[j];
                    if(k == b.up) {
                        b.vy = b.vy - b.ms;
                        if(b.vy < -b.sc) {
                            b.vy = -b.sc;
                        }
                    }
                    if(k == b.down) {
                        b.vy = b.vy + b.ms;
                        if(b.vy > b.sc) {
                            b.vy = b.sc;
                        }
                    }
                }
            }
        }
    }
}

init();
draw();
tick();
window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyRelease, true);