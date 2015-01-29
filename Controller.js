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

  this.tabbing = false;
  this.spacing = false;
  this.entering = false;
  this.backspacing = false;

  this.keysDownPrev = {};
  this.keysUpPrev = {};
  this.keysDown = {};
  this.keysUp = {};

  this.update = function () {
    var cursor_direction = new Point(0, 0);

    //right
    if (this.keysDown.hasOwnProperty(39)) {
      cursor_direction.x++;
      if (this.keysDown.hasOwnProperty(16))
        cursor_direction.x++;
    }
    //reft
    if (this.keysDown.hasOwnProperty(37)) {
      cursor_direction.x--;
      if (this.keysDown.hasOwnProperty(16))
        cursor_direction.x--;
    }
    //down
    if (this.keysDown.hasOwnProperty(40)) {
      cursor_direction.y++;
      if (this.keysDown.hasOwnProperty(16))
        cursor_direction.y++;
    }
    //up
    if (this.keysDown.hasOwnProperty(38)) {
      cursor_direction.y--;
      if (this.keysDown.hasOwnProperty(16))
        cursor_direction.y--;
    }
    cursor.move(cursor_direction);

    //space
    if (this.keysDown.hasOwnProperty(32)) {
      if (this.keysDown.hasOwnProperty(16)) {
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
    //backspace
    if (this.keysDown.hasOwnProperty(8)) {
      init();
    }
    //tab
    if (this.keysDown.hasOwnProperty(9) && !this.tabbing) {
      this.tabbing = true;
      if (controller.keysDown.hasOwnProperty(16)) {
        cursor.recycle_type();
      } else {
        cursor.cycle_type();
      }
    }
    if (this.keysUp.hasOwnProperty(9) && this.tabbing) {
      this.tabbing = false;
    }

    //enter
    if (this.keysDown.hasOwnProperty(13) && !this.entering) {
      this.entering = true;
      //message = "ENTER DOWN"
      board.next_phase();
    }
    if (this.keysUp.hasOwnProperty(13) && this.entering) {
      this.entering = false;
      //message = "ENTER LIFT"
    }

    this.keysDownPrev = this.keysDown;
    this.keysUpPrev = this.keysUp;
  }; //end update_keys
};