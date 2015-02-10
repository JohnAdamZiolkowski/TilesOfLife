/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var init = function () {
  bg_canvas = document.getElementById('bg_canvas');
  bg_canvas.width = window.innerWidth;
  bg_canvas.height = window.innerHeight;
  bg_context = bg_canvas.getContext('2d');

  static_canvas = document.getElementById('static_canvas');
  active_canvas = document.getElementById('active_canvas');
  graph_canvas = document.getElementById('graph_canvas');
  menu_canvas = document.getElementById('menu_canvas');
  cursor_canvas = document.getElementById('cursor_canvas');
toolbox_canvas = document.getElementById('toolbox_canvas');

  document.body.style.cursor = 'none';

  phase = 0;

  set_colors();
  set_cell_types();
  set_entity_types();
  set_entity_types2();
  set_action_types();
  set_defaults();
  set_states();

  base_entity = new Entity();

  board = new Board(board_position, board_size, board_grid,
    board_depth, line_width);
  //board = new Board(board_position, board_size, new Point(get_random_int(1, 32), get_random_int(1, 16)),
  //board_depth, line_width);

  generate_cells();
  generate_entities();

  cursor = new Cursor(cursor_position, cursor_size, cursor_speed);
  populations = [];
  populations.push(new Population(cells, entities));
  graph = new Graph(graph_position, graph_size, graph_padding);
  messenger = new Messenger();
  menu = new Menu(menu_position, menu_size, menu_padding, menu_text_size);
  background = new Background();
  subtitle = new Subtitle();
  toolbox = new Toolbox();

  entity_painter = new EntityPainter();
  shadow_painter = new ShadowPainter();
  cell_painter = new CellPainter();
  line_painter = new CellLinePainter();

  date_started = Date.now();
  date_last_frame = date_started;
  date_last_phase = date_started;

  redraw_background = true;
  redraw_static = true;
  redraw_active = true;
  redraw_graph = true;
  redraw_menu = true;
  redraw_cursor = true;
  redraw_messenger = true;
  redraw_toolbox = true;

  state = states.main;
}; // end init

