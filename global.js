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

var colors;

var canvas;
var c;

var cursor;
var board;
var phase;
var graph;
var console;
var controller;
