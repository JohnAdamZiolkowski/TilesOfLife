/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var Messenger = function () {
  this.message = "";
  this.element = document.getElementById('messenger');
  this.override = "";
  this.time_passed_since_last_frame;
  this.time_passed_since_last_phase;

  this.framerates = [];



  this.update = function (date_this_frame) {
    redraw_messenger = true;
    
    this.time_passed_since_last_frame = date_this_frame - date_last_frame;
    this.time_passed_since_last_phase = date_this_frame - date_last_phase;
    this.framerates.push(this.time_passed_since_last_frame);
    while (this.framerates.length > 60)
      this.framerates.shift();

    var framerate_over_second = 0;
    var frame;
    for (frame = 0; frame < 60; frame++) {
      framerate_over_second += this.framerates[frame];
    }
    this.average_framerate = framerate_over_second / 60;
  };

  this.draw = function () {
    //clear messenger
    this.message = "";

    if (show_instructions) this.draw_instructions();
    if (show_performance_data) this.draw_performance_data();

    this.element.innerHTML = this.message;

    if (this.override)
      this.element.innerHTML = this.override;
  };

  this.draw_instructions = function () {

    this.message += "CONTROLS";
    this.message += "<br>- Enter:  open menu";
    this.message += "<br>- Arrows: move cursor";
    this.message += "<br>- Tab:    select brush";
    this.message += "<br>- +Shift: select previous";
    this.message += "<br>- Space:  place selected";
    this.message += "<br>- +Shift:  fill board";
    this.message += "<br>- Backspace: new board";

    this.message += "<br><br>---<br><br>";

    this.message += "WORLD INFO";
    this.message += "<br>- Phase: " + phase;
    var next = (time_per_phase / 1000 - this.time_passed_since_last_phase / 1000).toFixed(1);
    if (next < 0.1) next = 0.1;
    this.message += "<br>- Next in: " + next;
    this.message += "<br><br>---<br><br>";

    this.message += "INSPECTOR";

    var selected_col = board.target(cursor.x, cursor.y).x;
    var selected_row = board.target(cursor.x, cursor.y).y;

    if (selected_col > -1 && selected_row > -1) {
      var cell = cells[selected_col][selected_row];
      this.message += "<br><br>- CELL INFO: " + cell.about();

      var entity = entities[selected_col][selected_row];
      if (check_entity_type(entity, entity_types.noEntity))
        this.message += "<br><br>- no entity";
      else
        this.message += "<br><br>- ENTITY INFO: " + base_entity.about(entity);

    } else {
      this.message += "<br>- move cursor over"
      this.message += "<br>&nbsp&nbspboard for details"
    }
    this.message += "<br><br>";
  };

  this.draw_performance_data = function () {

    this.message += "";
    this.message += "<br>ms since last frame: " + this.time_passed_since_last_frame;
    this.message += "<br>frames per ms: " + (this.time_passed_since_last_frame / 1000).toFixed(2);

    this.message += "<br>planned frames per second: " + 60;
    this.message += "<br>frames per second: " + (1 / (this.time_passed_since_last_frame / 1000)).toFixed(0);
    this.message += "<br>av frames per second: " + (1 / (this.average_framerate / 1000)).toFixed(0);

    this.message += "<br>ms since last phase: " + this.time_passed_since_last_phase;
    this.message += "<br>planned ms per phase: " + time_per_phase;

  };

};