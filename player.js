// Player Class for Server
var method = Player.prototype;

function Player(id) {
  // Initialize Player
  this._id = id;
  this._size = 20;

  // temporarily assign them a location within the vicinity of 0,0
  this._x = (Math.floor(Math.random()*8) - 4)*this._size;
  this._y = (Math.floor(Math.random()*8) - 4)*this._size;

  this._blocks = 0;
  this._color = '#FFF';
}

method.getID = function() {
  return this._id;
}

method.getX = function() {
  return this._x;
}

method.getY = function() {
  return this._y;
}

method.getSize = function() {
  return this._size;
}

method.getId = function() {
  return this._id;
};

method.draw = function(canvas, ctx) {
  ctx.clearRect(0,0,canvas.width, canvas.height)
  ctx.fillRect(canvas.width/2 - this.size/2, canvas.height/2 - this.size/2, this.size, this.size);
};

method.redraw = function(canvas, ctx) {
  ctx.clearRect(0,0,canvas.width, canvas.height)
  ctx.fillRect(this.x,this.y,5,5);
};

/*
// Copied from Joe

method.getInfo = function() {
  return {'x': this._x,
          'y': this._y,
          's': this._size,
          'id': this._id,
          'color': this._color,
          'blocks': this._blocks};
};

method.eatBlock = function() {
  if (this._blocks == maxBlocks) {
    return false;
  }
  this._blocks += 1;
  console.log("ate block, blocks now " + this.blocks);
  return true;
};

method.setBlock = function() {
  if (this._blocks >= maxBlocks) {
    this._blocks = 0;
    return true;
  }
  return false;
};

*/

module.exports = Player;