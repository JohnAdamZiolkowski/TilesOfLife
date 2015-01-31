/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var CellPainter = function () {

  this.n = cell_types.length;
  this.cell_colors = [];

  var i;
  for (i = 0; i < this.n; ++i) {
    this.cell_colors.push(cell_types[i].color.string);
    //this.cell_colors.push(colors.cursor.string);
  }

  this.w = board.col_width;
  this.h = board.row_height;

  //TODO: worry about dirt patch later

  this.off = document.createElement('canvas');
  this.off.width = Math.ceil(this.n * this.w);
  this.off.height = Math.ceil(this.h);
  this.ctx = this.off.getContext('2d');

  for (i = 0; i < this.n; ++i) {
    this.ctx.fillStyle = this.cell_colors[i];
    this.ctx.fillRect(i * this.w, 0, this.w, this.h);
    this.ctx.fill();
  }

  //need to pass in a grid of entities positions and their type for color
  this.draw = function (context, ct, cx, cy) {

    var n = ct.length;

    var i;
    var c;
    var x;
    var y;
    for (i = 0; i < n; ++i) {

      c = ct[i];
      x = cx[i];
      y = cy[i];
      context.drawImage(this.off, c * this.w, 0, this.w, this.h, x, y, this.w, this.h);

    }
    //debug draw 

    context.drawImage(this.off, 0, 0);
  };

};