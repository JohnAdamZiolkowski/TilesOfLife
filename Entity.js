/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var Entity = function () {
  this.about = function (entity) {
    var space = "<br>&nbsp&nbsp> ";
    var string = "";
    if (entity.name) string += space + "type: " + entity.name;
    if (entity.age) string += space + "age: " + entity.age + " phases";
    if (entity.last_action) string += space + "last action: " + entity.last_action;
    if (entity.food) string += space + "food: " + entity.food + "/" + entity.max_food;
    if (entity.health) string += space + "health: " + entity.health + "/" + entity.max_health;
    if (entity.water) string += space + "water: " + entity.water + "/" + entity.max_water;
    return string;
  };
  //TODO: implement Cell Factory
  this.make = function (entity_type) {
    return new entity_types2[entity_type.name]();
  };

  this.randomize = function (entity) {
    if (entity.age) entity.age = get_random_int(0, entity.max_age);
    //if (entity.last_action); //TODO: implement random last action
    if (entity.food) entity.food = get_random_int(1, entity.max_food);
    if (entity.health) entity.health = get_random_int(1, entity.max_health);
    if (entity.water) entity.food = get_random_int(1, entity.max_water);
  };

  this.choose_action = function (entity, col, row) {
    var actions = new Array();

    //eat cell
    //only if hungry and standing on cell
    if (entity.grazing_type)
      if (entity.food < entity.max_food)
        if (check_cell_type(cellsPrev[col][row], entity.grazing_type))
          actions.push(action_types.graze);

        //TODO: DRINK
        //drink cell
    if (false)
      actions.push(action_types.drink);

    //TODO: MOVE
    //move
    if (false)
      actions.push(action_types.move);

    //suckle
    //only if parent nearby
    if (entity.adult)
      if (entity.food < entity.max_food)
        if (count_adjacent_entities(entitiesPrev, col, row, entity.adult) > 0)
          actions.push(action_types.suckle);

        //grow up
        //only if aged and in good shape
    if (entity.ling)
      if (entity.age >= entity.max_age)
        if (entity.food >= entity.max_food / 2 &&
          entity.health >= entity.max_health / 2 &&
          entity.water >= entity.max_water / 2)
          actions.push(action_types.evolve);

        //reproduce
        //only if well fed
        // TODO: need water and health as well
    if (entity.spawn && entity.food > entity.max_food / 2) {
      if (get_adjacent_entities_locations(col, row, entity_types.noEntity).length > 0) {
        actions.push(action_types.breed);
      }
    }

    //die
    //TODO: let lack of water and health also cause death
    if (entity.food <= 0) // || entity.water <= 0 || entity.health <= 0)
      actions.push(action_types.die);

    //TODO: weigh options very carefully
    var action = get_random_item(actions);
    if (actions.length === 0)
      action = action_types.nothing;

    entity.last_action = action;
    base_entity.perform_action(entity, action, col, row);
  }

  this.perform_action = function (entity, action, col, row) {
    switch (action) {
    case action_types.nothing:
      this.nothing(entity);
      break;
    case action_types.move:
      this.move(entity);
      break;
    case action_types.graze:
      this.graze(entity, col, row);
      break;
    case action_types.drink:
      this.drink(entity);
      break;
    case action_types.suckle:
      this.suckle(entity, col, row);
      break;
    case action_types.evolve:
      this.evolve(entity, col, row);
      break;
    case action_types.breed:
      this.breed(entity, col, row);
      break;
    case action_types.die:
      this.die(entity, col, row);
      break;
    }
  };
  this.nothing = function (entity) {
    entity.food--;
    //TODO: reduce water as well
  }
  this.move = function (entity, col, row, new_col, new_row) {
    move_entity(entity, new_col, new_row);
    //TODO: fill old slot
    //TODO: reduce food and water while moving?
  };
  this.graze = function (entity, col, row) {
    entity.food += 1;
    if (entity.food > entity.max_food)
      entity.food = entity.max_food;
    cells[col][row].graze(col, row);
  };
  this.drink = function (entity, cell) {
    entity.water++;
    //TODO: drink cell
  };
  this.suckle = function (entity, col, row) {
    entity.food += 1;
    //TODO: old logic of more parents = faster growth
    //entity.food += count_adjacent_entities(entitiesPrev, col, row, entity.adult);
  };
  this.die = function (entity, col, row) {
    board.set_entity(col, row, entity_types.noEntity);
  };
  this.evolve = function (entity, col, row) {
    transform_entity(entity, entity.adult, col, row);
    entities[col][row].food = entities[col][row].max_food / 2;
  };
  this.breed = function (entity, col, row) {
    var location = get_random_item(get_adjacent_entities_locations(col, row, entity_types.noEntity))
    if (location) {
      entity.food = entity.max_food / 2;
      board.set_entity(location.x, location.y, entity.spawn);
    } else {
      entity.food = entity.max_food;
    }
  };
};

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
  this.next_phase = function (col, row) {
    this.age++;
    base_entity.choose_action(this, col, row);
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

  this.make = function () {
    return new Wolf();
  };
  this.next_phase = function (col, row) {
    this.age++;
    base_entity.choose_action(this, col, row);
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
  this.next_phase = function (col, row) {
    this.age++;
    base_entity.choose_action(this, col, row);
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

  this.age = 0;
  this.food = this.max_food / 2;
  this.health = this.max_health / 2;
  this.water = this.max_water / 2;

  this.make = function () {
    return new Wolfling();
  };
  this.next_phase = function (col, row) {
    this.age++;
    base_entity.choose_action(this, col, row);
  };
};
