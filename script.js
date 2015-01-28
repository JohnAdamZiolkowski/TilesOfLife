/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

//region variable declarations
var cells;
var entities;
var cellsPrev;
var entitiesPrev;
var cell_types;
var entity_types;
var entity_types2; //TEMPORARY
var action_types;
var populations;
var base_entity;

var score;
var message;

var board_position;
var board_size;
var board_grid;
var board_depth;
var line_width;
var cursor_position;
var cursor_size;
var cursor_speed;
var populations_length;

var colors;

var canvas;
var c;

var cursor;
var board;
var phase;
var graph;
var graph_position;
var graph_size;
var graph_padding;

var keysDownPrev = {};
var keysUpPrev = {};
var keysDown = {};
var keysUp = {};
var tabbing;
var entering;
var spacing;
//endregion

//region startup

var init = function () {
  canvas = document.getElementById('world');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  c = canvas.getContext('2d');

  tabbing = false;
  entering = false;
  spacing = false;
  phase = 0;
  score = 0;

  set_colors();
  set_cell_types();
  set_entity_types();
  set_entity_types2();
  set_action_types();
  set_defaults();
  
  base_entity = new Entity();

  board = new Board(board_position, board_size, board_grid,
    board_depth, line_width);

  generate_cells();
  generate_entities();

  cursor = new Cursor(cursor_position, cursor_size, cursor_speed);
  populations = new Array();
  populations.push(new Population(cells, entities));
  graph = new Graph(graph_position, graph_size, graph_padding);
}; // end init

var set_defaults = function () {
  board_position = new Point(240, 100);
  board_size = new Point(400, 400);
  board_grid = new Point(8, 16);
  board_depth = 0.33;
  line_width = 2;

  cursor_position = new Point(340, 50);
  cursor_size = new Point(50, 50);
  cursor_speed = 10;

  populations_length = 32;
  graph_position = new Point(450, 650);
  graph_size = new Point(400, 200);
  //TODO: implement graph_padding
  graph_padding = 25;
}; // end set_defautls

var set_colors = function () {
  colors = new Object();
  colors.white = new Color(255, 255, 255);
  colors.cursor = new Color(255, 255, 255);
  colors.debug = new Color(255, 0, 0);

  colors.stone = new Color(90, 90, 90);
  colors.dirt = new Color(120, 90, 60);
  colors.grass = new Color(60, 120, 60);
  colors.water = new Color(60, 90, 120);

  colors.entity_line = new Color(0, 0, 0);
  colors.sheep = new Color(150, 150, 150);
  colors.sheepling = new Color(200, 150, 150);
  colors.wolf = new Color(90, 45, 45);
  colors.wolfling = new Color(120, 60, 60);
}; // end set_colors

var set_cell_types = function () {
  cell_types = new Array();
  cell_types.push(new Stone());
  cell_types.push(new Dirt());
  cell_types.push(new Grass());
  cell_types.push(new Water());

  var i = 0;
  cell_types.stone = cell_types[i++];
  cell_types.dirt = cell_types[i++];
  cell_types.grass = cell_types[i++];
  cell_types.water = cell_types[i++];
}; // end set_cell_types

var set_entity_types = function () {
  entity_types = new Array();
  entity_types.push(new NoEntity());
  entity_types.push(new Sheep());
  entity_types.push(new Wolf());
  entity_types.push(new Sheepling());
  entity_types.push(new Wolfling());

  var i = 0;
  entity_types.noEntity = entity_types[i++];
  entity_types.sheep = entity_types[i++];
  entity_types.wolf = entity_types[i++];
  entity_types.sheepling = entity_types[i++];
  entity_types.wolfling = entity_types[i++];
}; // end set_entity_types

//endregion

