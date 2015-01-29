/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var Console = function () {
  this.message = "";
  this.element = document.getElementById('console');
  this.override = "";

  this.render = function () {
    //clear console
    this.message = "";

    this.message += "CONTROLS";
    this.message += "<br>- Arrows: move cursor";
    this.message += "<br>- Tab:    select brush";
    this.message += "<br>- +Shift: select previous";
    this.message += "<br>- Space:  place selected";
    this.message += "<br>- +Shift:  fill board";
    this.message += "<br>- Enter:  next phase";
    this.message += "<br>- Backspace: new board";
    this.message += "<br><br>";

    this.message += "CELLS";
    for (var type = 0; type < cell_types.length; type++) {
      this.message += "<br>- " + cell_types[type].name;
      if (cursor.entity === false && cursor.type == type)
        this.message += " <-- SELECTED";
    }
    this.message += "<br><br>";

    this.message += "ENTITIES";
    for (var type = 0; type < entity_types.length; type++) {
      this.message += "<br>- " + entity_types[type].name;
      if (cursor.entity && cursor.type == type)
        this.message += " <-- SELECTED";
    }

    this.message += "<br><br>---<br><br>";

    this.message += "WORLD INFO";
    this.message += "<br>- Phase: " + phase;

    this.message += "<br><br>---<br><br>";

    //TEMPORARY
    //message = "";

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

    this.element.innerHTML = this.message;
    
    if (this.override)
      this.element.innerHTML = this.override;
  }
};