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
  this.col_width = this.w / 2;
  this.row_height = this.h / 2;
  this.padding = padding;

  this.radius = get_radius(this.col_width, this.row_height);

  this.render = function (c) {

    var start_angle = 0;
    var end_angle = 0;
    var circle = 2 * Math.PI;
    var population = populations[populations.length - 1];

    for (var cell_type = 0; cell_type < cell_types.length; cell_type++) {

      end_angle += circle * population.cell_ratios[cell_type];

      c.fillStyle = cell_types[cell_type].color.string;
      c.beginPath();
      c.moveTo(this.x - this.col_width / 2, this.y - this.row_height / 2);
      c.arc(this.x - this.col_width / 2, this.y - this.row_height / 2, this.radius, start_angle, end_angle);
      c.lineTo(this.x - this.col_width / 2, this.y - this.row_height / 2);
      c.fill();

      c.strokeStyle = colors.cursor.string;
      c.beginPath();
      c.moveTo(this.x - this.col_width / 2, this.y - this.row_height / 2);
      c.arc(this.x - this.col_width / 2, this.y - this.row_height / 2, this.radius, start_angle, end_angle);
      c.lineTo(this.x - this.col_width / 2, this.y - this.row_height / 2);
      c.stroke();

      start_angle = end_angle;

      //line graph
      c.lineWidth = 2;
      c.strokeStyle = colors.cursor.string;
      c.beginPath();
      c.moveTo(this.x - this.col_width, this.y);
      c.lineTo(this.x - this.col_width, this.y + this.row_height);
      c.lineTo(this.x, this.y + this.row_height);
      c.stroke();

      c.strokeStyle = cell_types[cell_type].color.string;
      c.beginPath();
      for (var phase = 0; phase < populations.length; phase++) {
        var x = this.col_width * phase / populations_length;
        var y = this.row_height * populations[phase].cell_ratios[cell_type];
        c.lineTo(this.x - this.col_width + x, this.y + this.row_height - y);
      }
      c.stroke();
    }

    var entity_scale = 1;
    var entity_ratio = population.total_entities / population.total_cells;
    entity_scale = entity_ratio / 2 + 0.5;

    for (var entity_type = 1; entity_type < entity_types.length; entity_type++) {

      end_angle += circle * population.entity_ratios[entity_type];

      c.fillStyle = entity_types[entity_type].color.string;
      c.beginPath();
      c.moveTo(this.x + this.col_width / 2, this.y - this.row_height / 2);
      c.arc(this.x + this.col_width / 2, this.y - this.row_height / 2, this.radius * entity_scale, start_angle, end_angle);
      c.lineTo(this.x + this.col_width / 2, this.y - this.row_height / 2);
      c.fill();

      c.strokeStyle = colors.cursor.string;
      c.beginPath();
      c.moveTo(this.x + this.col_width / 2, this.y - this.row_height / 2);
      c.arc(this.x + this.col_width / 2, this.y - this.row_height / 2, this.radius * entity_scale, start_angle, end_angle);
      c.lineTo(this.x + this.col_width / 2, this.y - this.row_height / 2);
      c.stroke();

      start_angle = end_angle;

      //line graph
      c.strokeStyle = colors.cursor.string;
      c.beginPath();
      c.moveTo(this.x, this.y);
      c.lineTo(this.x, this.y + this.row_height);
      c.lineTo(this.x + this.col_width, this.y + this.row_height);
      c.stroke();

      c.strokeStyle = entity_types[entity_type].color.string;
      c.beginPath();
      for (var phase = 0; phase < populations.length; phase++) {
        var x = this.col_width * phase / populations_length;
        var y = this.row_height * populations[phase].entity_ratios[entity_type];
        c.lineTo(this.x + x, this.y + this.row_height - y);
      }
      c.stroke();
    }
  };
};