//region class definitions

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

  this.move = function (direction) {
    //direction can be any distance from (-2,-2) to (+2,+2)
    direction.x /= 2;
    direction.y /= 2;

    var distance = new Point(direction.x * this.speed,
      direction.y * this.speed);

    this.x += distance.x;
    this.y += distance.y;

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

var Point = function (x, y) {
  this.x = x;
  this.y = y;
  this.w = x;
  this.h = y;
  this.col = x;
  this.row = y;
}; // end Point

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

var Color = function (red, green, blue) {
  this.red = red;
  this.green = green;
  this.blue = blue;

  this.string = 'rgb(' + this.red + ', ' + this.green + ', ' + this.blue + ')';

  this.darken = function () {
    var modifier = 1 / 4 * 3;
    return new Color(Math.floor(this.red * modifier), Math.floor(this.green * modifier), Math.floor(this.blue * modifier));
  };
}; // end Color

//endregion

//region cell and entity definitions

var NoEntity = function () {
  this.name = "noEntity";
  this.color = colors.cursor;
  this.make = function () {
    return new NoEntity();
  };
};
var Sheep = function () {
  this.name = "sheep";
  this.color = colors.sheep;

  this.max_food = 4;
  this.max_health = 4;
  this.max_water = 4;
  this.spawn = entity_types.sheepling;
  this.grazing_type = cell_types.grass;

  this.age = 0;
  this.food = this.max_food / 2;
  this.health = this.max_health / 2;
  this.water = this.max_water / 2;

  this.randomize = function () {
    this.food = get_random_int(1, this.max_food);
    this.health = get_random_int(1, this.max_health);
    this.water = get_random_int(1, this.max_water);
  };
  this.make = function () {
    return new Sheep();
  }
  this.next_phase = function (col, row) {
    this.age++;
    base_entity.choose_action(this, col, row);
  };
};
var Wolf = function () {
  this.name = "wolf";
  this.color = colors.wolf;

  this.max_food = 4;
  this.max_health = 4;
  this.max_water = 4;

  this.age = 0;
  this.food = this.max_food / 2;
  this.health = this.max_health / 2;
  this.water = this.max_water / 2;
  this.spawn = entity_types.wolfling;

  this.randomize = function () {
    this.food = get_random_int(1, this.max_food);
    this.health = get_random_int(1, this.max_health);
    this.water = get_random_int(1, this.max_water);
  };
  this.make = function () {
    return new Wolf();
  };
  this.next_phase = function (col, row) {
    this.age++;
    base_entity.choose_action(this, col, row);
  }

};
var get_adjacent_entities_locations = function (col, row, entity_type) {
  var locations = new Array();
  if (col > 0)
    if (check_entity_type(entities[col - 1][row], entity_type)) {
      locations.push(new Point(col - 1, row));
    }
  if (col < board.cols - 1)
    if (check_entity_type(entities[col + 1][row], entity_type)) {
      locations.push(new Point(col + 1, row));
    }
  if (row > 0)
    if (check_entity_type(entities[col][row - 1], entity_type)) {
      locations.push(new Point(col, row - 1));
    }
  if (row < board.rows - 1)
    if (check_entity_type(entities[col][row + 1], entity_type)) {
      locations.push(new Point(col, row + 1));
    }
  return locations;
};
var get_random_item = function (array) {
  if (array.length > 0)
    return array[get_random_int(0, array.length - 1)];
  else
    return false;
};
var Sheepling = function () {
  this.name = "sheepling";
  this.color = colors.sheepling;

  this.max_food = 4;
  this.max_health = 4;
  this.max_water = 4;
  this.ling = true;
  this.adult = entity_types.sheep;
  this.max_age = 4;

  this.age = 0;
  this.food = this.max_food / 2;
  this.health = this.max_health / 2;
  this.water = this.max_water / 2;

  this.randomize = function () {
    this.food = get_random_int(1, this.max_food);
    this.health = get_random_int(1, this.max_health);
    this.water = get_random_int(1, this.max_water);
  };
  this.make = function () {
    return new Sheepling();
  };
  this.next_phase = function (col, row) {
    this.age++;
    base_entity.choose_action(this, col, row);
  };
};

var set_action_types = function() {
action_types = new Array();
  action_types.nothing = "nothing";
  action_types.move = "move";
  action_types.graze = "graze";
  action_types.drink = "drink";
  action_types.suckle = "suckle";
  action_types.breed = "breed";
  action_types.evolve = "evolve";
  action_types.die = "die";
};
var set_entity_types2 = function() {
entity_types2 = new Array();
  entity_types2.noEntity = NoEntity;
  entity_types2.sheep = Sheep;
  entity_types2.wolf = Wolf;
  entity_types2.sheepling = Sheepling;
  entity_types2.wolfling = Wolfling;
};

var Entity = function () {
  this.about = function (entity) {
    var space = "<br>&nbsp&nbsp> ";
    var string = "";
    if (entity.name) string += space + "type: " + entity.name;
    if (entity.age) string += space + "age: " + entity.age + " phases";
    if (entity.last_action) string += space + "last action: " + entity.last_action;
    if (entity.food) string += space + "food: " + entity.food + "/" + entity.max_food;
    if (entity.health) string += space + "health: " + entity.health + "/" + entity.max_health;
    if (entity.water) string += space + "water: " + entity.water + "/" + entity.max_water;
    return string;
  };
  //TODO: implement Cell Factory
  this.make = function (entity_type) {
    return new entity_types2[entity_type .name]();
  };
  
  this.choose_action = function (entity, col, row) {
    var actions = new Array();

    //eat cell
    //only if hungry and standing on cell
    if (entity.grazing_type)
      if (entity.food < entity.max_food)
        if (check_cell_type(cellsPrev[col][row], entity.grazing_type))
          actions.push(action_types.graze);
    
    //TODO: DRINK
    //drink cell
    if (false)
      actions.push(action_types.drink);
    
    //TODO: MOVE
    //move
    if (false)
      actions.push(action_types.move);
    
    //suckle
    //only if parent nearby
    if (entity.adult)
      if (entity.food < entity.max_food)
        if (count_adjacent_entities(entitiesPrev, col, row, entity.adult) > 0)
          actions.push(action_types.suckle);

    //grow up
    //only if aged and in good shape
    if (entity.ling)
      if (entity.age >= entity.max_age)
        if (entity.food >= entity.max_food / 2 && 
          entity.health >= entity.max_health / 2 &&
          entity.water >= entity.max_water / 2)
            actions.push(action_types.evolve);
    
    //reproduce
    //only if well fed
    // TODO: need water and health as well
    if (entity.spawn && entity.food > entity.max_food / 2) {
      if (get_adjacent_entities_locations(col, row, entity_types.noEntity).length > 0) {
        actions.push(action_types.breed);
      }
    }
      
    //die
    if (entity.food <= 0)// || entity.water <= 0 || entity.health <= 0)
      actions.push(action_types.die);

    //TODO: weigh options very carefully
    var action = get_random_item(actions);
    if (actions.length === 0)
      action = action_types.nothing;
  
    entity.last_action = action;
    base_entity.perform_action(entity, action, col, row);
  }
  
  this.perform_action = function (entity, action, col, row) {
    switch (action) {
    case action_types.nothing:
      this.nothing(entity);
      break;
    case action_types.move:
      this.move(entity);
      break;
    case action_types.graze:
      this.graze(entity, col, row);
      break;
    case action_types.drink:
      this.drink(entity);
      break;
    case action_types.suckle:
      this.suckle(entity, col, row);
      break;
    case action_types.evolve:
      this.evolve(entity, col, row);
      break;
    case action_types.breed:
      this.breed(entity, col, row);
      break;
    case action_types.die:
      this.die(entity, col, row);
      break;
    }
  };
  this.nothing = function (entity) {
    entity.food--;
    //TODO: reduce water as well
  }
  this.move = function (entity, col, row, new_col, new_row) {
    move_entity(entity, new_col, new_row);
    //TODO: fill old slot
    //TODO: reduce food and water while moving?
  };
  this.graze = function (entity, col, row) {
    entity.food += 1;
    if (entity.food > entity.max_food)
      entity.food = entity.max_food;
    cells[col][row].graze(col, row);
  };
  this.drink = function (entity, cell) {
    entity.water ++;
    //TODO: drink cell
  };
  this.suckle = function (entity, col, row) {
    entity.food += 1;
    //TODO: old logic of more parents = faster growth
    //entity.food += count_adjacent_entities(entitiesPrev, col, row, entity.adult);
  };
  this.die = function (entity, col, row) {
    board.set_entity(col, row, entity_types.noEntity);
  };
  this.evolve = function (entity, col, row) {
    transform_entity(entity, entity.adult, col, row);
    entities[col][row].food = entities[col][row].max_food / 2;
  };
  this.breed = function (entity, col, row) {
    var location = get_random_item(get_adjacent_entities_locations(col, row, entity_types.noEntity))
      if (location) {
        entity.food = entity.max_food / 2;
        board.set_entity(location.x, location.y, entity.spawn);
      } else {
        entity.food = entity.max_food;
      }
  };
};

var transform_entity = function (entity, entity_type, col, row) {
  var new_entity = entity_type.make();

  if (entity.health) new_entity.health = entity.health;
  if (entity.food) new_entity.food = entity.food;
  if (entity.water) new_entity.water = entity.water;
  if (entity.age) new_entity.age = entity.age;
  if (entity.last_action) new_entity.last_action = entity.last_action;

  if (col && row)
    entities[col][row] = new_entity;

  return new_entity;
};

var move_entity = function (entity, col, row) {
  entities[col][row] = entity;
};

var Wolfling = function () {
  this.name = "wolfling";
  this.color = colors.wolfling;

  this.max_food = 4;
  this.max_health = 4;
  this.max_water = 4;
  this.ling = true;
  this.adult = entity_types.wolf;
  this.max_age = 4;

  this.age = 0;
  this.food = this.max_food / 2;
  this.health = this.max_health / 2;
  this.water = this.max_water / 2;

  this.randomize = function () {
    this.food = get_random_int(1, this.max_food);
    this.health = get_random_int(1, this.max_health);
    this.water = get_random_int(1, this.max_water);
  };
  this.make = function () {
    return new Wolfling();
  };
  this.next_phase = function (col, row) {
    this.age++;
    base_entity.choose_action(this, col, row);
  };
};

var Stone = function () {
  this.name = "stone";
  this.color = colors.stone;

  this.make = function () {
    return new Stone();
  }
  this.about = function () {
    var string = "";
    string += "<br>&nbsp&nbsp> type: " + this.name;
    return string;
  };
};
var Grass = function () {
  this.name = "grass";
  this.color = colors.grass;

  this.max_grass = 4;

  this.grass = this.max_grass;
  this.under = cell_types.dirt;

  this.make = function () {
    return new Grass();
  }
  this.graze = function (col, row) {
    this.grass--;
    if (this.grass <= 0)
      board.set_cell(col, row, this.under);
  };
  this.about = function () {
    var string = "";
    string += "<br>&nbsp&nbsp> type: " + this.name;
    string += "<br>&nbsp&nbsp> grass: " + this.grass + "/" + this.max_grass;
    return string;
  }
};
var Water = function () {
  this.name = "water";
  this.color = colors.water;

  this.make = function () {
    return new Water();
  }
  this.about = function () {
    var string = "";
    string += "<br>&nbsp&nbsp> type: " + this.name;
    return string;
  };
};
var Dirt = function () {
  this.name = "dirt";
  this.color = colors.dirt;

  this.max_seed = 4;

  this.seed = 0;

  this.randomize = function () {
    this.seed = get_random_int(1, this.max_seed);
  };
  this.grow = function () {
    //grow seeds
    if (this.seed > this.max_seed) {
      alert(this.name + "has grown too many seeds");
    }
  };

  this.make = function () {
    return new Dirt();
  }
  this.about = function () {
    var string = "";
    string += "<br>&nbsp&nbsp> type: " + this.name;
    string += "<br>&nbsp&nbsp> seed: " + this.seed + "/" + this.max_seed;
    return string;
  }
  this.next_phase = function (col, row) {
    this.seed += count_adjacent_cells(cellsPrev, col, row, cell_types.grass);
    if (this.seed >= this.max_seed) {
      board.set_cell(col, row, cell_types.grass);
    }
  }
};
//endregion

//region convenience functions

var get_random_int = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}; // end get_random_int

