/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var Board = function (position, size, grid, depth, line_width) {
  this.x = position.x;
  this.y = position.y;
  this.w = size.x;
  this.h = size.y;
  this.cols = grid.x;
  this.rows = grid.y;
  this.line_width = line_width;

  this.col_width = this.w / this.cols;
  this.row_height = this.h / this.rows;

  this.depth = depth * this.row_height;

  this.draw = function (c) {
    this.draw_cells(c);
    this.draw_cell_lines(c);
    this.draw_entities(c);
  };

  this.draw_cells = function (c) {
    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        var cell = cells[col][row];
        //draw normal cell area first
        c.fillStyle = cell.color.string;
        c.fillRect(
          this.x + this.col_width * col + this.line_width,
          this.y + this.row_height * row + this.line_width,
          this.col_width - this.line_width,
          this.row_height - this.line_width);
        if (check_cell_type(cell, cell_types.water)) {
          if (row > 0) {
            var cell_above = cells[col][row - 1];
            if (!check_cell_type(cell_above, cell_types.water)) {
              //draw cell above's front side
              c.fillStyle = mix_colors(cell.color, cell_above.color.darken()).string;
              c.fillRect(
                this.x + this.col_width * col + this.line_width,
                this.y + this.row_height * row + this.line_width,
                this.col_width - this.line_width,
                this.depth - this.line_width);

              //draw cell above's front line
              c.fillStyle = mix_colors(cell.color, cell_above.color.darken().darken()).string;
              c.fillRect(
                this.x + this.col_width * col + this.line_width,
                this.y + this.row_height * row + this.depth,
                this.col_width - this.line_width,
                this.line_width);
            }
          }
        }
        //draw half-row at the bottom
        if (row == this.rows - 1) {
          c.fillStyle = cell.color.darken().string;
          c.fillRect(
            this.x + this.col_width * col + this.line_width,
            this.y + this.row_height * (row + 1) + this.line_width,
            this.col_width - this.line_width,
            this.depth - this.line_width);
        }
      }
    }
  }; // end Board.draw_cells

  this.draw_cell_lines = function (c) {
    //outline cells
    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        var cell = cells[col][row];
        c.fillStyle = cell.color.darken().string;

        //top
        if (row > 0) {
          var cell_above = cells[col][row - 1];
          if (cell.name != cell_above.name) {
            c.fillStyle = mix_colors(cell.color, cell_above.color).darken().string;
          }
        }
        c.fillRect(
          this.x + this.col_width * col + this.line_width,
          this.y + this.row_height * row,
          this.col_width - this.line_width,
          this.line_width);

        //bottom
        c.fillStyle = cell.color.darken().darken().string;
        if (row == this.rows - 1) {
          //bottom line on top half of bottom cells
          c.fillRect(
            this.x + this.col_width * col + this.line_width,
            this.y + this.row_height * (row + 1),
            this.col_width - this.line_width,
            this.line_width);
          //bottom line on bottom half of bottom cells
          c.fillRect(
            this.x + this.col_width * col + this.line_width,
            this.y + this.row_height * (row + 1) + this.depth,
            this.col_width - this.line_width,
            this.line_width);

          if (col > 0) {
            var cell_left = cells[col - 1][row];
            c.fillStyle = mix_colors(cell.color, cell_left.color).darken().darken().string;
          }
          //right line on bottom half of bottom cells
          c.fillRect(
            this.x + this.col_width * col,
            this.y + this.row_height * (row + 1),
            this.line_width,
            this.depth + this.line_width);

          if (col == this.cols - 1) {
            //right line on bottom half of bottom right cell
            c.fillStyle = cell.color.darken().darken().string;
            c.fillRect(
              this.x + this.col_width * (col + 1),
              this.y + this.row_height * (row + 1),
              this.line_width,
              this.depth + this.line_width);
          }

        }
        //left
        c.fillStyle = cell.color.darken().string;
        if (col > 0) {
          var cell_left = cells[col - 1][row];
          if (cell.name != cell_left.name) {
            c.fillStyle = mix_colors(cell.color, cell_left.color).darken().string;
          }
        }
        c.fillRect(
          this.x + this.col_width * col,
          this.y + this.row_height * row,
          this.line_width,
          this.row_height);

        //right
        if (col == this.cols - 1) {
          c.fillStyle = cell.color.darken().string;
          c.fillRect(
            this.x + this.col_width * (col + 1),
            this.y + this.row_height * row,
            this.line_width,
            this.row_height);
        }
      }
    }
  }; // end Board.draw_cell_lines

  this.draw_entities = function (c) {
    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        var entity = entities[col][row];
        if (!check_entity_type(entity, entity_types.noEntity)) {
          var cell = cells[col][row];
          var bobbing_offset = 0;
          if (check_cell_type(cell, cell_types.water))
            bobbing_offset = get_bobbing_offset(col, row);
          var scale = 1;
          if (entity.ling)
            scale = 0.75;

          //ground shadow first
          c.fillStyle = cell.color.darken().string;
          c.save();
          var scale_x = 1.5;
          var scale_y = 0.5;
          c.scale(scale_x, scale_y);
          c.beginPath();
          c.arc(
            (this.x + this.col_width * col + this.col_width / 2 + this.line_width) / scale_x, (this.y + this.row_height * row + this.row_height / 1.75 + this.line_width) / scale_y, (this.row_height / 2 - this.line_width) * scale,
            0,
            2 * Math.PI);
          c.restore();
          c.fill();

          //entity circle
          c.fillStyle = entity.color.string;
          c.beginPath();
          c.arc(
            this.x + this.col_width * col + this.col_width / 2 + this.line_width,
            this.y + this.row_height * row + this.row_height / 4 + this.line_width + bobbing_offset * scale, (this.row_height / 2 - this.line_width) * scale,
            0,
            2 * Math.PI);
          c.fill();

          //entity outline
          c.strokeStyle = entity.color.darken().darken().string;
          c.beginPath();
          c.arc(
            this.x + this.col_width * col + this.col_width / 2 + this.line_width,
            this.y + this.row_height * row + this.row_height / 4 + this.line_width + bobbing_offset * scale, (this.row_height / 2 - this.line_width) * scale,
            0,
            2 * Math.PI);
          c.stroke();


          if (check_cell_type(cell, cell_types.water)) {
            var bobbing_degree = get_bobbing_degree(col, row);

            c.fillStyle = mix_colors(entity.color, colors.water).darken().string;
            c.beginPath();
            c.arc(
              this.x + this.col_width * col + this.col_width / 2 + this.line_width,
              this.y + this.row_height * row + this.row_height / 4 + this.line_width + bobbing_offset * scale, (this.row_height / 2 - this.line_width) * scale, (0.2 - bobbing_degree / Math.PI / 4) * Math.PI, (0.8 + bobbing_degree / Math.PI / 4) * Math.PI);
            c.fill();

            c.strokeStyle = mix_colors(entity.color.darken().darken(), colors.water).string;
            c.beginPath();
            c.arc(
              this.x + this.col_width * col + this.col_width / 2 + this.line_width,
              this.y + this.row_height * row + this.row_height / 4 + this.line_width + bobbing_offset * scale, (this.row_height / 2 - this.line_width) * scale, (0.2 - bobbing_degree / Math.PI / 4) * Math.PI, (0.8 + bobbing_degree / Math.PI / 4) * Math.PI);
            c.stroke();
          }
        }
      }
    } // end Board.draw_entities
  };

  this.next_phase = function () {
    phase++;
    cellsPrev = JSON.parse(JSON.stringify(cells));
    entitiesPrev = JSON.parse(JSON.stringify(entities));

    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        var cell = cells[col][row];
        var entity = entities[col][row];
        if (cell.next_phase)
          cell.next_phase(col, row);
        if (entity.next_phase)
          entity.next_phase(col, row);
      }
    }

    populations.push(new Population(cells, entities));
    while (populations.length > populations_length)
      populations.shift();
  };

  //takes point on canvas
  //returns cell on grid 
  this.target = function (x, y) {
    var return_col;
    var return_row;

    if (x < this.x ||
      x >= this.x + this.w) {
      return_col = -1;
    } else {
      return_col = (x - this.x) / this.col_width;
      return_col = Math.floor(return_col);
    }
    if (y < this.y ||
      y >= this.y + this.h) {
      return_row = -1;
    } else {
      return_row = (y - this.y) / this.row_height;
      return_row = Math.floor(return_row);
    }

    var return_point = new Point(return_col, return_row);
    return return_point;
  };

  //takes column and row on board
  //returns center of cell
  this.draw_point = function (col, row) {
    var return_x;
    var return_y;

    if (col < 0 || col > this.cols - 1) {
      return_x = -1;
    } else {
      return_x = col * this.col_width + this.x;
      return_x += this.col_width / 2;
    }

    if (row < 0 || row > this.rows - 1) {
      return_y = -1;
    } else {
      return_y = row * this.row_height + this.y;
      return_y += this.row_height / 2;
    }

    var return_point = new Point(return_x, return_y);
    return return_point;
  };

  this.set_cell = function (col, row, cell_type) {
    cells[col][row] = cell_type.make();
  };
  this.set_entity = function (col, row, entity_type) {
    entities[col][row] = base_entity.make(entity_type);
  };
  this.fill_cells = function (cell_type) {
    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        cells[col][row] = cell_type.make();
      }
    }
  };
  this.fill_entities = function (entity_type) {
    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        entities[col][row] = entity_type.make();
      }
    }
  };
}; // end Board