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

  this.items = new Array();
  this.items.push("Toggle Graphs");
  this.items.push("toggle fullscreen");
  this.items.push("toggle Performance data");
  this.items.push("toggle instructions");
  this.items.push("toggle auto-phase");
  this.items.push("toggle about information");

  this.row_height = (this.h - (this.items.length-1) * this.padding) / this.items.length;


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
      text_y = bar_y + (this.padding)/2 + this.text_size/2;

      //menu item bar fill
      c.fillRect(bar_x, bar_y, bar_w, bar_h);
      c.strokeRect(bar_x, bar_y, bar_w, bar_h);

      //menu item bar text
      c.fillStyle = text_color;
      c.font = this.text_size+"px Arial";
      c.textAlign = "center";
      c.fillText(this.items[row], text_x, text_y);
    }


  };
};