var mix_colors = function (color1, color2) {
  var red = Math.floor((color1.red + color2.red) / 2);
  var green = Math.floor((color1.green + color2.green) / 2);
  var blue = Math.floor((color1.blue + color2.blue) / 2);
  var mixed_color = new Color(red, green, blue);
  return mixed_color;
}; // end mix_colors

var count_adjacent_cells = function (cells, col, row, cell_type) {
  var count = 0;
  if (col > 0)
    if (check_cell_type(cells[col - 1][row], cell_type))
      count++;
  if (col < board.cols - 1)
    if (check_cell_type(cells[col + 1][row], cell_type))
      count++;
  if (row > 0)
    if (check_cell_type(cells[col][row - 1], cell_type))
      count++;
  if (row < board.rows - 1)
    if (check_cell_type(cells[col][row + 1], cell_type))
      count++;
  return count;
}; // end count_adjacent_cells

var check_cell_type = function (cell, cell_type) {
  return cell.name == cell_type.name;
}; // end check_cell_type


var count_adjacent_entities = function (entities, col, row, entity_type) {
  var count = 0;
  if (col > 0)
    if (check_entity_type(entities[col - 1][row], entity_type))
      count++;
  if (col < board.cols - 1)
    if (check_entity_type(entities[col + 1][row], entity_type))
      count++;
  if (row > 0)
    if (check_entity_type(entities[col][row - 1], entity_type))
      count++;
  if (row < board.rows - 1)
    if (check_entity_type(entities[col][row + 1], entity_type))
      count++;

  return count;
}; // end count_adjacent_entities 

