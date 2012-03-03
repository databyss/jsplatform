var exitFlag = false;
var lastUpdate = null;
var c, ctx;

var clickDebug =  'Click Debug:';
clickDebug += '<table><tr><td>click</td><td>(0,0)</td></tr>';
clickDebug += '<tr><td>canvas</td><td>(0,0)</td></tr>';
clickDebug += '<tr><td>game</td><td>(0,0)</td></tr>';
clickDebug += '<tr><td>level</td><td>(0,0)</td></tr>';
clickDebug += '<tr><td>map value</td><td>()</td></tr></table>';

// References:
// http://www.hongkiat.com/blog/html5-web-games/
// http://dev.opera.com/articles/view/html-5-canvas-the-basics/
// http://html5.litten.com/moving-shapes-on-the-html5-canvas-with-the-keyboard/
// http://www.webmonkey.com/2010/02/make_oop_classes_in_javascript/
// http://www.phpied.com/3-ways-to-define-a-javascript-class/

var inputKeys = { // defines key codes used for input
	up: 87, // W
	down: 83, // S
	left: 65, // A
	right: 68, // D
	quit: 27 // ESC
}

// color array for drawing blocks
var colors = ['#ffffff', '#00ff00', '#ff0000', '#0000ff']

var level = {
	map: [ // map is inverted so that negative indexes are always down and to the left
			[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
			[3,1,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3],
			[0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
		],
	start: 0,
	scale: 20,
	scaleMinusOne: 19,
	gravity: 30,
	mapWidth: function() {
		return(this.map[0].length * this.scale);
	},
	mapHeight: function() {
		return(this.map.length * this.scale);
	},
	draw: function() {
		for(var y = 0; y < this.map.length; y++) {
			for(var x = 0; x <= this.map[0].length; x++) {
				if(this.map[y][x] !== 0) { // don't draw blank tiles
					// only draw if near canvas
					if((x * this.scale) - this.start >= -this.scale && (x * this.scale) - this.start <= c.width) {
						ctx.strokeStyle  = colors[this.map[y][x]];
						ctx.strokeRect((x * this.scale) - this.start, y * this.scale, this.scaleMinusOne, this.scaleMinusOne);
					}
				}
			}
		}						
	},
	toMapCoord: function(point) {
		var p = {
			x: point.x.valueOf(),
			y: point.y.valueOf()
		}
		
		p.x = Math.floor((p.x + this.start) / this.scale); // map is full length, so get that
		p.y = Math.floor(p.y / this.scale);
		
		// check in bounds
		if(p.x < 0 || p.x >= this.map[0].length || p.y < 0 || p.y >= this.map.length) {
			return null;
		} else {
			return p.valueOf();
		}
	},
	debugOutput: function() {
		var debugOutput = $('#gameDebug').html() + '<br />Level Debug:';
		debugOutput += '<table><tr><td>start</td><td>(' + this.start.toFixed(2) + ')</td></tr>';
		debugOutput += '<tr><td>map width</td><td>(' + this.mapWidth().toFixed(2) + ')</td></tr>';
		debugOutput += '<tr><td>map height</td><td>(' + this.mapHeight().toFixed(2) + ')</td></tr>';
		debugOutput += '<tr><td>scale</td><td>(' + this.scale.toFixed(2) + ')</td></tr>';
		debugOutput += '<tr><td>scaleMinusOne</td><td>(' + this.scaleMinusOne.toFixed(2) + ')</td></tr>';
		debugOutput += '<tr><td>gravity</td><td>(' + this.gravity.toFixed(2) + ')</td></tr></table>';
		$('#gameDebug').html(debugOutput);
	}	
}
		
var corners = {
		topLeft: {
			x: null, y: null
		},
		topRight: {
			x: null, y: null
		},
		botLeft: {
			x: null, y: null
		},
		botRight: {
			x: null, y: null
		},
		mapTopLeft: {
			x: null, y: null
		},
		mapTopRight: {
			x: null, y: null
		},
		mapBotLeft: {
			x: null, y: null
		},
		mapBotRight: {
			x: null, y: null
		},
		fill: function(point) {
			this.topLeft.x = point.x;
			this.topLeft.y = point.y + level.scaleMinusOne;
			
			this.topRight.x = point.x + level.scaleMinusOne;
			this.topRight.y = point.y + level.scaleMinusOne;
			
			this.botLeft.x = point.x;
			this.botLeft.y = point.y;
			
			this.botRight.x = point.x + level.scaleMinusOne;
			this.botRight.y = point.y;
			
			this.mapTopLeft = level.toMapCoord(this.topLeft);
			this.mapTopRight = level.toMapCoord(this.topRight);
			this.mapBotLeft = level.toMapCoord(this.botLeft);
			this.mapBotRight = level.toMapCoord(this.botRight);
			//this.debugOutput();
		},
		debugOutput: function() {
			var debugOutput = $('#gameDebug').html() + '<br />Corner Debug:<table border="1"><tr><td></td><td>x,y</td><td>map x,y</td><td>at map x,y</td></tr>';
			debugOutput += '<tr><td>topLeft</td><td>(' + this.topLeft.x.toFixed(1) + ', ' + this.topLeft.y.toFixed(1) + ')</td><td>(' + this.mapTopLeft.x + ', ' + this.mapTopLeft.y + ')</td><td>' + level.map[this.mapTopLeft.y][this.mapTopLeft.x] + '</td></tr>';
			debugOutput += '<tr><td>topRight</td><td>(' + this.topRight.x.toFixed(1) + ', ' + this.topRight.y.toFixed(1) + ')</td><td>(' + this.mapTopRight.x + ', ' + this.mapTopRight.y + ')</td><td>' + level.map[this.mapTopRight.y][this.mapTopRight.x] + '</td></tr>';
			debugOutput += '<tr><td>botLeft</td><td>(' + this.botLeft.x.toFixed(1) + ', ' + this.botLeft.y.toFixed(1) + ')</td><td>(' + this.mapBotLeft.x + ', ' + this.mapBotLeft.y + ')</td><td>' + level.map[this.mapBotLeft.y][this.mapBotLeft.x] + '</td></tr>';
			debugOutput += '<tr><td>botRight</td><td>(' + this.botRight.x.toFixed(1) + ', ' + this.botRight.y.toFixed(1) + ')</td><td>(' + this.mapBotRight.x + ', ' + this.mapBotRight.y + ')</td><td>' + level.map[this.mapBotRight.y][this.mapBotRight.x] + '</td></tr></table>';
			$('#gameDebug').html(debugOutput);
		}	
	}

// input state object
var input = {
	left: false,
	up: false,
	right: false,
	down: false,
	quit: false,
	debugOutput: function() {
		var debugOutput = $('#gameDebug').html() + '<br />Input Debug:';
		debugOutput += '<table><tr><td>up</td><td>(' + this.up + ')</td></tr>';
		debugOutput += '<tr><td>down</td><td>(' + this.down + ')</td></tr>';
		debugOutput += '<tr><td>left</td><td>(' + this.left + ')</td></tr>';
		debugOutput += '<tr><td>right</td><td>(' + this.right + ')</td></tr>';
		debugOutput += '<tr><td>quit</td><td>(' + this.quit + ')</td></tr></table>';
		$('#gameDebug').html(debugOutput);
	}	
}

var player = {
	pos: { // player position
		x: 50,
		y: 120
	},
	vel: { // player velocity
		x: 0, y: 0 },
	acc: { // player acceleration 
		x: 0, y: 0 }, 
	color: '#000000',
	speed: 3,
	jumpPower: 10,
	friction: 5,
	jumping: true,
	debugOutput: function() {
		var debugOutput = $('#gameDebug').html() + '<br />Player Debug:';
		debugOutput += '<table><tr><td>pos</td><td>(' + this.pos.x.toFixed(2) + ', ' + this.pos.y.toFixed(2) + ')</td></tr>';
		debugOutput += '<tr><td>vel</td><td>(' + this.vel.x.toFixed(2) + ', ' + this.vel.y.toFixed(2) + ')</td></tr>';
		debugOutput += '<tr><td>acc</td><td>(' + this.acc.x.toFixed(2) + ', ' + this.acc.y.toFixed(2) + ')</td></tr></table>';
		$('#gameDebug').html(debugOutput);
	},
	update: function(ms) {
		this.debugOutput();
		// ms is milliseconds since last input
		var msDiff = ms / 1000; // multiplicative factor to handle delays > 1 second
		
		// update velocities
		this.vel.x += 0;
		if(this.jumping) {
			if(!$('#cbSlowMode').is(':checked')) {
				this.vel.y -= level.gravity * msDiff;
			}
		}
		
		// move on x axis, then check for collision resolving to the limits
		if($('#cbSlowMode').is(':checked')) {
			if(input.left) {
				input.left = false;
				this.pos.x -= 1;
			} else if(input.right) {
				input.right = false;
				this.pos.x += 1;
			}
		} else {
			this.pos.x += this.vel.x; // the move
		}
		
		// check left edge of map
		if(this.pos.x < 0) {
			this.pos.x = 0;
		}
		// check the right edge of the map
		if(this.pos.x + level.scale >= level.mapWidth()) {
			this.pos.x = level.mapWidth() - level.scale;
		}

		// load array with player corners with x moved
		corners.fill({x: this.pos.x - level.start, y: this.pos.y});
				
		// check collision
		if(input.right && this.vel.x > 0) {
			// moving right
			if(corners.mapTopRight === null || corners.mapBotRight === null) {
				console.log('invalid values: ' + corners.mapTopRight + ', ' + corners.mapBotRight);
				// invalid values
			} else if(level.map[corners.mapTopRight.y][corners.mapTopRight.x] !== 0 || level.map[corners.mapBotRight.y][corners.mapBotRight.x] !== 0 ) {
				// something to the right!
				console.log('hit something going right');
				
				// move to one left
				this.pos.x = corners.mapBotLeft.x * level.scale;
			}
		} else if(input.left && this.vel.x < 0) {
			// moving left
			if(corners.mapTopLeft === null || corners.mapBotLeft === null) {
				console.log('invalid values: ' + corners.mapTopLeft + ', ' + corners.mapBotLeft);
				// invalid values
			} else if(level.map[corners.mapTopLeft.y][corners.mapTopLeft.x] !== 0 || level.map[corners.mapBotLeft.y][corners.mapBotLeft.x] !== 0 ) {
				// something to the left!
				console.log('hit something going right');
				// move to one right
				this.pos.x = (corners.mapBotLeft.x + 1) * level.scale;
			}
		}
		
		// check left edge of map
		if(this.pos.x < 0) {
			this.pos.x = 0;
		}
		// check the right edge of the map
		if(this.pos.x + level.scale >= level.mapWidth()) {
			this.pos.x = level.mapWidth() - level.scale;
		}

		// adjust side scrolling
		if(this.pos.x - level.start >= c.width / 2) {
			level.start = this.pos.x - (c.width / 2);			
		}
		if(this.pos.x - level.start < (c.width / 2)) {
			level.start = this.pos.x - (c.width / 2);
		}
		if(level.start < 0) {
			level.start = 0;
		}
		if(level.start > level.mapWidth() - c.width) {
			level.start = level.mapWidth() - c.width;
		}
		
		if(!this.jumping) {
			// check for walking off edge
			if(input.left || input.right) {
				if(corners.mapBotLeft === null || corners.mapBotRight === null) {
					console.log('invalid values: ' + corners.mapBotLeft + ', ' + corners.mapBotRight);
					// invalid values
				} else if(level.map[corners.mapBotLeft.y - 1][corners.mapBotLeft.x] === 0 && level.map[corners.mapBotRight.y - 1][corners.mapBotRight.x] === 0 ) {
					// something below!
					console.log('nothing below!');
					this.jumping = true;
				}
			}
		}		

		// move on y axis, then check for collision resolving to the limits
		if($('#cbSlowMode').is(':checked')) {
			if(input.up) {
				input.up = false;
				this.pos.y += 1;
			} else if(input.down) {
				input.down = false;
				this.pos.y -= 1;
			}
		} else {
			this.pos.y += this.vel.y; // the move
		}		
		
		// load array with player corners with y moved
		corners.fill({x: this.pos.x - level.start, y: this.pos.y});

		// check collision
		if(this.vel.y > 0) {
			// moving up
			if(corners.mapTopLeft === null || corners.mapTopRight === null) {
				console.log('invalid values: ' + corners.mapTopLeft + ', ' + corners.mapTopRight);
				// invalid values
			} else if(level.map[corners.mapTopLeft.y][corners.mapTopLeft.x] !== 0 || level.map[corners.mapTopRight.y][corners.mapTopRight.x] !== 0 ) {
				// something above!
				console.log('hit something going up');
				// move to one up
				this.vel.y = 0;
				this.pos.y = corners.mapBotLeft.y * level.scale;
			}
		} else {
			if(corners.mapBotLeft === null || corners.mapBotRight === null) {
				console.log('invalid values: ' + corners.mapBotLeft + ', ' + corners.mapBotRight);
				// invalid values
			} else if(level.map[corners.mapBotLeft.y][corners.mapBotLeft.x] !== 0 || level.map[corners.mapBotRight.y][corners.mapBotRight.x] !== 0 ) {
				// something below!
				console.log('hit something going down');
				this.jumping = false;
				input.up = false;
				this.vel.y = 0;
				// move to one down
				this.pos.y = (corners.mapBotLeft.y + 1) * level.scale;
			}
		}
		
		if(this.pos.y + level.scale > level.mapHeight()) {
			//this.pos.y = level.mapHeight() - level.scale;
			//this.vel.y = 0;
		}
		
		// side scrolling!				
	},
	draw: function() {
		// draw player
		ctx.fillStyle = this.color;
		//ctx.fillRect(this.pos.x, this.pos.y, level.scale, level.scale);
		
		// scrolling test #1: offset x by this.start
		ctx.fillRect(this.pos.x - level.start, this.pos.y, level.scale, level.scale);					
	}				 
}

function setMapBG() {
	// get canvas context				
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, c.width, c.height);
}

function handleKeyDown(evt) {
	//console.log(evt.keyCode);
	switch(evt.keyCode) {
		case inputKeys.quit: // ESC Key
			input.quit = true;
			exitFlag = true;
			//console.log('Exiting Game');
			break;
			
		case inputKeys.left: // Left Key
			if(!input.left) {
				//console.log('left pressed');
				input.left = true;
				player.vel.x = -player.speed;
				player.acc.x = 0;
			}
			break;
		
		case inputKeys.right: // Right Key
			if(!input.right) {
				//console.log('right pressed');
				input.right = true;
				player.vel.x = player.speed;
				player.acc.x = 0;
			}
			break;
		
		case inputKeys.up: // Up Key
			if(!input.up) {
				//console.log('up pressed');
				if(!this.jumping) {
					player.vel.y = player.jumpPower;
					player.jumping = true;
					player.acc.y = 0;
					input.up = true;
				}
				input.up = true;
			}
			break;
		
		case inputKeys.down: // Down Key
			if(!input.down) {
				player.vel.y = 0;
				player.acc.y = 0;
				input.down = true;
			}
			break;
		
		case 65:
			// shift map left
			//console.log('map left');
			
			level.start += 5;
			if(level.start > (level.map[0].length * level.scale) - c.width) level.start -= 5;
			console.log(level.start + ' offset ' + Math.floor(level.start / level.scale));
			
			break;
			
		case 68:
			// shift map right
			//console.log('map right');
			
			level.start -= 5;
			if(level.start < 0) level.start = 0;
			console.log(level.start + ' offset ' + Math.floor(level.start / level.scale));
			
			break;
			
		defult:
			console.log('unknown key pressed: ' + evt.keyCode)
	}
}

function handleKeyUp(evt) {
	//console.log(evt.keyCode);
	switch(evt.keyCode) {
			
		case inputKeys.left: // Left Key
			//console.log('left released');
			input.left = false;
			player.vel.x = 0;
			break;
		
		case inputKeys.right: // Right Key
			//console.log('right released');
			input.right = false;
			player.vel.x = 0;
			break;
		
		case inputKeys.up: // Up Key
			//console.log('up released');
			input.up = false;
			player.vel.y = 0;
			break;
		
		case inputKeys.down: // Down Key
			//console.log('down released');
			input.down = false;
			player.vel.y = 0;
			break;

		defult:
			console.log('unknown key released: ' + evt.keyCode)
	}
}

function drawDebugGrid() {
	ctx.strokeStyle = '#ff0000';
	/*
	for(var x = 0; x < c.width; x+=level.scale) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, c.height);
		ctx.stroke();
	}
	for(var y = 0; y < c.height; y += level.scale) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(c.width, y);
		ctx.stroke();
	}
	*/
	
	/*
	ctx.beginPath();
	ctx.moveTo(0, c.height / 2);
	ctx.lineTo(c.width, c.height / 2);
	ctx.stroke();
		
	ctx.beginPath();
	ctx.moveTo(c.width / 2, 0);
	ctx.lineTo(c.width / 2, c.height);
	ctx.stroke();
	*/
}

function gameLoop() {
	var newUpdate = new Date();
					
	$('#gameDebug').html(clickDebug);		
	//input.debugOutput();
	//level.debugOutput();
	if(!exitFlag) {
		setMapBG();
		drawDebugGrid();
		level.draw();
		player.draw();
		if(!lastUpdate) {
			lastUpdate = newUpdate;
		}
		player.update(newUpdate - lastUpdate); // passing in gravity
	} else {
		//player.debugOutput();
	}
	lastUpdate = newUpdate;				 	
}

$(function() {
	// on ready

	// define graphics contexts
	c = document.getElementById("gameCanvas");
	ctx = c.getContext("2d");
	
	// canvas defaults
	ctx.lineWidth = 1;
	
	/*
	// load scripts
	$.getScript("level.js", function(){
		// level loaded
	});
	$.getScript("player.js", function(){
		// player loaded
	});
	*/
	
	// add listeners for keyboard input
	window.addEventListener('keydown', handleKeyDown, true);
	window.addEventListener('keyup', handleKeyUp, true);
	
	// debug
	$("#gameCanvas").click(function(e){
		var gc = $("#gameCanvas");
	    var x = e.pageX - gc.offset().left;
	    var y = e.pageY - gc.offset().top;
	    var map = level.toMapCoord({x: x, y: c.height - y});
	    
	    
		clickDebug =  'Click Debug:';
		clickDebug += '<table><tr><td>click</td><td>(' + e.pageX + ', ' + e.pageY + ')</td></tr>';
		clickDebug += '<tr><td>canvas</td><td>(' + Math.round(x) + ', ' + Math.round(y) + ')</td></tr>';
		clickDebug += '<tr><td>game</td><td>(' + Math.round(x) + ', ' + (c.height - Math.round(y)) + ')</td></tr>';
		clickDebug += '<tr><td>level</td><td>(' + map.x + ', ' + map.y + ')</td></tr>';
		clickDebug += '<tr><td>map value</td><td>(' + level.map[map.y][map.x] + ')</td></tr></table>';
	});

	// flip image and translate down to fix coordinates
	ctx.scale(1, -1); // flip over x axis
	ctx.translate(0, -c.height); // move (0,0) to bottom left to match cartisian plane 
	ctx.translate(0.5, 0.5); // offset for aliasing

	setInterval(gameLoop, 10);
});

