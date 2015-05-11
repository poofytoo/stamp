  function Player(id) {
    this.x = 0;
    this.y = 0;
    this.size = 20;
    this.id = id;
  }

  Player.prototype.draw = function(canvas, ctx) {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    ctx.fillRect(canvas.width/2 - this.size/2, canvas.height/2 - this.size/2, this.size, this.size);
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