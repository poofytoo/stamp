function Environment(p) {
  this.centerX = p.canvasLocationX;
  this.centerY = p.canvasLocationY;
}

Environment.prototype.drawOtherPlayer = function(me, p, canvas, ctx) {
  console.log(me.x, me.y)
  ctx.fillRect(this.centerX + (me.x - p._x), this.centerY + (me.y - p._y), p._size, p._size);
};