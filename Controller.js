/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var Controller = function () {

  this.right = 39;
  this.left = 37;
  this.down = 40;
  this.up = 38;

  this.enter = 13;
  this.shift = 16;
  this.space = 32;
  this.tab = 9;
  this.backspace = 8;
  
  this.keysDownPrev = {};
  this.keysUpPrev = {};
  this.keysDown = {};
  this.keysUp = {};

  this.main = function (time_passed_since_last_frame) {
    
    var cursor_direction = new Point(0, 0);

    //right
    if (this.keysDown.hasOwnProperty(this.right)) {
      cursor_direction.x++;
      if (this.keysDown.hasOwnProperty(this.shift))
        cursor_direction.x++;
    }
    //left
    if (this.keysDown.hasOwnProperty(this.left)) {
      cursor_direction.x--;
      if (this.keysDown.hasOwnProperty(this.shift))
        cursor_direction.x--;
    }
    //down
    if (this.keysDown.hasOwnProperty(this.down)) {
      cursor_direction.y++;
      if (this.keysDown.hasOwnProperty(this.shift))
        cursor_direction.y++;
    }
    //up
    if (this.keysDown.hasOwnProperty(this.up)) {
      cursor_direction.y--;
      if (this.keysDown.hasOwnProperty(this.shift))
        cursor_direction.y--;
    }
    cursor.move(cursor_direction, time_passed_since_last_frame);

    //space
    if (this.keysDown.hasOwnProperty(this.space)) {
      if (this.keysDown.hasOwnProperty(this.shift)) {
        cursor.fill();
      } else {

        var target_x = board.target(cursor.x, cursor.y).x;
        var target_y = board.target(cursor.x, cursor.y).y;

        var draw_x = board.draw_point(target_x, target_y).x;
        var draw_y = board.draw_point(target_x, target_y).y;

        if (draw_x > 0 && draw_y > 0) {
          cursor.trigger(target_x, target_y);
        }
      }
    }
    //tab
    if (this.keysDown.hasOwnProperty(this.tab) &&
        ! this.keysDownPrev.hasOwnProperty(this.tab)) {
      if (controller.keysDown.hasOwnProperty(this.shift)) {
        cursor.recycle_type();
      } else {
        cursor.cycle_type();
      }
    }

    //enter
    if (this.keysDown.hasOwnProperty(this.enter) &&
        ! this.keysDownPrev.hasOwnProperty(this.enter)) {
      new_state = states.menu;
      //board.next_phase();
      //date_last_phase = new Date().getTime();
    }
    
    //backspace
    if (this.keysDown.hasOwnProperty(this.backspace)) {
      init();
    }
  };
  
  this.menu = function (time_passed_since_last_frame) {
    
    //up
    if (this.keysDown.hasOwnProperty(this.up) &&
        !this.keysDownPrev.hasOwnProperty(this.up)) {
      redraw_menu = true;
      menu.selected--;
      if (menu.selected < 0)
        menu.selected = menu.items.length -1;
    }
    
    //down
    if (this.keysDown.hasOwnProperty(this.down) &&
        !this.keysDownPrev.hasOwnProperty(this.down)) {
      redraw_menu = true;
      menu.selected++
      if (menu.selected >= menu.items.length)
        menu.selected = 0;
    }
    
    //enter
    if (this.keysDown.hasOwnProperty(this.enter) &&
        ! this.keysDownPrev.hasOwnProperty(this.enter)) {
      redraw_menu = true;
      
      menu.select();
      
      //board.next_phase();
      //date_last_phase = new Date().getTime();
    }
    
    //backspace();
    if (this.keysDown.hasOwnProperty(this.backspace) &&
    ! this.keysDownPrev.hasOwnProperty(this.backspace)) {
      redraw_menu = true;
      new_state = states.main;
    }
    
  };
  
  this.update = function (time_passed_since_last_frame) {
    
    if (state == states.menu)
      this.menu(time_passed_since_last_frame);
    else if (state == states.main)
      this.main(time_passed_since_last_frame);
    
    this.keysDownPrev = JSON.parse(JSON.stringify(this.keysDown));
    this.keysUpPrev = JSON.parse(JSON.stringify(this.keysUp));
    
  }; //end update
  
  this.click = function () {
    if (state == states.menu) {
      
      redraw_menu = true;
      menu.click();
    }else if (state == states.main)
      ;//TODO: add click handler to main
  };
};