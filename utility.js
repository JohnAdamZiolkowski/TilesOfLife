/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

//takes two colors
//returns blended color
var mix_colors = function (color1, color2) {
  var red = Math.floor((color1.red + color2.red) / 2);
  var green = Math.floor((color1.green + color2.green) / 2);
  var blue = Math.floor((color1.blue + color2.blue) / 2);
  var mixed_color = new Color(red, green, blue);
  return mixed_color;
}; // end mix_colors

//takes min and max numbers
//returns random int between them
var get_random_int = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}; // end get_random_int

//takes an array
//returns a random item from the array
//if the array has no items, return false
var get_random_item = function (array) {
  if (array.length > 0)
    return array[get_random_int(0, array.length - 1)];
  else
    return false;
}; // end get_random_item

//takes a cell and a cell type
//returns whether the types match
var check_cell_type = function (cell, cell_type) {
  return cell.name == cell_type.name;
}; // end check_cell_type

//takes a location and an entity type
//returns a list of adjacent locations that match the type
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
}; // end get_adjacent_entities_locations


var transform_entity = function (entity, entity_type, col, row) {
  var new_entity = entity_type.make();

  if (entity.health) new_entity.health = entity.health;
  if (entity.food) new_entity.food = entity.food;
  if (entity.water) new_entity.water = entity.water;
  if (entity.age) new_entity.age = entity.age;
  if (entity.last_action) new_entity.last_action = entity.last_action;

  entities[col][row] = new_entity;

  return new_entity;
};

var move_entity = function (entity, col, row) {
  entities[col][row] = entity;
};



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



var get_bobbing_offset = function (col, row) {
  return board.depth / 2.5 * get_bobbing_degree(col, row);
}
var get_bobbing_degree = function (col, row) {
  return Math.sin((ticks + col * board.cols + row * board.rows) / 100 * Math.PI * 2);
  //return Math.sin((ticks) / 100 * Math.PI * 2);
}