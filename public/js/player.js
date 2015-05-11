  function Player(canvas, data) {
    console.log(data);
    this.x = data._x;
    this.y = data._y;
    this.size = data._size;
    this.canvasLocationX = canvas.width/2 - this.size/2;
    this.canvasLocationY = canvas.height/2 - this.size/2;
    this.id = data._id;
  }

  Player.prototype.draw = function(canvas, ctx) {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    ctx.fillRect(this.canvasLocationX, this.canvasLocationY, this.size, this.size);
  };

  Player.prototype.redraw = function(canvas, ctx) {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    ctx.fillRect(this.x,this.y,5,5);
  };

  Player.prototype.moveLeft = function() {
    this.x -= 1;
  };

  Player.prototype.moveRight = function() {
    this.x += 1;
  };

  Player.prototype.moveUp = function() {
    this.y -= 1;
  };

  Player.prototype.moveDown = function() {
    this.y += 1;
  };