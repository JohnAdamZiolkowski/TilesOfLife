/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var Stone = function () {
  this.type_index = 0;
  this.name = "stone";
  this.color = colors.stone;

  this.make = function () {
    return new Stone();
  }
  this.about = function () {
    var string = "";
    string += "<br>&nbsp&nbsp> type: " + this.name;
    return string;
  };
};
var Grass = function () {
  this.type_index = 2;
  this.name = "grass";
  this.color = colors.grass;

  this.max_grass = 4;

  this.grass = this.max_grass;
  this.under = cell_types.dirt;

  this.make = function () {
    return new Grass();
  }
  this.graze = function (col, row) {
    this.grass -= 2;
    if (this.grass <= 0)
      board.set_cell(col, row, this.under);
  };
  this.about = function () {
    var string = "";
    string += "<br>&nbsp&nbsp> type: " + this.name;
    string += "<br>&nbsp&nbsp> grass: " + this.grass + "/" + this.max_grass;
    return string;
  }
};
var Water = function () {
  this.type_index = 3;
  this.name = "water";
  this.color = colors.water;

  this.make = function () {
    return new Water();
  }
  this.about = function () {
    var string = "";
    string += "<br>&nbsp&nbsp> type: " + this.name;
    return string;
  };
};
var Dirt = function () {
  this.type_index = 1;
  this.name = "dirt";
  this.color = colors.dirt;

  this.max_seed = 4;

  this.seed = 0;

  this.randomize = function () {
    this.seed = get_random_int(1, this.max_seed);
  };
  this.grow = function () {
    //grow seeds
    if (this.seed > this.max_seed) {
      alert(this.name + "has grown too many seeds");
    }
  };

  this.make = function () {
    return new Dirt();
  }
  this.about = function () {
    var string = "";
    string += "<br>&nbsp&nbsp> type: " + this.name;
    string += "<br>&nbsp&nbsp> seed: " + this.seed + "/" + this.max_seed;
    return string;
  }
  this.next_phase = function (col, row) {
    this.seed += count_adjacent_cells(cellsPrev, col, row, cell_types.grass);
    if (this.seed >= this.max_seed) {
      board.set_cell(col, row, cell_types.grass);
    }
  }
};