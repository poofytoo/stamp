$(function() {

  var socket =  io.connect('http://localhost:3000');
  var pressed = {}
  var data = {}


  socket.on('news', function (data) {
    console.log(data);
  });

  socket.on('all_positions', function (data) {
		console.log(data);
	});

  var sendUserAction = function(a) {
    data['user1'] = a;
    socket.emit('userAction', data);
  }
  $(document).keydown(function(event){
    var keys = {
      37: 'LEFT',
      38: 'UP',
      39: 'RIGHT',
      40: 'DOWN'
    }
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keys[keycode] && !pressed[keycode]) {
      pressed[keycode] = true;
      sendUserAction(keys[keycode])
    }
  });

  $(document).keyup(function(event){
    var keys = {
      37: 'LEFT',
      38: 'UP',
      39: 'RIGHT',
      40: 'DOWN'
    }
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keys[keycode]) {
      pressed[keycode] = false;
      sendUserAction('RELEASED' + keys[keycode])
    }
  });

})