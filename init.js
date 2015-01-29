/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var init = function () {
  canvas = document.getElementById('world');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  c = canvas.getContext('2d');

  phase = 0;
  ticks = 0;

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
  console = new Console();
}; // end init

var set_defaults = function () {
  ticks_per_phase = 100;

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

var set_action_types = function () {
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

var set_entity_types2 = function () {
  entity_types2 = new Array();
  entity_types2.noEntity = NoEntity;
  entity_types2.sheep = Sheep;
  entity_types2.wolf = Wolf;
  entity_types2.sheepling = Sheepling;
  entity_types2.wolfling = Wolfling;
};

var update = function () {
  ticks++;
  if (ticks >= ticks_per_phase) {
    ticks = 0;
    board.next_phase();
  }
  controller.update();
}; //end update

var render = function () {
  //clear canvas
  c.clearRect(0, 0, canvas.width, canvas.height);

  board.draw(c);
  graph.render(c);
  cursor.draw(c);

  console.render();
}; // end render

var doLoop = function () {
  update();
  render();
  requestAnimFrame(doLoop);
}; // end doLoop