var set_defaults = function () {
  time_per_phase = 5000;

  board_position = new Point(240, 100);
  board_size = new Point(400, 400);
  board_grid = new Point(8, 12);
  board_depth = 0.33;
  line_width = 2;

  cursor_position = new Point(window.innerWidth/2, 600);
  cursor_size = new Point(50, 50);
  cursor_speed = 1000;

  populations_length = 32;
  graph_position = new Point(300, 550);
  graph_size = new Point(400, 200);
  //TODO: implement graph_padding
  graph_padding = 25;

  menu_position = new Point(400, 100);
  menu_size = new Point(300, 400);
  menu_padding = 20;
  menu_text_size = 5;

  show_fullscreen = false;
  show_graphs = true;
  show_performance_data = false;
  show_instructions = true;
  do_auto_phase = true;
  show_entities = true;
  show_cells = true;
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
  cell_types = [];
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
  entity_types = [];
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

//TODO: deal with this...
var get_entity_type_index = function (entity) {
  for (var i = 0; i < entity_types.length; i++)
    if (entity_types[i].name == entity.name)
      return i;
};
//TODO: deal with this...
var get_cell_type_index = function (cell) {
  for (var i = 0; i < cell_types.length; i++)
    if (cell_types[i].name == cell.name)
      return i;
};

var set_action_types = function () {
  action_types = [];
  action_types.nothing = "nothing";
  action_types.move = "move";
  action_types.graze = "graze";
  action_types.drink = "drink";
  action_types.suckle = "suckle";
  action_types.breed = "breed";
  action_types.evolve = "evolve";
  action_types.die = "die";
  action_types.rot = "rot";
  action_types.attack = "attack";
};

var set_entity_types2 = function () {
  entity_types2 = [];
  entity_types2.noEntity = NoEntity;
  entity_types2.sheep = Sheep;
  entity_types2.sheepling = Sheepling;
  entity_types2.wolf = Wolf;
  entity_types2.wolfling = Wolfling;
  entity_types2.corpse = Corpse;
  entity_types2.corpseling = Corpseling;
  entity_types2.push(entity_types2.noEntity);
  entity_types2.push(entity_types2.sheep);
  entity_types2.push(entity_types2.sheepling);
  entity_types2.push(entity_types2.wolf);
  entity_types2.push(entity_types2.wolfling);
  entity_types2.push(entity_types2.corpse);
  entity_types2.push(entity_types2.corpseling);
};

var set_states = function () {
  states = [];
  states.main = "main";
  states.menu = "menu";
  states.title = "title"; //TODO: add title state
  states.about = "about"; //TODO: add about state
};

var redraw_background;
var redraw_static;
var redraw_active;
var redraw_graph;
var redraw_menu;
var redraw_cursor;
var redraw_messenger;
var redraw_toolbox;

var change_state = function() {
  if (new_state == state)
    return;

  switch (new_state) {
  case states.main:
    state = new_state;

    document.body.style.cursor = 'none';
      redraw_static = true;
      redraw_active = true;
      redraw_graph = true;
      redraw_cursor = true;
      redraw_toolbox = true;

      menu.clear()
      redraw_menu = false;

      date_last_phase = Date.now();
      break;
  case states.menu:
    state = new_state;
    document.body.style.cursor = 'default';
    redraw_menu = true;

    cursor.clear();
    redraw_cursor = false;

    board.clear();
    redraw_static = false;
    redraw_active = false;

    cursor.clear()
    redraw_graph = false;

      toolbox.clear();
      redraw_toolbox = false;
      
      graph.clear();
      redraw_graph = false;
      break;
  case states.about:
    state = new_state;
      break;
  case states.title:
    state = new_state;
      break;
  }
}



var date_this_frame;
var time_since_start;
var seconds_since_start;

var update = function () {
  date_this_frame = Date.now();
  time_since_start = date_this_frame - date_started;
  seconds_since_start = time_since_start / 1000;
  var time_passed_since_last_frame = date_this_frame - date_last_frame;
  var time_passed_since_last_phase = date_this_frame - date_last_phase;



  change_state(new_state);

  messenger.update(date_this_frame);
  if (state == states.main) {
    date_last_frame = date_this_frame;

    if (do_auto_phase) {
      if (time_passed_since_last_phase >= time_per_phase) {
        redraw_static = true;
        redraw_graph = true;
        date_last_phase = date_this_frame;
        board.next_phase();
      }
    }
  } else if (state == states.menu) {
    //TODO: ???
  }

  controller.update(time_passed_since_last_frame);

  date_last_frame = date_this_frame;
}; //end update

var draw = function () {
  //clear canvas
  //bg_context.clearRect(0, 0, bg_canvas.width, bg_canvas.height);
  if (redraw_background) {
    background.draw();
    redraw_background = false;
  }

  if (redraw_static) {
    board.static_context.clearRect(0, 0, static_canvas.width, static_canvas.height);
    board.draw_cells();
    board.draw_cell_lines();
    board.draw_static_entities();
    redraw_static = false;
  }
  if (redraw_active) {
    board.active_context.clearRect(0, 0, active_canvas.width, active_canvas.height);
    board.draw_extras();
    board.draw_active_entities();
    redraw_active = true;
  }
  if (redraw_cursor) {
    cursor.context.clearRect(0, 0, cursor.canvas.width, cursor.canvas.height);
    cursor.draw2();
    redraw_cursor = false;
  }
  if (redraw_graph && show_graphs) {
    redraw_graph = false;
    graph.context.clearRect(0, 0, graph.canvas.width, graph.canvas.height);
    graph.draw();
  }
  if (redraw_menu) {
    menu.context.clearRect(0, 0, menu.canvas.width, menu.canvas.height);
    if (state == states.menu)
      menu.draw();
    redraw_menu = false;
  }
  if (redraw_toolbox) {
    toolbox.context.clearRect(0, 0, toolbox.canvas.width, toolbox.canvas.height);
      toolbox.draw();
    redraw_toolbox = false;
  }
  if (redraw_messenger) {
    if (window.innerWidth < 950)
      messenger.override = "< expand window for info";
    else
      messenger.override = "";

    messenger.draw()
    redraw_messenger = true;
  }
}; // end draw

var doLoop = function () {
  update();
  draw();
  requestAnimFrame(doLoop);
}; // end doLoop
