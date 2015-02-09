/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var Cursor = function (position, size, speed) {
  this.x = position.x;
  this.y = position.y;
  this.w = size.x;
  this.h = size.y;
  this.speed = speed;

  this.canvas = cursor_canvas;
  //this.canvas.style.border =  "1px solid blue";

  this.canvas.width  = this.w + line_width * 2;
  this.canvas.height = this.h + line_width * 2;
  this.canvas.style.left = this.x + "px";
  this.canvas.style.top = this.y + "px";
  this.context = this.canvas.getContext('2d');

  this.entity = false;
  this.type = 0;

  this.color = cell_types[0].color;
  this.name = cell_types[0].name;

  this.move = function (direction, time_passed_since_last_frame) {
    //direction can be any distance from (-2,-2) to (+2,+2)


    direction.x /= 2;
    direction.y /= 2;

    var distance = new Point(direction.x * this.speed,
      direction.y * this.speed);

    this.x += distance.x * time_passed_since_last_frame / 1000;
    this.y += distance.y * time_passed_since_last_frame / 1000;
    this.contain();

    var ui_x = this.x - this.w / 2 - line_width;
    var ui_y = this.y - this.h / 2 - line_width;
    this.canvas.style.left = ui_x + "px";
    this.canvas.style.top = ui_y + "px";

  };

  this.move_to = function(x, y) {
    this.x = x;
    this.y = y;
    this.contain();
    var ui_x = this.x - this.w / 2 - line_width;
    var ui_y = this.y - this.h / 2 - line_width;
    this.canvas.style.left = ui_x + "px";
    this.canvas.style.top = ui_y + "px";
  };


  this.contain = function () {
    if (this.x < 0)
      this.x = 0;
    else if (this.x >= bg_canvas.width)
      this.x = bg_canvas.width - 1;
    if (this.y < 0)
      this.y = 0;
    else if (this.y >= bg_canvas.height)
      this.y = bg_canvas.height - 1;
  };


  this.set_type = function (entity, type) {
    redraw_cursor = true;
    redraw_toolbox = true;
    this.entity = entity;
    this.type = type;
    if (entity) {
        this.color = entity_types[this.type].color;
        this.name = entity_types[this.type].name;
    } else {
        this.color = cell_types[this.type].color;
        this.name = cell_types[this.type].name;
    }
  };

  this.cycle_type = function () {
    redraw_cursor = true;
    redraw_toolbox = true;
    this.type += 1;
    if (this.entity) {
      if (this.type >= entity_types.length) {
        this.type = 0;
        this.entity = false;
        this.color = cell_types[this.type].color;
        this.name = cell_types[this.type].name;
      } else {
        this.color = entity_types[this.type].color;
        this.name = entity_types[this.type].name;
      }
    } else { //cell
      if (this.type >= cell_types.length) {
        this.type = 0;
        this.entity = true;
        this.color = entity_types[this.type].color;
        this.name = entity_types[this.type].name;
      } else {
        this.color = cell_types[this.type].color;
        this.name = cell_types[this.type].name;
      }
    }
  };
  this.recycle_type = function () {
    redraw_cursor = true;
    redraw_toolbox = true;
    this.type -= 1;
    if (this.entity) {
      if (this.type < 0) {
        this.type = cell_types.length - 1;
        this.entity = false;
        this.color = cell_types[this.type].color;
        this.name = cell_types[this.type].name;
      } else {
        this.color = entity_types[this.type].color;
        this.name = entity_types[this.type].name;
      }
    } else { //cell
      if (this.type < 0) {
        this.type = entity_types.length - 1;
        this.entity = true;
        this.color = entity_types[this.type].color;
        this.name = entity_types[this.type].name;
      } else {
        this.color = cell_types[this.type].color;
        this.name = cell_types[this.type].name;
      }
    }
  };

  this.trigger = function (col, row) {
    redraw_static = true;
    if (this.entity) {
      board.set_entity(col, row, entity_types[this.type]);
    } else {
      board.set_cell(col, row, cell_types[this.type]);
    }
  };
  this.fill = function (col, row) {
    redraw_static = true;
    if (this.entity) {
      board.fill_entities(entity_types[this.type]);
    } else {
      board.fill_cells(cell_types[this.type]);
    }
  };
  this.draw_triangle = function (c, point1, point2, point3, fillStyle, strokeStyle) {
    c.beginPath();
    c.moveTo(point1.x, point1.y);
    c.lineTo(point2.x, point2.y);
    c.lineTo(point3.x, point3.y);
    c.closePath();
    c.fillStyle = fillStyle;
    c.fill();

    c.beginPath();
    c.moveTo(point1.x, point1.y);
    c.lineTo(point2.x, point2.y);
    c.lineTo(point3.x, point3.y);
    c.closePath();
    c.strokeStyle = strokeStyle;
    c.stroke();
  };


  this.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  this.draw = function (c) {
    this.draw_triangle(this.context,
      new Point(this.x, this.y + this.h / 4),
      new Point(this.x - this.w / 4, this.y + this.h / 2 + this.h / 8),
      new Point(this.x + this.w / 4, this.y + this.h / 2 + this.h / 8),
      this.color.style, colors.white.style);
    this.draw_triangle(this.context,
      new Point(this.x, this.y - this.h / 4),
      new Point(this.x - this.w / 4, this.y - this.h / 2 - this.h / 8),
      new Point(this.x + this.w / 4, this.y - this.h / 2 - this.h / 8),
      this.color.style, colors.white.style);
    this.draw_triangle(this.context,
      new Point(this.x - this.w / 4, this.y),
      new Point(this.x - this.w / 2 - this.w / 8, this.y - this.h / 4),
      new Point(this.x - this.w / 2 - this.w / 8, this.y + this.h / 4),
      this.color.style, colors.white.style);
    this.draw_triangle(this.context,
      new Point(this.x + this.w / 4, this.y),
      new Point(this.x + this.w / 2 + this.w / 8, this.y - this.h / 4),
      new Point(this.x + this.w / 2 + this.w / 8, this.y + this.h / 4),
      this.color.style, colors.white.style);

    this.context.fillStyle = colors.cursor.style;
    this.context.beginPath();
    this.context.arc(this.x, this.y, 2, 0, 2 * Math.PI);
    this.context.fill();
  };

  this.draw2 = function (c) {
    var base_x = this.w / 2 + line_width;
    var base_y = this.h / 2 + line_width;
    var w_2 = this.w / 2;
    var w_4 = w_2 / 2;
    var h_2 = this.h / 2;
    var h_4 = h_2 / 2;
    this.context.lineWidth = 2;
    //bottom
    this.draw_triangle(this.context,
      new Point(base_x, base_y + h_4),
      new Point(base_x - w_4, base_y + h_2),
      new Point(base_x + w_4, base_y + h_2),
      this.color.style, colors.white.style);
    //top
    this.draw_triangle(this.context,
      new Point(base_x, base_y - h_4),
      new Point(base_x - w_4, base_y - h_2),
      new Point(base_x + w_4, base_y - h_2),
      this.color.style, colors.white.style);
    //left
    this.draw_triangle(this.context,
      new Point(base_x - w_4, base_y),
      new Point(base_x - w_2, base_y - h_4),
      new Point(base_x - w_2, base_y + h_4),
      this.color.style, colors.white.style);
    //right
    this.draw_triangle(this.context,
      new Point(base_x + w_4, base_y),
      new Point(base_x + w_2, base_y - h_4),
      new Point(base_x + w_2, base_y + h_4),
      this.color.style, colors.white.style);

    this.context.fillStyle = colors.cursor.style;
    this.context.beginPath();
    this.context.arc(base_x, base_y, 2, 0, 2 * Math.PI);
    this.context.fill();
  };
}; // end Cursor
