/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var Graph = function (position, size, padding) {
  this.x = position.x;
  this.y = position.y;
  this.w = size.x;
  this.h = size.y;
  this.row_height = this.h / 2;
  this.col_width = this.w / 2;
  this.padding = padding;

  this.radius = get_radius(this.col_width, this.row_height);

  this.canvas = graph_canvas;
  //this.canvas.style.border =  "1px solid blue";

  this.canvas.width  = this.w + line_width * 2;
  this.canvas.height = this.h + line_width * 2;
  this.canvas.style.left = this.x + "px";
  this.canvas.style.top = this.y + "px";

  this.context = this.canvas.getContext('2d');

  this.resize = function () {
    var x = window.innerWidth / 2 - this.w / 2;

    this.canvas.style.left = x + "px";

  };
  this.resize();

  this.draw = function () {
    var c = this.context;

    var start_angle = 0;
    var end_angle = 0;
    var circle = 2 * Math.PI;
    var population = populations[populations.length - 1];

    var center_x = this.w/ 2 + line_width;
    var center_y = this.h/ 2 + line_width;

    for (var cell_type = 0; cell_type < cell_types.length; cell_type++) {

      end_angle += circle * population.cell_ratios[cell_type];

      c.fillStyle = cell_types[cell_type].color.style;
      c.beginPath();
      c.moveTo(center_x- this.col_width / 2,center_y - this.row_height / 2);
      c.arc(center_x- this.col_width / 2,center_y- this.row_height / 2, this.radius, start_angle, end_angle);
      c.lineTo(center_x- this.col_width / 2,center_y - this.row_height / 2);
      c.fill();

      c.strokeStyle = colors.cursor.style;
      c.beginPath();
      c.moveTo(center_x- this.col_width / 2,center_y- this.row_height / 2);
      c.arc(center_x- this.col_width / 2,center_y- this.row_height / 2, this.radius, start_angle, end_angle);
      c.lineTo(center_x- this.col_width / 2,center_y- this.row_height / 2);
      c.stroke();

      start_angle = end_angle;

      //line graph
      c.lineWidth = 2;
      c.strokeStyle = colors.cursor.style;
      c.beginPath();
      c.moveTo(center_x - this.col_width, center_y);
      c.lineTo(center_x - this.col_width, center_y + this.row_height);
      c.lineTo(center_x, center_y + this.row_height);
      c.stroke();

      c.strokeStyle = cell_types[cell_type].color.style;
      c.beginPath();
      for (var phase = 0; phase < populations.length; phase++) {
        var x = this.col_width * phase / populations_length;
        var y = this.row_height * populations[phase].cell_ratios[cell_type];
        c.lineTo(center_x - this.col_width + x, center_y + this.row_height - y);
      }
      c.stroke();
    }

    var entity_scale = 1;
    var entity_ratio = population.total_entities / population.total_cells;
    entity_scale = entity_ratio / 2 + 0.5;

    for (var entity_type = 1; entity_type < entity_types.length; entity_type++) {

      end_angle += circle * population.entity_ratios[entity_type];

      c.fillStyle = entity_types[entity_type].color.style;
      c.beginPath();
      c.moveTo(center_x + this.col_width / 2,center_y - this.row_height / 2);
      c.arc(center_x + this.col_width / 2,center_y - this.row_height / 2, this.radius * entity_scale, start_angle, end_angle);
      c.lineTo(center_x + this.col_width / 2,center_y - this.row_height / 2);
      c.fill();

      c.strokeStyle = colors.cursor.style;
      c.beginPath();
      c.moveTo(center_x + this.col_width / 2,center_y - this.row_height / 2);
      c.arc(center_x + this.col_width / 2,center_y - this.row_height / 2, this.radius * entity_scale, start_angle, end_angle);
      c.lineTo(center_x + this.col_width / 2,center_y - this.row_height / 2);
      c.stroke();

      start_angle = end_angle;

      //line graph
      c.strokeStyle = colors.cursor.style;
      c.beginPath();
      c.moveTo(center_x, center_y);
      c.lineTo(center_x,center_y +  this.row_height);
      c.lineTo(center_x + this.col_width,center_y +  this.row_height);
      c.stroke();

      c.strokeStyle = entity_types[entity_type].color.style;
      c.beginPath();
      for (var phase = 0; phase < populations.length; phase++) {
        var x = this.col_width * phase / populations_length;
        var y = this.row_height * populations[phase].entity_ratios[entity_type];
        c.lineTo(center_x + x,center_y + this.row_height - y);
      }
      c.stroke();
    }
  };
};
