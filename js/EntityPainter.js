/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var EntityPainter = function () {

  this.n = entity_types.length;
  this.entity_colors = [];
  this.entity_lines = [];
  this.entity_color;

  var i;
  for (i = 1; i < this.n; ++i) {
    this.entity_color = entity_types[i-1].color;
    this.entity_colors.push(this.entity_color.style);
    this.entity_lines.push(this.entity_color.darken().darken().style);
    //this.entity_colors.push(colors.cursor.style);
    //this.entity_lines.push(colors.cursor.style);
  }

  this.r = board.radius;
  this.ling_r = this.r * 0.75;
  this.d = this.r * 2;
  this.line_width = board.line_width;
  this.r2 = this.r + this.line_width;
  this.d2 = this.r2 * 2;

  //TODO: worry about size later

  this.off = document.createElement('canvas');
  this.off.width = Math.ceil(this.n * this.d2);
  this.off.height = Math.ceil(this.d2);
  this.ctx = this.off.getContext('2d');
  this.ctx.lineWidth = this.line_width;

  var r_to_use;
  for (i = 1; i < this.n; ++i) {
    this.ctx.fillStyle = this.entity_colors[i];
    this.ctx.beginPath();
    r_to_use = this.r;
    if (i == 2 || i == 4 || i == 6)
      r_to_use = this.ling_r;
    this.ctx.arc((i-1)  * this.d2 + this.r2, this.r2, r_to_use, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.strokeStyle = this.entity_lines[i];
    this.ctx.beginPath();
    this.ctx.arc((i-1) * this.d2 + this.r2, this.r2, r_to_use, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  //need to pass in a grid of entities positions and their type for color
  this.draw = function (context, et, ex, ey) {

    var n = et.length;

    var i;
    var c;
    var x;
    var y;
    for (i = 0; i < n; ++i) {
      c = et[i]-1;
      x = ex[i] - this.r2;
      y = ey[i] - this.r2;
      context.drawImage(this.off, c * this.d2, 0, this.d2, this.d2, x, y, this.d2, this.d2);
      //context.drawImage(this.off, 0, 0, this.d2, this.d2, x, y, this.d2, this.d2);
    }
  };

};
