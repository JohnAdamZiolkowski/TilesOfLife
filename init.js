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

  set_colors();
  set_cell_types();
  set_entity_types();
  set_entity_types2();
  set_action_types();
  set_defaults();
  set_states();
  
  base_entity = new Entity();

  //board = new Board(board_position, board_size, board_grid,
  //  board_depth, line_width);
  board = new Board(board_position, board_size,  new Point(get_random_int(1, 16), get_random_int(1, 16)),
    board_depth, line_width);

  generate_cells();
  generate_entities();

  cursor = new Cursor(cursor_position, cursor_size, cursor_speed);
  populations = new Array();
  populations.push(new Population(cells, entities));
  graph = new Graph(graph_position, graph_size, graph_padding);
  console = new Console();
  menu = new Menu(menu_position, menu_size, menu_padding, menu_text_size);
  
  date_started = new Date().getTime();
  date_last_frame = date_started;
  date_last_phase = date_started;
  
  state = states.main;
}; // end init

var set_defaults = function () {
  time_per_phase = 1000;

  board_position = new Point(240, 100);
  board_size = new Point(400, 400);
  board_grid = new Point(8, 8);
  board_depth = 0.33;
  line_width = 2;

  cursor_position = new Point(340, 50);
  cursor_size = new Point(50, 50);
  cursor_speed = 1000;

  populations_length = 32;
  graph_position = new Point(450, 650);
  graph_size = new Point(400, 200);
  //TODO: implement graph_padding
  graph_padding = 25;
  
  menu_position = new Point(400, 100);
  menu_size = new Point(250, 400);
  menu_padding = 20;
  menu_text_size = 20;
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
  colors.corpse = new Color(50, 60, 20);
  colors.corpseling = new Color(65, 80, 30);

  colors.menu_fill_active = new Color(120, 120, 160);
  colors.menu_outline_active = new Color(255, 255, 255);
  colors.menu_text_active = new Color(255, 255, 255);
  colors.menu_fill_idle = new Color(90, 90, 120);
  colors.menu_outline_idle = new Color(30, 30, 40);
  colors.menu_text_idle = new Color(120, 120, 160);
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
  entity_types.push(new Sheepling());
  entity_types.push(new Wolf());
  entity_types.push(new Wolfling());
  entity_types.push(new Corpse());
  entity_types.push(new Corpseling());

  var i = 0;
  entity_types.noEntity = entity_types[i++];
  entity_types.sheep = entity_types[i++];
  entity_types.sheepling = entity_types[i++];
  entity_types.wolf = entity_types[i++];
  entity_types.wolfling = entity_types[i++];
  entity_types.corpse = entity_types[i++];
  entity_types.corpseling = entity_types[i++];
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
  action_types.rot = "rot";
};

var set_entity_types2 = function () {
  entity_types2 = new Array();
  entity_types2.noEntity = NoEntity;
  entity_types2.sheep = Sheep;
  entity_types2.sheepling = Sheepling;
  entity_types2.wolf = Wolf;
  entity_types2.wolfling = Wolfling;
  entity_types2.corpse = Corpse;
  entity_types2.corpseling = Corpseling;
};

var set_states = function () {
  states = new Array();
  states.main = "game";
  states.menu = "menu";
};

var set_state = function (new_state) {
  state = new_state;
  consile.override = "";
};

var update = function () {
  var date_this_frame = (new Date().getTime());
  var time_passed_since_last_frame = date_this_frame - date_last_frame;
  var time_passed_since_last_phase = date_this_frame - date_last_phase;
  
//  console.override = "";
//  console.override += "<br>ms since last frame: "+time_passed_since_last_frame;
//  console.override += "<br>frames per ms: "+(time_passed_since_last_frame / 1000).toFixed(2);
//  
//  console.override += "<br>planned frames per second: "+60;
//  console.override += "<br>frames per second: "+(1 /(time_passed_since_last_frame / 1000)).toFixed(0);
//  
//  console.override += "<br>ms since last phase: "+time_passed_since_last_phase;
//  console.override += "<br>planned ms per phase: "+time_per_phase;
  if (state == states.main){
    if (time_passed_since_last_phase >= time_per_phase) {
      date_last_phase = date_this_frame;
      date_last_frame = date_this_frame;
      board.next_phase();
    }
  }
  else if (state == states.menu) {
    //TODO: ???
  }
  
  controller.update(time_passed_since_last_frame);
  
  date_last_frame = date_this_frame;
}; //end update

var draw = function () {
  //clear canvas
  c.clearRect(0, 0, canvas.width, canvas.height);

  if (state == states.main){
    board.draw(c);
    graph.draw(c);
    cursor.draw(c);
  }
  else if (state == states.menu) {
    menu.draw(c);
  }
  
    console.draw();
}; // end draw

var doLoop = function () {
  update();
  draw();
  requestAnimFrame(doLoop);
}; // end doLoop