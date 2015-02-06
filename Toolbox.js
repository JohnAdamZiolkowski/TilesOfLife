/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var Toolbox = function () {
  //  this.x = position.x;
  //  this.y = position.y;
  //  this.w = size.x;
  //  this.h = size.y;
  //  this.padding = padding;
  //  this.text_size = text_size;
  this.x = 400;
  this.y = 0;
  this.w = 200;
  this.h = window.innerHeight;

  this.canvas = toolbox_canvas;
  //this.canvas.style.border = "1px solid blue";

  this.canvas.width = this.w + line_width * 2;
  this.canvas.height = this.h + line_width * 2;
  this.canvas.style.left = this.x + "px";
  this.canvas.style.top = this.y + "px";

  //this.context = this.canvas.getContext('2d');

  this.row_height = 100;
  this.col_width = 100;
  this.padding = 5;
  //  
  //  this.text_size = this.bar_height - this.bar_height / 4;

  //TODO: draw an example of each possible item
  //TODO: have a collapse button to hide the toolbox
  //TODO: have a set of up/down buttons to scroll through
  // toolbox on smaller screens
  //TODO: show the number left of each type




  this.resize = function () {

    this.x = window.innerWidth - this.w;
    this.y = 0;

    this.canvas.style.left = this.x + "px";
    this.canvas.style.top = this.y + "px";
    this.context = this.canvas.getContext('2d');
    redraw_toolbox = true;

  };

  this.resize();

  this.text_size = 20;

  this.draw = function () {
    this.context.font = this.text_size + "px Arial";
    this.context.textAlign = "center";

    var option_width = this.col_width - this.padding * 2;
    var option_height = this.row_height - this.padding * 2;
    var option_image_y = this.row_height / 8 * 2;
    var option_name_y = this.row_height / 8 * 5;
    var option_amount_y = this.row_height / 8 * 7;

    var et = [];
    var ex = [];
    var ey = [];
    var ct = [];
    var cx = [];
    var cy = [];

    var option, x, y, center_x, string;
    for (option = 0; option < cell_types.length + 1; option++) {
      x = 0;
      center_x = x + this.col_width / 2;
      y = this.row_height * option;

      if (option === 0)
        string = "inspector";
      else
        string = cell_types[option - 1].name;

      if (cursor.type == option - 1 && !cursor.entity) {
        this.context.fillStyle = colors.menu_fill_active.string;
        this.context.strokeStyle = colors.menu_outline_active.string;
      } else {
        this.context.fillStyle = colors.menu_outline_idle.string;
        this.context.strokeStyle = colors.menu_fill_idle.string;
      }
      this.context.fillRect(x + this.padding,y + this.padding, option_width, option_height);
      this.context.strokeRect(x + this.padding,y + this.padding, option_width, option_height);

      if (cursor.type == option - 1 && !cursor.entity)
        this.context.fillStyle = colors.menu_text_active.string;
      else
        this.context.fillStyle = colors.menu_text_idle.string;
      this.context.fillText(string, center_x, y + option_name_y);
      this.context.fillText("x" + option, center_x, y + option_amount_y);
      
      if (option === 0)
        continue;
      
      ct.push(option - 1);
      cx.push(center_x - board.col_width / 2);
      cy.push(y + option_image_y - board.row_height / 2);
    }
    for (option = 0; option < entity_types.length; option++) {
      x = this.col_width;
      center_x = x + this.col_width / 2;
      y = this.row_height * option;
      string = cell_types[option];


      if (cursor.type == option && cursor.entity) {
        this.context.fillStyle = colors.menu_fill_active.string;
        this.context.strokeStyle = colors.menu_outline_active.string;
      } else {
        this.context.fillStyle = colors.menu_outline_idle.string;
        this.context.strokeStyle = colors.menu_fill_idle.string;
      }
      this.context.fillRect(x + this.padding, y + this.padding, option_width, option_height);
      this.context.strokeRect(x + this.padding, y + this.padding, option_width, option_height);

      if (cursor.type == option && cursor.entity)
        this.context.fillStyle = colors.menu_text_active.string;
      else
        this.context.fillStyle = colors.menu_text_idle.string;
      this.context.fillText(entity_types[option].name, center_x, y + option_name_y);
      this.context.fillText("x" + option, center_x, y + option_amount_y);
      
      et.push(option);
      ex.push(center_x);
      ey.push(y + option_image_y);
    }
    
    cell_painter.draw(this.context, ct, cx, cy);
    entity_painter.draw(this.context, et, ex, ey);
    
  };

  this.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  this.click = function (x, y) {
    if (x < this.x || x > this.x + this.w ||
        y < this.y || y > this.y + this.h)
      return;
    
    var selected_col = Math.floor((x - this.x) / this.col_width);
    var selected_row = Math.floor((y - this.y) / this.row_height);
    
    if (selected_col === 0 && selected_row < cell_types.length + 1) {
      cursor.type = selected_row - 1;
      cursor.entity = false;
    }
    if (selected_col === 1 && selected_row < entity_types.length) {
      cursor.type = selected_row;
      cursor.entity = true;
    }
    
  };

  this.select = function () {

  };
  this.mouse_move = function () {

  };

};