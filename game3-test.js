var WIDTH;
var HEIGHT;
var start;
var can;
var ctx;
var paddles = [];
var balls = [];
var p, b;
var keys = [];
var bgType = 0;

function populateKeys() {
    for(var i = 0; i < 128; i++) {
        keys[i] = false;
    }
}

function drawBackground() {
    switch(bgType) {
    case 0:
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

function calcNewBallPosition(b) {
    b.x = b.x + b.vx;
    b.y = b.y + b.vy;
    if(b.y + b.h >= HEIGHT || b.y <= 0) {
        b.vy = -b.vy;
    }
    if(b.x + b.w >= WIDTH || b.x <= 0) {
        b.vx = -b.vx;
    }
    return b;
}

function drawBalls() {
    for(var i = 0; i < balls.length; i++) {
        b = balls[i];
        if(start.start) {
            b = calcNewBallPosition(b);
        }
        switch(b.t) {
        case 0:
            ctx.fillRect(b.x, b.y, b.w, b.h);
            break;
        }
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
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function init() {
	can = document.getElementById("canvas");
  	ctx = can.getContext("2d");
  	WIDTH = can.width;
  	HEIGHT = can.height;
    start = {
        start: false, key: 32
    };
    populateKeys();
    /*
    x = x-pos, y = y-pos, w = width, h = height, t = type,
        up = keycode up movement, down = keycode down movement
        ms = move-speed
    */
    paddles[0] = {
        x: 20, y: HEIGHT / 2 - 50, w: 20, h: 100, t: 0,
        up: 87, down: 83, ms: 5
    };
    paddles[1] = {
        x: WIDTH - 40, y: HEIGHT / 2 - 50, w: 20, h: 100, t: 0,
        up: 79, down: 76, ms: 5
    };
    /*
    x = x-pos, y = y-pos, w = width, h = height, t = type,
        vx = velocity-x, vy = velocity-y,
        up = keycode up movement, down = keycode down movement
        ms = move-speed, sc = speed-cap
    */
    balls[0] = {
        x: WIDTH / 2 - 10, y: HEIGHT / 2 - 10, w: 20, h: 20, t: 0, vx: 5, vy: 5,
        up: 38, down: 40, ms: 1, sc: 10
    };
    setInterval(tick, 30);
  	return setInterval(draw, 30);
}

function draw() {
	clear();
    drawBackground();
    drawPaddles();
    drawBalls();
}

function tick() {
    if(start.start) {
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