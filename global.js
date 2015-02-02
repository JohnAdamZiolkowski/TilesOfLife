/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

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

var date_started;
var date_last_frame;
var date_last_phase;

var fullscreenElement;
var fullscreenEnabled;

var board_position;
var board_size;
var board_grid;
var board_depth;
var line_width;
var cursor_position;
var cursor_size;
var cursor_speed;
var populations_length;
var graph_position;
var graph_size;
var graph_padding;
var time_per_phase;
var menu_position;
var menu_size;
var menu_padding;
var menu_text_size;

var colors;

var bg_canvas;
var bg_context;

var static_canvas;
var active_canvas;
var graph_canvas;
var menu_canvas;
var cursor_canvas;

var entity_painter;
var shadow_painter;
var cell_painter;
var line_painter;

var cursor;
var board;
var phase;
var graph;
var messenger;
var subtitle;
var controller;
var menu;
var background;

var state;
var states;
var new_state;

var show_graphs;
var show_fullscreen;
var show_performance_data;
var show_instructions;
var show_about;
var show_cells;
var show_entities;
var do_auto_phase;