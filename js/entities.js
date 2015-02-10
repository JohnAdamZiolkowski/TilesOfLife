/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var NoEntity = function () {
  this.name = "noEntity";
  this.color = colors.cursor;
  this.make = function () {
    return new NoEntity();
  };
};

var Sheep = function () {
  this.name = "sheep";
  this.color = colors.sheep;

  this.max_food = 4;
  this.max_health = 4;
  this.max_water = 4;
  this.spawn = entity_types.sheepling;
  this.grazing_type = cell_types.grass;

  this.age = 0;
  this.food = this.max_food / 2;
  this.health = this.max_health / 2;
  this.water = this.max_water / 2;

  this.make = function () {
    return new Sheep();
  }
  this.next_phase = function () {
    this.age++;
    base_entity.choose_action(this);
  };
};

var Wolf = function () {
  this.name = "wolf";
  this.color = colors.wolf;

  this.max_food = 4;
  this.max_health = 4;
  this.max_water = 4;

  this.age = 0;
  this.food = this.max_food / 2;
  this.health = this.max_health / 2;
  this.water = this.max_water / 2;
  this.spawn = entity_types.wolfling;
  this.prey = entity_types.sheep;

  this.make = function () {
    return new Wolf();
  };
  this.next_phase = function () {
    this.age++;
    base_entity.choose_action(this);
  }
};

var Sheepling = function () {
  this.name = "sheepling";
  this.color = colors.sheepling;

  this.max_food = 4;
  this.max_health = 4;
  this.max_water = 4;
  this.ling = true;
  this.adult = entity_types.sheep;
  this.max_age = 4;

  this.age = 0;
  this.food = this.max_food / 2;
  this.health = this.max_health / 2;
  this.water = this.max_water / 2;

  this.make = function () {
    return new Sheepling();
  };
  this.next_phase = function () {
    this.age++;
    base_entity.choose_action(this);
  };
};

var Wolfling = function () {
  this.name = "wolfling";
  this.color = colors.wolfling;

  this.max_food = 4;
  this.max_health = 4;
  this.max_water = 4;
  this.ling = true;
  this.adult = entity_types.wolf;
  this.max_age = 4;
  this.prey = entity_types.sheepling;

  this.age = 0;
  this.food = this.max_food / 2;
  this.health = this.max_health / 2;
  this.water = this.max_water / 2;

  this.make = function () {
    return new Wolfling();
  };
  this.next_phase = function () {
    this.age++;
    base_entity.choose_action(this);
  };
};

var Corpse = function () {
  this.name = "corpse";
  this.color = colors.corpse;

  this.max_food = 4;
  this.max_health = 4;
  this.max_water = 4;

  this.age = 0;
  this.food = 0;
  this.health = 0;
  this.water = 0;

  this.make = function () {
    return new Corpse();
  };
  this.next_phase = function () {
    this.age++;
    base_entity.choose_action(this);
  };
};

var Corpseling = function () {
  this.name = "corpseling";
  this.color = colors.corpseling;

  this.max_food = 4;
  this.max_health = 4;
  this.max_water = 4;

  this.age = 0;
  this.food = 0;
  this.health = 0;
  this.water = 0;
  this.ling = true;

  this.make = function () {
    return new Corpseling();
  };
  this.next_phase = function () {
    this.age++;
    base_entity.choose_action(this);
  };
};
