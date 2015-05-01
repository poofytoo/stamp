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

var Player = function(startX, startY, size, id) {
	this.id = id;
	this.x = startX;
	this.y = startY;
	this.size = size;
	this.blocks = 0;
	this.dx = 0;
	this.dy = 0;

	this.getX = function() {
		return this.x;
	};

	this.getY = function() {
		return this.y;
	};

	this.getdx = function() {
		return this.dx;
	};

	this.getdy = function() {
		return this.dy;
	};

	this.getSize = function() {
		return this.size;
	};

	this.getId = function() {
		return this.id;
	};

	this.updatePosition = function() {
		this.x += this.dx;
		this.y += this.dy;
	};

	this.setdx = function(ndx) {
		this.dx = ndx;
	};

	this.setdy = function(ndy) {
		this.dy = ndy;
	};

	this.incdx = function(ndx) {
		this.dx += ndx;
	};

	this.incdy = function(ndy) {
		this.dy += ndy;
	};

	this.getInfo = function() {
		return {'x': this.x,
						'y': this.y,
						's': this.size,
						'id': this.id,
						'blocks': this.blocks};
	};

	this.eatBlock = function() {
		this.blocks += 1;
	};

	this.setBlock = function() {
		if (this.blocks >= 5) {
			this.blocks = 0;
			return true;
		}
		return false;
	};
}

var Block = function(id, x, y, s, owner) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.s = s;
	this.owner = owner;

	this.getInfo = function() {
		return {'id' : this.id,
						'owner' : this.owner,
						'x': this.x, 
						'y': this.y};
	};

	this.getX = function() {
		return this.x;
	};

	this.getY = function() {
		return this.y;
	};

	this.getSize = function() {
		return this.size;
	};

	this.getId = function() {
		return this.id;
	};
}

var randomInt = function(a, b) {
	return Math.floor((Math.random() * ((b + 1) - a)) + a);
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

	if (x22 < x11 || x12 < x21 || y22 < y11 || y12 < y21) {
		return false;
	}
	return true;
};


var players = {};
for (var i = 0; i < 5; i++) {
	var userId = i;
	players[userId] = new Player(randomInt(0, 100), randomInt(0, 100), 5, i);
}

var blocks = {};
for (var i = 0; i < 5; i++) {
	var blockId = i;
	blocks[blockId] = new Block(i, randomInt(0, 100), randomInt(0, 100), 5, 0);
}

var allPositions = function() {
	var message = {};
	for (var i in players) {
		var p = players[i];
		message[p.getId()] = p.getInfo();
	}
	message['objects'] = [];
	for (var i in blocks) {
		var b = blocks[i];
		message['objects'].push(b.getInfo());
	}
	return message;
};

var TICK = 200;
var speed = 5;
var updatePlayer = function(userId, keyevent) {
	if (keyevent == 'UP' || keyevent == 'RELEASEDDOWN') {
		players[userId].incdy(-speed);
	} else if (keyevent == 'DOWN' || keyevent == 'RELEASEDUP') {
		players[userId].incdy(speed);
	} else if (keyevent == 'LEFT' || keyevent == 'RELEASEDRIGHT') {
		players[userId].incdx(-speed);
	} else if (keyevent == 'RIGHT' || keyevent == 'RELEASEDLEFT') {
		players[userId].incdx(speed);
	}
};

var updatePositions = function() {
	for (var p in players) {
		players[p].updatePosition();
	}
};

var checkCollisions = function() {
	var toDelete = [];
	for (var i in players) {
		for (var j in blocks) {
			var p = players[i];
			var b = blocks[j];
			if (overlaps(p.getX(), p.getY(), p.getSize(), b.getX(), b.getY(), b.getSize())) {
				toDelete.push(b.getId());
				p.eatBlock();
			}
		}
	}
	for (var b in toDelete) {
		delete blocks[toDelete[b]];
	}
};

var io = require('socket.io')(server);
// Establish connection

io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });

	// Receiving
	socket.on('my other event', function (data) {
		console.log(data);
	});

	socket.on('userAction', function (data) {
    console.log(data);
    updatePlayer(data.userId, data.a);
  });

  socket.on('removeblock', function (data) {
  	console.log(data);
  	eatBlock(data.player, data.block);
  });

	setInterval(function(){
		updatePositions();
		checkCollisions();
		console.log(allPositions());
		socket.emit('all_positions', allPositions()); 
	}, TICK);
});
