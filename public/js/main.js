$(function() {

  var canvas = document.getElementById('arena')
  var ctx = canvas.getContext('2d');

  var socket =  io.connect('http://localhost:3000');
  var pressed = {};
  var data = {};
  var myUserId = 1; // I don't know what do with that lol

  socket.on('news', function (data) {
    console.log(data);
  });

  socket.on('all_positions', function (data) {
		redrawCanvas(data);
	});

  var sendUserAction = function(a) {
    var data = {
      userId: myUserId,
      a: a
    }
    socket.emit('userAction', data);
  }

  var redrawCanvas = function(data) {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    Object.keys(data).forEach(function (key) {
      var u = data[key]
      ctx.beginPath();
      ctx.lineWidth = '1';
      ctx.rect(u.x,u.y,u.s,u.s);
      ctx.stroke();
    });
    for (i in data.objects) {
      b = data.objects[i]
      ctx.fillStyle="#666";
      ctx.fillRect(b.x,b.y,5,5);
    }
  }

  var init = function() {
    var keys = {
      37: 'LEFT',
      38: 'UP',
      39: 'RIGHT',
      40: 'DOWN'
    }
    
    $(document).keydown(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keys[keycode] && !pressed[keycode]) {
        pressed[keycode] = true;
        sendUserAction(keys[keycode])
      }
    });

    $(document).keyup(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keys[keycode]) {
        pressed[keycode] = false;
        sendUserAction('RELEASED' + keys[keycode])
      }
    });

    ctx.fillRect(5,5,5,5);


  }

  init();
})