var check_entity_type = function (entity, entity_type) {
  return entity.name == entity_type.name;
};

var generate_cells = function () {
  cells = new Array(board.cols);
  for (var col = 0; col < board.cols; col++) {
    cells[col] = new Array(board.rows);
    for (var row = 0; row < board.rows; row++) {
      board.set_cell(col, row, cell_types[get_random_int(0, cell_types.length - 1)]);
    }
  }
}; // end generate_cells

var generate_entities = function () {
  entities = new Array(board.cols);
  for (var col = 0; col < board.cols; col++) {
    entities[col] = new Array(board.rows);
    for (var row = 0; row < board.rows; row++) {
      board.set_entity(col, row, entity_types.noEntity);
      if (get_random_int(0, entity_types.length - 2) === 0)
        board.set_entity(col, row, entity_types[get_random_int(1, entity_types.length - 1)]);
    }
  }
}; // end generate_entities

//endregion

//region update functions

var update = function () {
  score++;
  if (score >= 100) {
    score = 0;
    board.next_phase();
  }
  update_keys();
}; //end update

var update_keys = function () {
  var cursor_direction = new Point(0, 0);

  if (keysDown.hasOwnProperty(39)) {
    cursor_direction.x++;
    if (keysDown.hasOwnProperty(16))
      cursor_direction.x++;
    //message = "RIGHT";
  }
  if (keysDown.hasOwnProperty(37)) {
    //message = "LEFT";
    cursor_direction.x--;
    if (keysDown.hasOwnProperty(16))
      cursor_direction.x--;
  }
  if (keysDown.hasOwnProperty(40)) {
    cursor_direction.y++;
    if (keysDown.hasOwnProperty(16))
      cursor_direction.y++;
    //message = "DOWN";
  }
  if (keysDown.hasOwnProperty(38)) {
    //message = "UP";
    cursor_direction.y--;
    if (keysDown.hasOwnProperty(16))
      cursor_direction.y--;
  }
  cursor.move(cursor_direction);

  if (keysDown.hasOwnProperty(32)) {
    //message = "SPACE";
    if (keysDown.hasOwnProperty(16)) {
      cursor.fill();
    } else {

      var target_x = board.target(cursor.x, cursor.y).x;
      var target_y = board.target(cursor.x, cursor.y).y;

      var draw_x = board.draw_point(target_x, target_y).x;
      var draw_y = board.draw_point(target_x, target_y).y;

      if (draw_x > 0 && draw_y > 0) {
        cursor.trigger(target_x, target_y);
      }
    }
  }
  if (keysDown.hasOwnProperty(8)) {
    //message = "BACKSPACE";
    init();
  }

  if (keysDown.hasOwnProperty(9) && !tabbing) {
    tabbing = true;
    //message = "TAB DOWN"
    if (keysDown.hasOwnProperty(16)) {
      cursor.recycle_type();
    } else {
      cursor.cycle_type();
    }
  }
  if (keysUp.hasOwnProperty(9) && tabbing) {
    tabbing = false;
    //message = "TAB LIFT"
  }

  if (keysDown.hasOwnProperty(13) && !entering) {
    entering = true;
    //message = "ENTER DOWN"
    board.next_phase();
  }
  if (keysUp.hasOwnProperty(13) && entering) {
    entering = false;
    //message = "ENTER LIFT"
  }

  keysDownPrev = keysDown;
  keysUpPrev = keysUp;
}; //end update_keys

