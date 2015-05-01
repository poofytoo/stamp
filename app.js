var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var routes = require(__dirname + '/routes/routes');
var io = require('socket.io')(app);
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

// Establish connection
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });

  // Receiving
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port ' + 3000);
});