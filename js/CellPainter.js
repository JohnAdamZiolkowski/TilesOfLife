/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var CellPainter = function () {

  this.colors = cell_types.length;
  this.cell_colors = [];

  var c;
  for (c = 0; c < this.colors; c++) {
    this.cell_colors.push(cell_types[c].color.style);
  }

  this.w = board.col_width;
  this.h = board.row_height;

  //TODO: worry about dirt patch later

  // takes the following arguments:
  // context: canvas context for drawing
  // ct: array of cell type indexes to draw
  // cx, cy: arrays of cell positions
  this.draw = function (context, ct, cx, cy) {

     //number of colors
    var colors = this.colors;
    var cells = ct.length;

     //color-sorted x positions
    var ccx = new Array(colors);
    var ccy = new Array(colors);

    //color
    var c;
    for (c = 0; c < colors; c++) {
      ccx[c] = [];
      ccy[c] = [];
    }

    //sorts each requested cell into proper color's array
    var cell;
    for (cell = 0; cell < cells; cell++) {
      c = ct[cell];
      ccx[c].push(cx[cell]);
      ccy[c].push(cy[cell]);
    }

    //draws each cell
    var cells_in_color;
    for (c = 0; c < colors; c++) {
      context.fillStyle = this.cell_colors[c];
      var cells_in_color = ccx[c].length;
      for (cell = 0; cell < cells_in_color; cell++) {
        context.fillRect(ccx[c][cell], ccy[c][cell], this.w, this.h);
      }
    }
  };
};
