/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var Board = function (position, size, grid, depth, line_width) {
  this.x = position.x;
  this.y = position.y;
  this.w = size.x;
  this.h = size.y;
  this.cols = grid.x;
  this.rows = grid.y;
  this.line_width = line_width;

  this.col_width = this.w / this.cols;
  this.row_height = this.h / this.rows;

  this.depth = depth * this.row_height;

  this.radius = get_radius(this.col_width, this.row_height) * 0.75;

  this.draw = function (c) {
    //this.draw_cells(c);
    //this.draw_cell_lines(c);
    //this.draw_cell_extras(c);
    //this.draw_entities(c);

    this.draw_cells_faster(c);
    this.draw_cell_lines_faster(c);
    this.draw_cell_extras_faster(c);
    this.draw_entities_faster(c);
  };

  this.draw_cells_faster = function (c) {

    var ct = [];
    var cx = [];
    var cy = [];

    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        var cell = cells[col][row];
        ct.push(get_cell_type_index(cell));
        cx.push(this.x + this.col_width * col);
        cy.push(this.y + this.row_height * row);

      }
    }

    cell_painter.draw(c, ct, cx, cy);
  };

  this.line_radius = this.line_width / 2;
  this.line_width2 = this.line_width * 2;


  //draws every cell on the grid
  this.draw_cells = function (c) {
    var radius = get_radius(this.col_width, this.row_height) * 0.75;
    var offset = 0;

    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        var cell = cells[col][row];
        //draw normal cell area first
        c.fillStyle = cell.color.string;
        c.fillRect(
          this.x + this.col_width * col + this.line_width,
          this.y + this.row_height * row + this.line_width,
          this.col_width - this.line_width,
          this.row_height - this.line_width);

        if (check_cell_type(cell, cell_types.grass)) {
          if (cell.grass <= cell.max_grass / 2) {
            c.fillStyle = cell.under.color.string;
            c.beginPath();
            c.moveTo(this.x + this.col_width * col + this.line_width + this.col_width / 2, this.y + this.row_height * row + this.line_width);
            c.lineTo(this.x + this.col_width * col + this.line_width, this.y + this.row_height * row + this.line_width + this.row_height / 2);
            c.lineTo(this.x + this.col_width * col + this.line_width + this.col_width / 2, this.y + this.row_height * row + this.line_width + this.row_height);
            c.lineTo(this.x + this.col_width * col + this.line_width + this.col_width, this.y + this.row_height * row + this.line_width + this.row_height / 2);
            c.fill();
          }
        }

        //draws the front half of the cell above if transparent
        if (check_cell_type(cell, cell_types.water)) {
          if (row > 0) {
            var cell_above = cells[col][row - 1];
            if (!check_cell_type(cell_above, cell_types.water)) {
              //draw cell above's front side
              var amp = radius / 2;
              var freq = 0.5;
              var sine = get_propper_sine(amp, freq, col, row);

              offset = sine / 2 + amp / 2;


              c.fillStyle = mix_colors(cell.color, cell_above.color.darken()).string;
              //c.fillStyle = colors.cursor.string;
              c.fillRect(
                this.x + this.col_width * col + this.line_width,
                this.y + this.row_height * row + this.line_width,
                this.col_width - this.line_width,
                this.depth - this.line_width);

              c.fillStyle = cell_above.color.darken().string;
              //c.fillStyle = colors.cursor.string;
              c.fillRect(
                this.x + this.col_width * col + this.line_width,
                this.y + this.row_height * row + this.line_width,
                this.col_width - this.line_width,
                offset);

              //draw cell above's front line
              c.fillStyle = mix_colors(cell.color, cell_above.color.darken().darken()).string;

              //c.fillStyle = colors.cursor.string;
              c.fillRect(
                this.x + this.col_width * col + this.line_width,
                this.y + this.row_height * row + offset,
                this.col_width - this.line_width,
                this.line_width);
            }
          }
        }
        //draw half-row at the bottom
        if (row == this.rows - 1) {
          c.fillStyle = cell.color.darken().string;
          c.fillRect(
            this.x + this.col_width * col + this.line_width,
            this.y + this.row_height * (row + 1) + this.line_width,
            this.col_width - this.line_width,
            this.depth - this.line_width);
        }
      }
    }
  }; // end Board.draw_cells

  //draws every cell's outlines on the grid
  //TODO: change fillRect to use line stroke
  this.draw_cell_lines_faster = function (c) {
    var lt = [];
    var lm = [];
    var lx = [];
    var ly = [];
    var lw = [];
    var lh = [];
    var ld = [];
    var cell;
    var cell_left;
    var cell_right;
    var cell_above;
    var cell_below;

    var rows = this.rows;
    var cols = this.cols;
    var row;
    var col;

    var col_x;
    var row_y;
    var col_x2;
    var row_y2;

    var ct;
    var ctm;

    for (row = 0; row < rows; row++) {
      for (col = 0; col < cols; col++) {

        cell = cells[col][row];
        if (col > 0) cell_left = cells[col - 1][row];
        else cell_left = 0;
        if (col < cols - 1) cell_right = true;
        else cell_right = false;
        if (row > 0) cell_above = cells[col][row - 1];
        else cell_above = 0;
        if (row < rows - 1) cell_below = true;
        else cell_below = false;


        col_x = this.x + this.col_width * col;
        row_y = this.y + this.row_height * row;
        col_x2 = col_x + this.col_width;
        row_y2 = row_y + this.row_height;


        //left line
        ct = get_cell_type_index(cell);
        lt.push(ct);
        if (cell_left) {
          lm.push(get_cell_type_index(cell_left));
        } else {
          lm.push(ct);
        }
        lx.push(col_x - this.line_radius);
        ly.push(row_y);
        lw.push(this.line_width);
        lh.push(this.row_height);
        ld.push(false);


        //top line
        ct = get_cell_type_index(cell);
        lt.push(ct);
        if (cell_above) {
          lm.push(get_cell_type_index(cell_above));
        } else {
          lm.push(ct);
        }
        lx.push(col_x + this.line_radius);
        ly.push(row_y - this.line_radius);
        lw.push(this.col_width - this.line_width);
        lh.push(this.line_width);
        ld.push(false);

        //right line
        if (!cell_right) {
          ct = get_cell_type_index(cell);
          lt.push(ct);
          lm.push(ct);
          lx.push(col_x + this.col_width - this.line_radius);
          ly.push(row_y);
          lw.push(this.line_width);
          lh.push(this.row_height);
          ld.push(false);
        }

        //bottom row
        if (!cell_below) {
          //bottom line of grid
          ct = get_cell_type_index(cell);
          lt.push(ct);
          lm.push(ct);
          lx.push(col_x + this.line_radius);
          ly.push(row_y2 - this.line_radius);
          lw.push(this.col_width - this.line_width);
          lh.push(this.line_width);
          ld.push(true);

          //front face of the bottom cells
          ct = get_cell_type_index(cell);
          lt.push(ct);
          lm.push(ct);
          lx.push(col_x + this.line_radius);
          ly.push(row_y2 + this.line_radius);
          lw.push(this.col_width - this.line_width);
          lh.push(this.depth);
          ld.push(false);

          //bottom line of depth
          ct = get_cell_type_index(cell);
          lt.push(ct);
          lm.push(ct);
          lx.push(col_x + this.line_radius);
          ly.push(row_y2 + this.depth);
          lw.push(this.col_width - this.line_width);
          lh.push(this.line_width);
          ld.push(true);

          //left line of depth
          ct = get_cell_type_index(cell);
          lt.push(ct);
          if (cell_left) {
            lm.push(get_cell_type_index(cell_left));
          } else {
            lm.push(ct);
          }
          lx.push(col_x - this.line_radius);
          ly.push(row_y2 - this.line_radius);
          lw.push(this.line_width);
          lh.push(this.depth + this.line_width);
          ld.push(true);

          //right line of depth
          if (!cell_right) {
            ct = get_cell_type_index(cell);
            lt.push(ct);
            lm.push(ct);
            lx.push(col_x2 - this.line_radius);
            ly.push(row_y2 - this.line_radius);
            lw.push(this.line_width);
            lh.push(this.depth + this.line_width);
            ld.push(true);
          }
        }
      }
    }

    line_painter.draw(c, lt, lm, lx, ly, lw, lh, ld);
  }; // end Board.draw_cell_lines

  //TODO: clean up mess
  this.dce_radius = get_radius(this.col_width, this.row_height) * 0.75;
  this.dce_amp = this.dce_radius / 2;
  this.dce_freq = 0.5;
  this.water_color = cell_types.water.color.string;
  this.water_darker = cell_types.water.color.darken().string;

  this.draw_cell_extras_faster = function (c) {

    var cell;
    var cell_above;
    var sine;
    var offset;
    var base_w = this.col_width - this.line_width;

    //skip top row
    for (var row = 1; row < this.rows; row++) {

      var base_y = this.y + this.row_height * row + this.line_radius;

      for (var col = 0; col < this.cols; col++) {

        var base_x = this.x + this.col_width * col + this.line_width / 2;

        offset = 0;

        cell = cells[col][row];
        if (check_cell_type(cell, cell_types.water)) {

          sine = get_propper_sine(this.dce_amp, this.dce_freq, col, row);
          offset = sine / 2 + this.dce_amp / 2;

          cell_above = cells[col][row - 1];
          if (check_cell_type(cell_above, cell_types.water)) {
            // water color overlay that hides the grid line
            c.fillStyle = colors.water.string;
            c.fillRect(
              base_x,
              base_y - this.line_width - this.line_radius,
              base_w,
              offset + this.line_width);

            // waving line where the water meets the cell above (darkened once)
            c.fillStyle = colors.water.darken().string;
            c.fillRect(
              base_x,
              base_y + offset - this.line_width,
              base_w,
              this.line_width);

          } else {
            var cell_above_color = cell_above.color;
            
            //line of the cell above, not mixed (darkened twice)
            c.fillStyle =cell_above_color.darken().darken().string;
            c.fillRect(
              base_x,
              base_y - this.line_width,
              base_w,
              this.line_width);

            //shadow of the cell above, not mixed (darkened once)
            c.fillStyle = cell_above_color.darken().string;
            c.fillRect(
              base_x,
              base_y,
              base_w,
              offset);

            //waving line where the water meets the cell above, mixed (darkened once)
            c.fillStyle = colors.water.darken().string;
            c.fillRect(
              base_x,
              base_y + offset - this.line_width,
              base_w,
              this.line_width);

            //shadow of the cell above, mixed (darkened once)
            c.fillStyle = mix_colors(cell_above_color.darken(), colors.water).string;
            c.fillRect(
              base_x,
              base_y + offset,
              base_w,
              this.radius - offset - this.line_width);
          }
        }
      }
    }
    
    //draw dirt patch on half eaten grass cells
    c.fillStyle = colors.dirt.string;
    for (var row = 1; row < this.rows; row++) {
      var base_y = this.y + this.row_height * row + this.row_height/2;

      for (var col = 0; col < this.cols; col++) {
        var base_x = this.x + this.col_width * col + this.col_width / 2;
        cell = cells[col][row];
        if (! check_cell_type(cell, cell_types.grass)) continue;
        if (cell.grass > cell.max_grass / 2) continue;

        c.beginPath();
        c.moveTo(base_x - this.col_width / 2, base_y);
        c.lineTo(base_x, base_y - this.row_height / 2);
        c.lineTo(base_x + this.col_width / 2, base_y);
        c.lineTo(base_x, base_y + this.row_height / 2);
        c.fill();
        
      }
    }
  };

  this.draw_cell_extras = function (c) {
    //outline cells
    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        var cell = cells[col][row];
        c.fillStyle = cell.color.darken().string;

        var radius = get_radius(this.col_width, this.row_height) * 0.75;

        var offset = 0;

        //top
        if (row > 0) {
          var cell_above = cells[col][row - 1];
          if (cell.name != cell_above.name) {
            c.fillStyle = mix_colors(cell.color, cell_above.color).darken().string;
          }
        }

        if (row > 0)
          if (check_cell_type(cell, cell_types.water))
            if (check_cell_type(cell_above, cell_types.water)) {

              var amp = radius / 2;
              var freq = 0.5;
              var sine = get_propper_sine(amp, freq, col, row);
              offset = sine / 2 + amp / 2;

              c.fillStyle = cell.color.string;
              c.fillRect(
                this.x + this.col_width * col + this.line_width,
                this.y + this.row_height * row,
                this.col_width - this.line_width,
                this.line_width + offset);

              c.fillStyle = cell.color.darken().string;
            }

        c.fillRect(
          this.x + this.col_width * col + this.line_width,
          this.y + this.row_height * row + offset,
          this.col_width - this.line_width,
          this.line_width);
      }

    }

  };




  //draws every cell's outlines on the grid
  //TODO: change fillRect to use line stroke
  this.draw_cell_lines = function (c) {
    //outline cells
    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        var cell = cells[col][row];
        c.fillStyle = cell.color.darken().string;

        var radius = get_radius(this.col_width, this.row_height) * 0.75;

        var offset = 0;

        //top
        if (row > 0) {
          var cell_above = cells[col][row - 1];
          if (cell.name != cell_above.name) {
            c.fillStyle = mix_colors(cell.color, cell_above.color).darken().string;
          } else if (check_cell_type(cell_above, cell_types.water)) {

            //TODO: figure out the purpose of this call:    
            //            c.fillRect(
            //              this.x + this.col_width * col + this.line_width,
            //              this.y + this.row_height * row + offset,
            //              this.col_width - this.line_width,
            //              this.line_width);       
            //}
          }
        }

        if (row > 0)
          if (check_cell_type(cell, cell_types.water))
            if (check_cell_type(cell_above, cell_types.water)) {

              var amp = radius / 2;
              var freq = 0.5;
              var sine = get_propper_sine(amp, freq, col, row);
              offset = sine / 2 + amp / 2;

              c.fillStyle = cell.color.string;
              c.fillRect(
                this.x + this.col_width * col + this.line_width,
                this.y + this.row_height * row,
                this.col_width - this.line_width,
                this.line_width + offset);

              c.fillStyle = cell.color.darken().string;
            }

        c.fillRect(
          this.x + this.col_width * col + this.line_width,
          this.y + this.row_height * row + offset,
          this.col_width - this.line_width,
          this.line_width);

        //bottom
        c.fillStyle = cell.color.darken().darken().string;
        if (row == this.rows - 1) {
          //bottom line on top half of bottom cells
          c.fillRect(
            this.x + this.col_width * col + this.line_width,
            this.y + this.row_height * (row + 1),
            this.col_width - this.line_width,
            this.line_width);
          //bottom line on bottom half of bottom cells
          c.fillRect(
            this.x + this.col_width * col + this.line_width,
            this.y + this.row_height * (row + 1) + this.depth,
            this.col_width - this.line_width,
            this.line_width);

          if (col > 0) {
            var cell_left = cells[col - 1][row];
            c.fillStyle = mix_colors(cell.color, cell_left.color).darken().darken().string;
          }
          //right line on bottom half of bottom cells
          c.fillRect(
            this.x + this.col_width * col,
            this.y + this.row_height * (row + 1),
            this.line_width,
            this.depth + this.line_width);

          if (col == this.cols - 1) {
            //right line on bottom half of bottom right cell
            c.fillStyle = cell.color.darken().darken().string;
            c.fillRect(
              this.x + this.col_width * (col + 1),
              this.y + this.row_height * (row + 1),
              this.line_width,
              this.depth + this.line_width);
          }

        }
        //left
        c.fillStyle = cell.color.darken().string;
        if (col > 0) {
          var cell_left = cells[col - 1][row];
          if (cell.name != cell_left.name) {
            c.fillStyle = mix_colors(cell.color, cell_left.color).darken().string;
          }
        }
        c.fillRect(
          this.x + this.col_width * col,
          this.y + this.row_height * row,
          this.line_width,
          this.row_height);

        //right
        if (col == this.cols - 1) {
          c.fillStyle = cell.color.darken().string;
          c.fillRect(
            this.x + this.col_width * (col + 1),
            this.y + this.row_height * row,
            this.line_width,
            this.row_height);
        }
      }
    }
  }; // end Board.draw_cell_lines


  this.de_radius = get_radius(this.col_width, this.row_height) * 0.75;
  this.de_freq = 0.5;
  this.de_amp = this.de_radius / 2;
  this.de_base_x = this.x + this.col_width / 2 + this.line_width / 2;
  this.de_base_y = this.y + this.row_height / 2 + this.line_width / 2;

  this.draw_entities_faster = function (c) {

      var row;
      var col;
      var rows = board.rows;
      var cols = board.cols;
      var et = [];
      var ex = [];
      var ey = [];
      var st = [];
      var sx = [];
      var sy = [];
      var ling = [];
      var x = board.x;
      var y = board.y;

      var entity;
      var cell;

      var bobbing_offset;
      var scale;

      var shadow_x;
      var shadow_y;
      var entity_x;
      var entity_y;

      for (row = 0; row < rows; row++) {
        for (col = 0; col < cols; col++) {
          entity = entities[col][row];
          if (entity.type_index === 0) {
            continue;
          }

          et.push(entity.type_index);

          cell = cells[col][row];
          if (cell.type_index != 2) {
            st.push(cell.type_index);
          } else {
            if (cell.grass <= 4 / 2) {
              st.push(1);
            } else {
              st.push(2);
            }
          }

          bobbing_offset = 0;
          if (check_cell_type(cell, cell_types.water)) {
            bobbing_offset = get_propper_sine(this.de_amp, this.de_freq, col, row) / 2 + this.de_amp / 2;
          }

          if (entity.ling) {
            scale = 0.66;
            ling.push(true);
          } else {
            scale = 1;
            ling.push(false);
          }
          var bobbing_scaled = bobbing_offset * scale;

          //entity circle
          var base_x = this.col_width * col + this.de_base_x;
          var base_y = this.row_height * row + this.de_base_y;
          entity_x = base_x;
          entity_y = base_y - this.de_radius + (1 - scale) * this.de_radius;
          shadow_x = base_x;
          shadow_y = base_y;

          ex.push(entity_x);
          ey.push(entity_y + bobbing_scaled);
          sx.push(shadow_x);
          sy.push(shadow_y + bobbing_scaled);
        }
      }
      shadow_painter.draw(c, st, sx, sy, ling);
      entity_painter.draw(c, et, ex, ey);
    } // end draw_entities_faster



  //draws every entity and its outlines
  this.draw_entities = function (c) {



    var row;
    var col;
    var entity;
    var cell;

    var rows = this.rows;
    var cols = this.cols;
    var radius = get_radius(this.col_width, this.row_height) * 0.75;
    var freq = 0.5;
    var amp = radius / 2;

    var sine = get_propper_sine(amp, freq, col, row);
    var degree = get_bobbing_degree(amp, freq, col, row);
    var bobbing_offset;
    var scale;

    var shadow_x;
    var shadow_y;

    var scale_x;
    var scale_y;

    var entity_x;
    var entity_y;

    for (row = 0; row < rows; row++) {
      for (col = 0; col < cols; col++) {
        entity = entities[col][row];
        if (!check_entity_type(entity, entity_types.noEntity)) {
          cell = cells[col][row];

          sine = get_propper_sine(amp, freq, col, row);
          degree = get_bobbing_degree(amp, freq, col, row);


          bobbing_offset = 0;
          if (check_cell_type(cell, cell_types.water))
            bobbing_offset = get_propper_sine(amp, freq, col, row) / 2 + amp / 2;

          scale = 1;
          if (entity.ling)
            scale = 0.66;


          shadow_x = this.x + this.col_width * col + this.col_width / 2 + this.line_width / 2;
          shadow_y = this.y + this.row_height * row + this.row_height / 2 + this.line_width / 2 + bobbing_offset * scale;

          //ground shadow first
          c.fillStyle = cell.color.darken().string;

          if (check_cell_type(cell, cell_types.grass))
            if (cell.grass <= cell.max_grass / 2)
              c.fillStyle = cell.under.color.darken().string;
          c.save();
          scale_x = 1.25;
          scale_y = 0.5;
          c.scale(scale_x, scale_y);
          c.beginPath();
          c.arc(
            shadow_x / scale_x,
            shadow_y / scale_y,
            radius * scale,
            0,
            2 * Math.PI);
          c.restore();
          c.fill();

          //entity circle
          entity_x = this.x + this.col_width * col + this.col_width / 2 + this.line_width / 2;
          entity_y = this.y + this.row_height * row + this.row_height / 2 - radius + (1 - scale) * radius + this.line_width / 2;
          c.fillStyle = entity.color.string;
          c.beginPath();
          c.arc(
            entity_x,
            entity_y + bobbing_offset * scale,
            radius * scale,
            0,
            2 * Math.PI);
          c.fill();

          //entity outline
          c.strokeStyle = entity.color.darken().darken().string;
          c.beginPath();
          c.arc(
            entity_x,
            entity_y + bobbing_offset * scale,
            radius * scale,
            0,
            2 * Math.PI);
          c.stroke();

          //cover the bottom portion of the entity with water
          //if (check_cell_type(cell, cell_types.water)) {
          //  var bobbing_degree = get_bobbing_degree(col, row);

          //            c.fillStyle = mix_colors(entity.color, colors.water).darken().string;
          //            c.beginPath();
          //            c.arc(
          //            entity_x,
          //            entity_y + bobbing_offset * scale,
          //              radius * scale, 
          //              (0.2 - degree), 
          //              (0.8 + degree),
          //            c.fill();
          //
          //            messenger.override = "bobbing degree:" + degree;
          //            
          //            c.strokeStyle = mix_colors(entity.color.darken().darken(), colors.water).string;
          //            c.beginPath();
          //            c.arc(
          //              entity_x,
          //              entity_y + bobbing_offset * scale,
          //              radius * scale, 
          //              (0.2 - degree), 
          //              (0.8 + degree);
          //            c.stroke();
          // }
        }
      }
    }

  }; // end Board.draw_entities

  this.next_phase = function () {
    phase++;

    //record current board to combat update order bias
    cellsPrev = JSON.parse(JSON.stringify(cells));
    entitiesPrev = JSON.parse(JSON.stringify(entities));

    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        var cell = cells[col][row];
        var entity = entities[col][row];
        if (cell.next_phase)
          cell.next_phase(col, row);
        if (entity.next_phase)
          entity.next_phase(col, row);
      }
    }

    //record the history of cells and entities
    //deletes the old history to save memory
    populations.push(new Population(cells, entities));
    while (populations.length > populations_length)
      populations.shift();
  };

  //takes position on canvas
  //returns location on grid 
  this.target = function (x, y) {
    var return_col;
    var return_row;

    if (x < this.x ||
      x >= this.x + this.w) {
      return_col = -1;
    } else {
      return_col = (x - this.x) / this.col_width;
      return_col = Math.floor(return_col);
    }
    if (y < this.y ||
      y >= this.y + this.h) {
      return_row = -1;
    } else {
      return_row = (y - this.y) / this.row_height;
      return_row = Math.floor(return_row);
    }

    var return_point = new Point(return_col, return_row);
    return return_point;
  }; // end target

  //takes location on board
  //returns position of th center of the cell
  this.draw_point = function (col, row) {
    var return_x;
    var return_y;

    if (col < 0 || col > this.cols - 1) {
      return_x = -1;
    } else {
      return_x = col * this.col_width + this.x;
      return_x += this.col_width / 2;
    }

    if (row < 0 || row > this.rows - 1) {
      return_y = -1;
    } else {
      return_y = row * this.row_height + this.y;
      return_y += this.row_height / 2;
    }

    var return_point = new Point(return_x, return_y);
    return return_point;
  }; // end draw_point

  this.set_cell = function (col, row, cell_type) {
    cells[col][row] = cell_type.make();
  };
  this.set_entity = function (col, row, entity_type) {
    entities[col][row] = base_entity.make(entity_type);
    base_entity.set_location(entities[col][row], col, row);
  };

  //takes cell type
  //sets every cell in the grid to the given type
  this.fill_cells = function (cell_type) {
    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        cells[col][row] = cell_type.make();
      }
    }
  }; // end fill_cells

  //takes entity type
  //sets every entity in the grid to the given type
  this.fill_entities = function (entity_type) {
    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        entities[col][row] = entity_type.make();
        base_entity.set_location(entities[col][row], col, row);
      }
    }
  }; // end fill_entities

}; // end Board