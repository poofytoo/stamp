$(function() {

	var canvas = document.getElementById('arena')
	var ctx = canvas.getContext('2d');

	var socket =  io.connect('http://localhost:3000');
	var pressed = {};
	var data = {};
	var myUserId = 1; // I don't know what do with that lol

	var SIZE = 10;
	var x = 0,
			y = 0,
			px = 0,
			py = 0,
			dx = 0,
			dy = 0;
	var speed = SIZE / 25;

	var state;

	socket.on('news', function (data) {
		console.log(data);
	});

	socket.on('all_positions', function (data) {
		state = data;
	});

	socket.on('force_position', function (data) {
		if (data.userId == myUserId) {
			x = data.x;
			y = data.y;
			px = pixelize(x);
			py = pixelize(y);
		}
	});

	var Key = {
		_pressed: {},

		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,

		isDown: function(keyCode) {
			return keyCode in this._pressed;
		},

		onKeydown: function(event) {
			this._pressed[event.keyCode] = event.timestamp;
		},

		onKeyup: function(event) {
			delete this._pressed[event.keyCode];
		}
	};

	window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
	window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

	var sendUserAction = function(a) {
		var data = {
			userId: myUserId,
			a: a
		}
		socket.emit('userAction', data);
	}

	var sendUserUpdate = function() {
		var data = {
			userId: myUserId,
			x: px,
			y: py
		}
		socket.emit('userUpdate', data);
	}

	var drawPlayer = function(x, y, s) {
		ctx.beginPath();
		ctx.lineWidth = '1';
		ctx.rect(x, y, s, s);
		ctx.stroke();
	}

	var drawBlock = function(x, y, s) {
		drawPlayer(x, y, s);
		ctx.fillStyle="#666";
		ctx.fillRect(x, y, s, s);
	}

	var redrawCanvas = function() {
		ctx.clearRect(0,0,canvas.width, canvas.height)
		if (state) {
			for (i in state.players) {
				var p = state.players[i];
				if (p.id != myUserId) {
					drawPlayer(p.x, p.y, p.s);
				}
			}
			for (i in state.objects) {
				var b = state.objects[i];
				drawBlock(b.x, b.y, b.s);
			}
		}
		drawPlayer(px, py, SIZE);
	};

	var incDxDy = function(ddx, ddy) {
		dx += ddx;
		dy += ddy;
	};

	var pixelize = function(x) {
		return Math.floor(x/SIZE) * SIZE;
	}

	var checkKeys = function() {
		if (Key.isDown(Key.UP)) incDxDy(0, -speed);
		if (Key.isDown(Key.DOWN)) incDxDy(0, speed);
		if (Key.isDown(Key.LEFT)) incDxDy(-speed, 0);
		if (Key.isDown(Key.RIGHT)) incDxDy(speed, 0);
	};

	var cutoff = 0.01;
	var mu = 0.8;
	var updatePlayer = function() {
		dx *= mu;
		dy *= mu;
		if (Math.abs(dx) < cutoff) { dx = 0; }
		if (Math.abs(dy) < cutoff) { dy = 0; }
		x += dx;
		y += dy;
		var oldpx = px;
		var oldpy = py;
		px = pixelize(x);
		py = pixelize(y);
		if (oldpx != px || oldpy != py) {
			sendUserUpdate();
		}
	};

	function update() {
		checkKeys();
		updatePlayer();
		redrawCanvas();

		setTimeout(update, 10);
	}

	update();

		// var keys = {
		//   37: 'LEFT',
		//   38: 'UP',
		//   39: 'RIGHT',
		//   40: 'DOWN'
		// }

		// $(document).keydown(function(event){
		//   console.log("down");
		//   console.log(event);
		//   var keycode = (event.keyCode ? event.keyCode : event.which);
		//   if (keys[keycode] && !pressed[keycode]) {
		//     pressed[keycode] = true;
		//     sendUserAction(keys[keycode])
		//   }
		// });

		// $(document).keyup(function(event){
		//   console.log("up");
		//   console.log(event);
		//   var keycode = (event.keyCode ? event.keyCode : event.which);
		//   if (keys[keycode]) {
		//     pressed[keycode] = false;
		//     sendUserAction('RELEASED' + keys[keycode])
		//   }
		// });

		// ctx.fillRect(5,5,5,5);


	// }

	//init();
})