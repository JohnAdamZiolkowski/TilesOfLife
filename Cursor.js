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
  };
  this.contain = function () {
    if (this.x < 0)
      this.x = 0;
    else if (this.x >= canvas.width)
      this.x = canvas.width - 1;
    if (this.y < 0)
      this.y = 0;
    else if (this.y >= canvas.height)
      this.y = canvas.height - 1;
  };


  this.set_type = function (entity, type) {
    this.entity = entity;
    this.type = type;
  };

  this.cycle_type = function () {
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
    if (this.entity) {
      board.set_entity(col, row, entity_types[this.type]);
    } else {
      board.set_cell(col, row, cell_types[this.type]);
    }
  };
  this.fill = function (col, row) {
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
  this.draw = function (c) {
    this.draw_triangle(c,
      new Point(this.x, this.y + this.h / 4),
      new Point(this.x - this.w / 4, this.y + this.h / 2 + this.h / 8),
      new Point(this.x + this.w / 4, this.y + this.h / 2 + this.h / 8),
      this.color.string, colors.white.string);
    this.draw_triangle(c,
      new Point(this.x, this.y - this.h / 4),
      new Point(this.x - this.w / 4, this.y - this.h / 2 - this.h / 8),
      new Point(this.x + this.w / 4, this.y - this.h / 2 - this.h / 8),
      this.color.string, colors.white.string);
    this.draw_triangle(c,
      new Point(this.x - this.w / 4, this.y),
      new Point(this.x - this.w / 2 - this.w / 8, this.y - this.h / 4),
      new Point(this.x - this.w / 2 - this.w / 8, this.y + this.h / 4),
      this.color.string, colors.white.string);
    this.draw_triangle(c,
      new Point(this.x + this.w / 4, this.y),
      new Point(this.x + this.w / 2 + this.w / 8, this.y - this.h / 4),
      new Point(this.x + this.w / 2 + this.w / 8, this.y + this.h / 4),
      this.color.string, colors.white.string);

    c.fillStyle = colors.cursor.string;
    c.beginPath();
    c.arc(this.x, this.y, 2, 0, 2 * Math.PI);
    c.fill();
  };
}; // end Cursor