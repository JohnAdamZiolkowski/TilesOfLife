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


  this.row_height = (this.h - (this.items.length - 1) * this.padding) / this.items.length;


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

  this.draw = function (c) {
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

    strings = this.get_button_text();
    bar_x = this.x - this.w / 2;
    bar_w = this.w;
    bar_h = this.row_height - this.padding;
    text_x = this.x;

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

      bar_y = this.y - this.row_height / 2 + row * (this.row_height);
      text_y = bar_y + (this.padding) / 2 + this.text_size / 2;

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
        if (fullscreenEnabled)
          strings.push("Click to Exit Fullscreen");
        else
          strings.push("Click to Enter Fullscreen");
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

    if (fullscreenEnabled) {
      exitFullscreen();
    } else {
      requestFullscreen();
    }
  };

  this.select = function () {

    switch (this.items[this.selected]) {
    case this.items.show_graphs:
      show_graphs = !show_graphs;
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
      state = states.about;
      break;
    case this.items.do_auto_phase:
      do_auto_phase = !do_auto_phase;
      break;
    case this.items.state_main:
      state = states.main;
      date_last_phase = new Date().getTime();
      break;
    }

  };

};