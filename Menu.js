/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var Menu = function (position, size, padding, text_size) {
  this.x = position.x;
  this.y = position.y;
  this.w = size.x;
  this.h = size.y;
  this.padding = padding;
  this.text_size = text_size;
  
  this.canvas = menu_canvas;
  //this.canvas.style.border =  "1px solid blue";
  
  this.canvas.width  = this.w + line_width * 2;
  this.canvas.height = this.h + line_width * 2;
  this.canvas.style.left = this.x + "px";
  this.canvas.style.top = this.y + "px";
  
  this.context = this.canvas.getContext('2d');


  this.selected = 0;

  this.items = [];
  this.items.push("Show Fullscreen");
  this.items.push("Show Graphs");
  this.items.push("show Performance Data");
  this.items.push("Show Instructions");
  this.items.push("Do Auto-Phase");
  this.items.push("About Information");
  this.items.push("Dismiss Menu");


  var i = 0;
  this.items.show_fullscreen = this.items[i++];
  this.items.show_graphs = this.items[i++];
  this.items.show_performance_data = this.items[i++];
  this.items.show_instructions = this.items[i++];
  this.items.do_auto_phase = this.items[i++];
  this.items.state_about = this.items[i++];
  this.items.state_main = this.items[i++];


  this.row_height = (this.h + this.padding) / this.items.length;
  this.bar_height = this.row_height - this.padding;
  
  this.text_size = this.bar_height - this.bar_height / 4;

  //TODO: appear
  //TODO: end game updates
  //TODO: end cursor/canvas input
  //TODO: accept own controls

  //TODO: dismiss
  //TODO: restart game updates
  //TODO: reassign controls
  //TODO: end own controls

  //TODO: toggle graphs
  //TODO: toggle inspector
  //TODO: toggle fullscreen
  //TODO: toggle performance data
  //TODO: toggle instructions
  //TODO: toggle auto-phase

  //TODO: generate new world
  //TODO: toggle about information
  //TODO: export current board + population

  this.resize = function () {
    
    var x = window.innerWidth / 2 - this.w / 2;
    var y = 120; 
    
    this.canvas.style.left = x + "px";
    this.canvas.style.top = y + "px";
    this.context = this.canvas.getContext('2d');
    redraw_menu = true
  
  };
  
  this.resize();
  
  this.draw = function () {
    var bar_x;
    var bar_y;
    var bar_w;
    var bar_h;
    var text_x;
    var text_y;
    var bar_color;
    var bar_line;
    var text_color;
    var strings;
    var c = this.context;

    strings = this.get_button_text();
    bar_x = line_width;//this.x - this.w / 2;
    bar_w = this.w;
    bar_h = this.row_height - this.padding;
    text_x = this.w / 2;

    for (var row = 0; row < this.items.length; row++) {

      if (this.selected == row) {
        c.fillStyle = colors.menu_fill_active.string;
        c.strokeStyle = colors.menu_outline_active.string;
        text_color = colors.menu_text_active.string;
      } else {
        c.strokeStyle = colors.menu_fill_idle.string;
        c.fillStyle = colors.menu_outline_idle.string;
        text_color = colors.menu_text_idle.string;
      }

      bar_y = row * (this.row_height) + line_width;
      text_y = bar_y + (this.bar_height) -this.text_size / 4;

      //menu item bar fill
      c.fillRect(bar_x, bar_y, bar_w, bar_h);
      c.strokeRect(bar_x, bar_y, bar_w, bar_h);

      //menu item bar text
      c.fillStyle = text_color;
      c.font = this.text_size + "px Arial";
      c.textAlign = "center";
      c.fillText(strings[row], text_x, text_y);
    }


  };

  this.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  
  this.get_button_text = function () {
    var strings = [];
    var item;
    var items_length = this.items.length;
    for (item = 0; item < items_length; item++) {

      switch (this.items[item]) {
      case this.items.show_graphs:
        if (show_graphs)
          strings.push("Hide Graphs");
        else
          strings.push("Show Graphs");
        break;
      case this.items.show_fullscreen:
        if (this.selected === 0)
          strings.push("Click to Toggle Fullscreen");
        else
          strings.push("Toggle Fullscreen");
        break;
      case this.items.show_performance_data:
        if (show_performance_data)
          strings.push("Hide Performance Data");
        else
          strings.push("Show Performance Data");
        break;
      case this.items.show_instructions:
        if (show_instructions)
          strings.push("Hide Instructions");
        else
          strings.push("Show Instructions");
        break;
      case this.items.state_about:
        strings.push("About Tiles of Life");
        break;
      case this.items.do_auto_phase:
        if (do_auto_phase)
          strings.push("Disable Auto-Phase");
        else
          strings.push("Enable Auto-Phase");
        break;
      case this.items.state_main:
        strings.push("Dismiss Menu");

      }
    }

    return strings;
  };


  this.click = function () {

    fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitIsFullScreen ? true : false;

    if (this.selected === 0) {
    if (fullscreenEnabled) {
      exitFullscreen();
    } else {
      requestFullscreen();
    }
    }
  };

  this.select = function () {

    switch (this.items[this.selected]) {
    case this.items.show_graphs:
      show_graphs = !show_graphs;
      graph.context.clearRect(0, 0, graph.canvas.width, graph.canvas.height);
      redraw_graph = true;
      
      break;
    case this.items.show_fullscreen:
      show_fullscreen = !show_fullscreen;
      break;
    case this.items.show_performance_data:
      show_performance_data = !show_performance_data;
      break;
    case this.items.show_instructions:
      show_instructions = !show_instructions;
      break;
    case this.items.state_about:
      new_state = states.about;
      break;
    case this.items.do_auto_phase:
      do_auto_phase = !do_auto_phase;
      break;
    case this.items.state_main:
        new_state = states.main;
      break;
    }

  };

};