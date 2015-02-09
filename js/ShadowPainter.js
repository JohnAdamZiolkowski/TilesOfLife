/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var ShadowPainter = function () {

  this.n = cell_types.length;
  this.cell_colors = [];

  var i;
  for (i = 0; i < this.n; ++i) {
    this.cell_colors.push(cell_types[i].color.darken().style);
    //this.cell_colors.push(colors.cursor.style);
  }

  this.r = board.radius;
  this.ling_r = this.r * 0.75;

  this.d = this.r * 2;

  this.scale_x = 1.25;
  this.scale_y = 0.5;

  this.sw = this.d * this.scale_x;
  this.sh = this.d * this.scale_y;

  this.swr = this.sw / 2;
  this.shr = this.sh / 2;



  //TODO: worry about size later

  this.off = document.createElement('canvas');
  this.off.width = Math.ceil(this.n * this.sw);
  this.off.height = Math.ceil(this.sh * 2);
  this.ctx = this.off.getContext('2d');

  this.ctx.save();
  this.ctx.scale(this.scale_x, this.scale_y);
  for (i = 0; i < this.n; ++i) {
    this.ctx.fillStyle = this.cell_colors[i];
    this.ctx.beginPath();
    this.ctx.arc(i * this.d + this.r,
                 this.r,
                 this.r, 0, 2 * Math.PI);
    this.ctx.arc(i * this.d + this.r,
                 this.d + this.r,
                 this.ling_r, 0, 2 * Math.PI);
    //this.ctx.arc(i * this.d + this.r, this.r, this.r, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
  }
  this.ctx.restore();

  //need to pass in a grid of entities positions and their type for color
  this.draw = function (context, st, sx, sy, is_ling) {

    var n = st.length;

    var i;
    var c;
    var x;
    var y;
    var ling = board.radius * 0.66;
    var l;
    for (i = 0; i < n; ++i) {

      l = 0;
      if (is_ling[i])
        l = 1;

      c = st[i];
      x = sx[i] - this.swr;
      y = sy[i] - this.shr;
      context.drawImage(this.off, c * this.sw, l * this.sh, this.sw, this.sh, x, y, this.sw, this.sh);

    }
  };

};
