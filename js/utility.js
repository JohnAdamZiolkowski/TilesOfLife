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

//takes pass and max numbers
//returns if random roll met passing value or higher
//example: (1, 5) has a 20% chance of returning true
//TODO: Test this function out before using it
var get_roll = function (pass, max) {
  return (Math.floor(Math.random() * (max + 1)) >= pass);
}; // end get_roll

//takes an array
//returns a random item from the array
//if the array has no items, return false
var get_random_item = function (array) {
  if (array.length > 0)
    return array[get_random_int(0, array.length - 1)];
  else
    return false;
}; // end get_random_item

//takes a size of a rectangle
//used to find the radius of a circle that will fit
//return half the length of the shortest side
var get_radius = function (w, h) {
  var radius = w / 2;
  if (radius > h / 2)
    radius = h / 2;
  return radius;
}; // end get_random_item


//takes a cell and a cell type
//returns whether the types match
var check_cell_type = function (cell, cell_type) {
  return cell.name == cell_type.name;
}; // end check_cell_type

//takes an entity and an entity type
//returns whether the types match
var check_entity_type = function (entity, entity_type) {
  return entity.name == entity_type.name;
}; // end check_entity_type

//takes a location and an entity type
//returns a list of adjacent locations that match the type
var get_adjacent_entities_locations = function (col, row, entity_type) {
  var locations = [];
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

//takes an entity, an entity type, and a location
//creates a new entity with given type
//new entity has the same properties as the original
//places the new entity in the location
//returns the new entity
var transform_entity = function (entity, entity_type) {
  var new_entity = entity_type.make();

  if (entity.health) new_entity.health = entity.health;
  if (entity.food) new_entity.food = entity.food;
  if (entity.water) new_entity.water = entity.water;
  if (entity.age) new_entity.age = entity.age;
  if (entity.last_action) new_entity.last_action = entity.last_action;

  if (entity.max_health) new_entity.max_health = entity.max_health;
  if (entity.max_food) new_entity.max_food = entity.max_food;
  if (entity.max_water) new_entity.max_water = entity.max_water;

  var col = entity.col;
  var row = entity.row;
  entities[col][row] = new_entity;
  base_entity.set_location(new_entity, col, row);

  return new_entity;
}; // end transform_entity

//takes an entity and a location
//places the entity in the new location
var move_entity = function (entity, new_col, new_row) {
  entities[new_col][new_row] = entity;
  base_entity.set_location(entity, new_col, new_row);
}; // end move_entity

//takes a grid of cells, a location, and a cell type
//counts how many of the adjacent cells have a matching type
//returns the count
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

//takes a grid of entities, a location, and an entity type
//counts how many of the adjacent entities have a matching type
//returns the count
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

//initializes the cells grid
//uses completely random distribution
var generate_cells = function () {
  cells = new Array(board.cols);
  for (var col = 0; col < board.cols; col++) {
    cells[col] = new Array(board.rows);
    for (var row = 0; row < board.rows; row++) {
      board.set_cell(col, row, cell_types[get_random_int(0, cell_types.length - 1)]);
    }
  }
}; // end generate_cells

//initializes the entities grid
//sets all entities to noEntity first
var generate_entities = function () {
  entities = new Array(board.cols);
  for (var col = 0; col < board.cols; col++) {
    entities[col] = new Array(board.rows);
    for (var row = 0; row < board.rows; row++) {
      board.set_entity(col, row, entity_types.noEntity);
      //TODO: remember how the distribution works
      if (get_random_int(0, entity_types.length - 2) === 0) {
        //gets a random entity type, skipping noEnity
        board.set_entity(col, row, entity_types[get_random_int(1, entity_types.length - 1)]);
        base_entity.randomize(entities[col][row]);
      }
    }
  }
}; // end generate_entities

//takes a grid of cells and a cell type
//returns how many cells match the type
var count_cells_by_type = function (cells, cell_type) {
  var count = 0;

  for (var col = 0; col < board.cols; col++)
    for (var row = 0; row < board.rows; row++)
      if (check_cell_type(cells[col][row], cell_type))
        count++;

  return count;
}; // end count_cells_by_type

//takes a grid of entities and an entity type
//returns how many entities match the type
var count_entities_by_type = function (entities, entity_type) {
  var count = 0;

  for (var col = 0; col < board.cols; col++)
    for (var row = 0; row < board.rows; row++)
      if (check_entity_type(entities[col][row], entity_type))
        count++;

  return count;
}; // end count_entities_by_type


//takes a location
//uses the bobbing degree and the board depth to draw entity floating in water
//returns a height offset
var get_bobbing_offset = function (col, row, radius) {
  return radius / 4 * get_bobbing_degree(col, row);
};

//takes a location
//uses the depth of the board and the cell height to draw wavy water
//returns a height offset
var get_bobbing_cell = function (col, row, depth, row_height) {
  return row_height * get_bobbing_degree(col, row);
};

//takes a location
//uses time and position to get an angle to draw entity floating in water
//returns the angle
var get_bobbing_degree = function (amp, freq, col, row) {
  var time = (new Date().getTime() - date_started) / 1000;
  var offset = amp*(Math.sin(freq*time*2*Math.PI+col+row));
  var degree = offset * Math.PI * 2;
  return degree;
  //ignore board location:
  //return Math.sin((ticks) / 100 * Math.PI * 2);
}; // end get_bobbing_degree

var get_propper_sine = function (amp, freq, col, row) {

  var time = (new Date().getTime() - date_started) / 1000;
  var offset = amp*(Math.sin(freq*time*2*Math.PI+col+row));
  return offset;
};


