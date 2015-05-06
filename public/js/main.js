$(function() {

	var canvas = document.getElementById('arena')
	var ctx = canvas.getContext('2d');

	var socket =  io.connect('http://localhost:3000');
	var pressed = {};
	var data = {};
	var myUserId = 0; // I don't know what do with that lol

	var SIZE = 20;
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

	socket.on('init', function (data) {
		state = data;
		for (i in state.players) {
			var p = state.players[i];
			if (p.id == myUserId) {
				x = p.x;
				y = p.y;
				px = pixelize(x);
				py = pixelize(y);
			}
		}
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

	var sendUserAction = function(a) {
		var data = {
			userId: myUserId,
			a: a
		}
		socket.emit('userAction', data);
	}

	var Key = {
		_pressed: {},

		SPACE: 32,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,


		isDown: function(keyCode) {
			return keyCode in this._pressed;
		},

		onKeydown: function(event) {
			this._pressed[event.keyCode] = event.timestamp;
			if (event.keyCode == this.SPACE) {
				sendUserAction("SPACE");
			};
		},

		onKeyup: function(event) {
			delete this._pressed[event.keyCode];
		}
	};

	window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
	window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);



	var sendUserUpdate = function() {
		var data = {
			userId: myUserId,
			x: px,
			y: py
		}
		socket.emit('userUpdate', data);
	}

	var drawPlayer = function(x, y, s, b, c) {
		ctx.beginPath();
		ctx.lineWidth = b;
		ctx.strokeStyle=c;
		ctx.rect(x + b/2, y + b/2, s - b, s - b);
		ctx.stroke();
	}

	var drawBlock = function(b) {
		drawPlayer(b.x, b.y, b.s, 1, b.color);
		ctx.fillStyle=b.color;
		ctx.fillRect(b.x, b.y, b.s, b.s);
	}

	var redrawCanvas = function() {
		ctx.clearRect(0,0,canvas.width, canvas.height)
		if (state) {
			for (i in state.players) {
				var p = state.players[i];
				if (p.id != myUserId) {
					//console.log("blocks: " + p.blocks);
					drawPlayer(p.x, p.y, p.s, p.blocks, p.color);
				} else {
					drawPlayer(px, py, SIZE, p.blocks, p.color);
				}
			}
			for (i in state.objects) {
				drawBlock(state.objects[i]);
			}
		}
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