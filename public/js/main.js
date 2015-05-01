$(function() {

  var socket =  io.connect('http://localhost:3000');
  var pressed = {};
  var data = {};
  var myUserId = 1; // I don't know what do with that lol

  socket.on('news', function (data) {
    console.log(data);
  });

  socket.on('all_positions', function (data) {
		console.log(data);
	});

  var sendUserAction = function(a) {
    data = {
      userId: myUserId,
      a: a
    }
    socket.emit('userAction', data);
  }

  var init = function() {

    var canvas = document.getElementById('arena')
    var ctx = canvas.getContext('2d');
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

    ctx.fillRect(5,5,10,10);
  }

  init();
})