//endregion

//region render functions

var Population = function (cells, entities) {
  this.total_cells = board.cols * board.rows;
  this.cell_counts = new Array();
  for (var cell_type = 0; cell_type < cell_types.length; cell_type++)
    this.cell_counts.push(count_cells_by_type(cells, cell_types[cell_type]));
  this.cell_ratios = new Array();
  for (var cell_type = 0; cell_type < cell_types.length; cell_type++)
    this.cell_ratios.push(this.cell_counts[cell_type] / this.total_cells);

  this.total_entities = this.total_cells - count_entities_by_type(entities, entity_types.noEntity);
  this.entity_counts = new Array();
  for (var entity_type = 0; entity_type < entity_types.length; entity_type++)
    this.entity_counts.push(count_entities_by_type(entities, entity_types[entity_type]));
  this.entity_ratios = new Array();
  for (var entity_type = 0; entity_type < entity_types.length; entity_type++)
    this.entity_ratios.push(this.entity_counts[entity_type] / this.total_entities);
};

var render_score = function (score) {
  document.getElementById('score').innerHTML = score;
}; //end render_score

var Graph = function (position, size, padding) {
  this.x = position.x;
  this.y = position.y;
  this.w = size.x;
  this.h = size.y;
  this.col_width = this.w / 2;
  this.row_height = this.h / 2;
  this.padding = padding;

  this.radius = this.row_height / 2;
  if (this.radius > this.col_width / 2)
    this.radius = this.col_width / 2;

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

var count_cells_by_type = function (cells, cell_type) {
  var count = 0;

  for (var col = 0; col < board.cols; col++)
    for (var row = 0; row < board.rows; row++)
      if (check_cell_type(cells[col][row], cell_type))
        count++;

  return count;
};

var count_entities_by_type = function (entities, entity_type) {
  var count = 0;

  for (var col = 0; col < board.cols; col++)
    for (var row = 0; row < board.rows; row++)
      if (check_entity_type(entities[col][row], entity_type))
        count++;

  return count;
};

var render_console = function (message) {
  //clear console
  message = "";

  message += "CONTROLS";
  message += "<br>- Arrows: move cursor";
  message += "<br>- Tab:    select brush";
  message += "<br>- +Shift: select previous";
  message += "<br>- Space:  place selected";
  message += "<br>- +Shift:  fill board";
  message += "<br>- Enter:  next phase";
  message += "<br>- Backspace: new board";
  message += "<br><br>";

  message += "CELLS";
  for (var type = 0; type < cell_types.length; type++) {
    message += "<br>- " + cell_types[type].name;
    if (cursor.entity === false && cursor.type == type)
      message += " <-- SELECTED";
  }
  message += "<br><br>";

  message += "ENTITIES";
  for (var type = 0; type < entity_types.length; type++) {
    message += "<br>- " + entity_types[type].name;
    if (cursor.entity && cursor.type == type)
      message += " <-- SELECTED";
  }

  message += "<br><br>---<br><br>";

  message += "WORLD INFO";
  message += "<br>- Phase: " + phase + "  (" + Math.floor(score / 10) + ")";

  message += "<br><br>---<br><br>";

  //TEMPORARY
  //message = "";

  message += "INSPECTOR";

  var selected_col = board.target(cursor.x, cursor.y).x;
  var selected_row = board.target(cursor.x, cursor.y).y;

  if (selected_col > -1 && selected_row > -1) {
    var cell = cells[selected_col][selected_row];
    message += "<br><br>- CELL INFO: " + cell.about();

    var entity = entities[selected_col][selected_row];
    if (check_entity_type(entity, entity_types.noEntity))
      message += "<br><br>- no entity";
    else
      message += "<br><br>- ENTITY INFO: " + base_entity.about(entity);

  } else {
    message += "<br>- move cursor over"
    message += "<br>&nbsp&nbspboard for details"
  }


  document.getElementById('console').innerHTML = message;
}; // end render_console

var render = function () {
  //clear canvas
  c.clearRect(0, 0, canvas.width, canvas.height);

  board.draw(c);
  graph.render(c);
  cursor.draw(c);

  render_console(message);
}; // end render

var get_bobbing_offset = function (col, row) {
  return board.depth / 2.5 * get_bobbing_degree(col, row);
}
var get_bobbing_degree = function (col, row) {
  return Math.sin((score + col * board.cols + row * board.rows) / 100 * Math.PI * 2);
  //return Math.sin((score) / 100 * Math.PI * 2);
}


//endregion

//region game loop functions

var doLoop = function () {
  update();
  render();
  requestAnimFrame(doLoop);
};

window.onload = function () {
  init();
  doLoop();
};

window.addEventListener("resize", function (e) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}, false);

window.addEventListener("keydown", function (e) {
  e.preventDefault();
  keysDown[e.keyCode] = true;
  delete keysUp[e.keyCode];
}, false);

window.addEventListener("keyup", function (e) {
  e.preventDefault();
  keysUp[e.keyCode] = true;
  delete keysDown[e.keyCode];
}, false);

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();
//endregion