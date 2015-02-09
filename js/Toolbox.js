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

  this.canvas = toolbox_canvas;
  //this.canvas.style.border = "1px solid blue";


  this.horizontal = false;


  this.padding = 5;
  //
  //  this.text_size = this.bar_height - this.bar_height / 4;

  //TODO: draw an example of each possible item
  //TODO: have a collapse button to hide the toolbox
  //TODO: have a set of up/down buttons to scroll through
  // toolbox on smaller screens
  //TODO: show the number left of each type


  this.resize = function () {

    if (this.horizontal) {
      var cell_size = window.innerWidth / entity_types.length;
      this.row_height = cell_size;
      this.col_width = cell_size;
      this.w = this.col_width * entity_types.length;
      this.h = this.row_height * 2;

      this.x = window.innerWidth / 2 - this.w / 2;
      this.y = window.innerHeight - this.h;
    } else {
      var cell_size = window.innerHeight / entity_types.length;
      this.row_height = cell_size;
      this.col_width = cell_size;
      this.w = this.col_width * 2;
      this.h = this.row_height * entity_types.length;

      this.x = window.innerWidth - this.w;
      this.y = window.innerHeight / 2 - this.h / 2;
    }


    this.canvas.width = this.w + line_width * 2;
    this.canvas.height = this.h + line_width * 2;

    this.canvas.style.left = this.x + "px";
    this.canvas.style.top = this.y + "px";
    this.context = this.canvas.getContext('2d');
    redraw_toolbox = true;

  };

  this.resize();

  this.text_size = 14;

  this.move = function () {
    this.horizontal = !this.horizontal;
    this.resize();
  }


  this.draw = function () {
    this.context.font = "bold " + this.text_size + "px Droid Sans";
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

    //draw the inspector and cell options
    for (option = 0; option < cell_types.length + 2; option++) {
      if (this.horizontal) {
        x = this.col_width * option;
        center_x = x + this.col_width / 2;
        y = 0;
      } else {
        x = 0;
        center_x = x + this.col_width / 2;
        y = this.row_height * option;
      }

      if (option === 0)
        string = "menu";
      else if (option == 1)
        string = "inspector";
      else
        string = cell_types[option - 2].name;

      if (cursor.type == option - 2 && !cursor.entity) {
        this.context.fillStyle = colors.menu_fill_active.style;
        this.context.strokeStyle = colors.menu_outline_active.style;
      } else {
        this.context.fillStyle = colors.menu_outline_idle.style;
        this.context.strokeStyle = colors.menu_fill_idle.style;
      }
      this.context.fillRect(x + this.padding, y + this.padding, option_width, option_height);
      this.context.strokeRect(x + this.padding, y + this.padding, option_width, option_height);

      if (cursor.type == option - 2 && !cursor.entity)
        this.context.fillStyle = colors.menu_text_active.style;
      else
        this.context.fillStyle = colors.menu_text_idle.style;
      this.context.fillText(string, center_x, y + option_name_y);
      this.context.fillText("x" + option, center_x, y + option_amount_y);

      if (option === 0 || option == 1)
        continue;

      ct.push(option - 2);
      cx.push(center_x - board.col_width / 2);
      cy.push(y + option_image_y - board.row_height / 2);
    }

    //draw the entity options
    for (option = 0; option < entity_types.length; option++) {

      if (this.horizontal) {
        x = this.col_width * option;
        center_x = x + this.col_width / 2;
        y = this.row_height;
      } else {
        x = this.col_width;
        center_x = x + this.col_width / 2;
        y = this.row_height * option;
      }


      string = cell_types[option];


      if (cursor.type == option && cursor.entity) {
        this.context.fillStyle = colors.menu_fill_active.style;
        this.context.strokeStyle = colors.menu_outline_active.style;
      } else {
        this.context.fillStyle = colors.menu_outline_idle.style;
        this.context.strokeStyle = colors.menu_fill_idle.style;
      }
      this.context.fillRect(x + this.padding, y + this.padding, option_width, option_height);
      this.context.strokeRect(x + this.padding, y + this.padding, option_width, option_height);

      if (cursor.type == option && cursor.entity)
        this.context.fillStyle = colors.menu_text_active.style;
      else
        this.context.fillStyle = colors.menu_text_idle.style;
      this.context.fillText(entity_types[option].name, center_x, y + option_name_y);
      this.context.fillText("x" + option, center_x, y + option_amount_y);

      if (option > 0) {
        et.push(option);
        ex.push(center_x);
        ey.push(y + option_image_y);
      }
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

    this.select(selected_col, selected_row);
  };

  this.select = function (col, row) {
    if (this.horizontal) {

      if (row === 0 && col === 0) {
        new_state = states.menu;
      } else {
        if (row === 0 && col < cell_types.length + 2) {
          cursor.set_type(false, col - 2);
        }
        if (row === 1 && col < entity_types.length) {
          cursor.set_type(true, col);
        }
      }
    } else {
      if (row === 0 && col === 0) {
        new_state = states.menu;
      } else {
        if (col === 0 && row < cell_types.length + 21) {
          cursor.set_type(false, row - 2);
        }
        if (col === 1 && row < entity_types.length) {
          cursor.set_type(true, row);
        }
      }
    }
  };

  this.mouse_move = function () {

  };

};