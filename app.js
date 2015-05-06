var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var routes = require(__dirname + '/routes/routes');
var fs = require('fs');

var app = express();

// VIEW ENGINE
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.set('view options', {layout: false});

hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// END VIEW ENGINE

app.get('/', routes.index);
// Uncomment the next line to test the database
// app.get('/test-database', routes.testDatabase);

server = http.createServer(app).listen(3000, function(){
	console.log('Express server listening on port ' + 3000);
});

var SIZE = 20;
var maxBlocks = SIZE/2;

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var Player = function(startX, startY, size, id, color) {
	this.id = id;
	this.x = startX;
	this.y = startY;
	this.size = size;
	this.blocks = 0;
	this.color = color;
	// this.dx = 0;
	// this.dy = 0;

	this.getX = function() {
		return this.x;
	};

	this.getY = function() {
		return this.y;
	};

	// this.getdx = function() {
	// 	return this.dx;
	// };

	// this.getdy = function() {
	// 	return this.dy;
	// };

	this.getSize = function() {
		return this.size;
	};

	this.getId = function() {
		return this.id;
	};

	// this.updatePosition = function() {
	// 	this.x += this.dx;
	// 	this.y += this.dy;
	// };

	// this.setdx = function(ndx) {
	// 	this.dx = ndx;
	// };

	// this.setdy = function(ndy) {
	// 	this.dy = ndy;
	// };

	// this.incdx = function(ndx) {
	// 	this.dx += ndx;
	// };

	// this.incdy = function(ndy) {
	// 	this.dy += ndy;
	// };

	this.getInfo = function() {
		return {'x': this.x,
						'y': this.y,
						's': this.size,
						'id': this.id,
						'color': this.color,
						'blocks': this.blocks};
	};

	this.eatBlock = function() {
		if (this.blocks == maxBlocks) {
			return false;
		}
		this.blocks += 1;
		console.log("ate block, blocks now " + this.blocks);
		return true;
	};

	this.setBlock = function() {
		if (this.blocks >= maxBlocks) {
			this.blocks = 0;
			return true;
		}
		return false;
	};
}

var Block = function(id, x, y, s, owner, color) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.s = s;
	this.owner = owner;
	this.color = color;

	this.getInfo = function() {
		return {'id' : this.id,
						'owner' : this.owner,
						'color' : this.color,
						'x': this.x,
						'y': this.y,
						's': this.s};
	};

	this.getX = function() {
		return this.x;
	};

	this.getY = function() {
		return this.y;
	};

	this.getSize = function() {
		return this.s;
	};

	this.getId = function() {
		return this.id;
	};

	this.setColor = function(color) {
		this.color = color;
	}
}

var randomInt = function(a, b, n) {
	var min = a/n;
	var max = b/n;
	return Math.floor((Math.random() * ((max + 1) - min)) + min) * n;
};

var overlaps = function(x1, y1, s1, x2, y2, s2) {
	var x11 = x1;
	var x12 = x1 + s1;
	var y11 = y1;
	var y12 = y1 + s1;

	var x21 = x2;
	var x22 = x2 + s2;
	var y21 = y2;
	var y22 = y2 + s2;

	// console.log(x11, x12, y11, y12);
	// console.log(x21, x22, y21, y22);
	// console.log(x22 < x11 || x12 < x21 || y22 < y11 || y12 < y21);
	// return false;

	if (x22 <= x11 || x12 <= x21 || y22 <= y11 || y12 <= y21) {
		return false;
	}
	return true;
};

var players = {};
for (var i = 0; i < 1; i++) {
	var userId = i;
	players[userId] = new Player(randomInt(0, 100, SIZE), randomInt(0, 100, SIZE), SIZE, i, getRandomColor());
}

var nextBlockId = 0;
var blocks = {};
for (var i = 0; i < 50; i++) {
	blocks[nextBlockId] = new Block(nextBlockId++, randomInt(0, 500, SIZE), randomInt(0, 500, SIZE), SIZE, -1, "#666");
}

var allPositions = function() {
	var message = {
		players: [],
		objects: []
	};
	for (var i in players) {
		var p = players[i];
		message['players'].push(p.getInfo());
	}
	for (var i in blocks) {
		var b = blocks[i];
		message['objects'].push(b.getInfo());
	}
	console.log(message);
	return message;
};

var TICK = 200;
var speed = 1*SIZE;

var checkPlayerPosition = function(userId, x, y) {
	var oldx = players[userId].x;
	var oldy = players[userId].y;
	if (Math.abs(oldx - x) > SIZE * 2 || Math.abs(oldy - y) > SIZE * 2) {
		return false;
	}
	return true;
}

var updatePlayerPosition = function(userId, x, y) {
	players[userId].x = x;
	players[userId].y = y;
}

var userAction = function(userId, a) {
	if (a == "SPACE") {
		var p = players[userId];
		if (p.setBlock()) {
			blocks[nextBlockId] = new Block(nextBlockId++, p.x, p.y, SIZE, p.userId, p.color);
		}
	}
}

// var updatePlayer = function(userId, keyevent) {
// 	if (keyevent == 'UP' || keyevent == 'RELEASEDDOWN') {
// 		players[userId].incdy(-speed);
// 	} else if (keyevent == 'DOWN' || keyevent == 'RELEASEDUP') {
// 		players[userId].incdy(speed);
// 	} else if (keyevent == 'LEFT' || keyevent == 'RELEASEDRIGHT') {
// 		players[userId].incdx(-speed);
// 	} else if (keyevent == 'RIGHT' || keyevent == 'RELEASEDLEFT') {
// 		players[userId].incdx(speed);
// 	}
// };

// var updatePositions = function() {
// 	for (var p in players) {
// 		players[p].updatePosition();
// 	}
// };

var checkCollisions = function() {
	var toDelete = [];
	for (var i in players) {
		for (var j in blocks) {
			var p = players[i];
			var b = blocks[j];
			if (overlaps(p.getX(), p.getY(), p.getSize(), b.getX(), b.getY(), b.getSize())) {
				if (b.owner == -1 && p.eatBlock()) {
					toDelete.push(b.getId());
				}
			}
		}
	}
	for (var b in toDelete) {
		delete blocks[toDelete[b]];
	}
	if (toDelete.length != 0) {
		return true;
	}
	return false;
};

var io = require('socket.io')(server);
// Establish connection

io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.emit('init', allPositions());

	// Receiving
	socket.on('my other event', function (data) {
		console.log(data);
	});

	socket.on('userAction', function (data) {
		userAction(data.userId, data.a);
		console.log(data);
		//updatePlayer(data.userId, data.a);
	});

	socket.on('userUpdate', function (data) {
		console.log(data);
		if (checkPlayerPosition(data.userId, data.x, data.y)) {
			updatePlayerPosition(data.userId, data.x, data.y);
			checkCollisions();
			socket.emit('all_positions', allPositions());
		} else {
			console.log("cheater");
			var p = players[data.userId];
			socket.emit('force_position', {
				userId: p.userId,
				x: p.x,
				y: p.y
			});
		}
	})

	// socket.on('removeblock', function (data) {
	// 	console.log("remove block");
	// 	console.log(data);
	// 	eatBlock(data.player, data.block);
	// });

	setInterval(function(){
		// updatePositions();
		checkCollisions();
		if (checkCollisions()) {
			socket.emit('all_positions', allPositions());
		}
		//console.log(allPositions());
		//
	}, TICK);

	setInterval(function(){
		socket.emit('all_positions', allPositions());
	}, TICK * 10);
});
