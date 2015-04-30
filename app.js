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
	this.x = startX;
	this.y = startY;
	this.size = size;
	this.id = id;
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
	}

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
						's': this.size};
	};
}

var Block = function(x, y, s) {
	this.x = x;
	this.y = y;
	this.s = s;

	this.getInfo = function() {
		return {'x': this.x, 
						'y': this.y};
	}
}

var randomInt = function(a, b) {
	return Math.floor((Math.random() * ((b + 1) - a)) + a);
}

var players = {};
for (var i = 0; i < 5; i++) {
	var userId = "user" + i.toString();
	players[userId] = new Player(randomInt(0, 100), randomInt(0, 100), randomInt(0, 100), i);
}

var blocks = [];
for (var i = 0; i < 5; i++) {
	blocks.push(new Block(randomInt(0, 100), randomInt(0, 100), 5));
}

var allPositions = function() {
	var message = {};
	for (var i in players) {
		var p = players[i];
		message[p.getId()] = p.getInfo();
	}
	message['objects'] = [];
	for (var i in blocks) {
		message['objects'].push(blocks[i].getInfo());
	}
	return message;
};

var TICK = 200;
var speed = 1;
var updatePlayer = function(userId, keyevent) {
	if (keyevent == 'UP' || keyevent == 'DOWNRELEASE') {
		players[userId].incdy(-speed);
	} else if (keyevent == 'DOWN' || keyevent == 'UPRELEASE') {
		players[userId].incdy(speed);
	} else if (keyevent == 'LEFT' || keyevent == 'RIGHTRELEASE') {
		players[userId].incdx(-speed);
	} else if (keyevent == 'RIGHT' || keyevent == 'LEFTRELEASE') {
		players[userId].incdx(speed);
	}
};

var updatePositions = function() {
	for (var p in players) {
		players[p].updatePosition();
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

	setInterval(function(){
		updatePositions();
		console.log(allPositions());
		socket.emit('all_positions', allPositions()); 
	}, TICK);
});
