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
}

var randomInt = function(a, b) {
	return Math.floor((Math.random() * ((b + 1) - a)) + a);
}

var players = [];
for (var i = 0; i < 5; i++) {
	players.push(new Player(randomInt(0, 100), randomInt(0, 100), randomInt(0, 100), i));
}

var allPositions = function() {
	var message = {};
	for (var i in players) {
		var p = players[i]
		message[p.getId()] = {
			'x': p.getX(),
			'y': p.getY(),
			's': p.getSize()
		};
	}
	return message;
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
  });

	setInterval(function(){
		console.log("broadcasting all positions");
		console.log(allPositions());
		socket.emit('all_positions', allPositions()); 
	}, 2000);
});
