/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var CellLinePainter = function () {

  this.n = cell_types.length;
  
  //mixes all the colors in a grid
  this.line_colors = [];
  var col;
  var row;
  for (row = 0; row < this.n; row++) {
    for (col = 0; col < this.n; col++) {
      
      if (col == row) {
        this.line_colors.push(cell_types[col].color.darken().string);
        this.line_colors.push(cell_types[col].color.darken().darken().string);
      }
      else {
        this.line_colors.push(mix_colors(cell_types[col].color, cell_types[row].color).darken().string);
        this.line_colors.push(mix_colors(cell_types[col].color, cell_types[row].color).darken().darken().string);
      }
    }
  }
  this.total = this.line_colors.length;
  
  // takes the following arguments:
  // context: canvas context for drawing
  // lt: array of cell type indexes to draw
  // lm: array of cell type indexes to mix
  // lx, ly: arrays of line positions
  // lx, ly: arrays of line dimensions
  this.draw = function (context, lt, lm, lx, ly, lw, lh, ld) {

    //initializes 2D array for each color
    var lmx = new Array(this.total);
    var lmy = new Array(this.total);
    var lmw = new Array(this.total);
    var lmh = new Array(this.total);
    var c;
    var nc = this.total;
    for (c = 0; c < nc; c++) {
      lmx[c] = [];
      lmy[c] = [];
      lmw[c] = [];
      lmh[c] = [];
    }
    
    //sorts each requested line into mixed color's array
    var l;
    var nl = lt.length;
    var d; //dark
    for (l = 0; l < nl; l++) {
      if (ld[l]) d = 1; else d = 0;
      c = (lt[l] + lm[l] * this.n) * 2 + d;
      lmx[c].push(lx[l]);
      lmy[c].push(ly[l]);
      lmw[c].push(lw[l]);
      lmh[c].push(lh[l]);
    }
    
    var lines_in_color;
    
    //draws each line 
    for (c = 0; c < this.total; c++) {
      context.fillStyle = this.line_colors[c];
      lines_in_color = lmx[c].length;
      for (l = 0; l < lines_in_color; l++) {
        context.fillRect(lmx[c][l], lmy[c][l], lmw[c][l], lmh[c][l]);
      }
    }
  };

};