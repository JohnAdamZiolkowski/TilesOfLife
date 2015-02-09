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
    if (typeof(entity.name) != "undefined") string += space + "type: " + entity.name;
    if (typeof(entity.age) != "undefined") string += space + "age: " + entity.age + " phases";
    if (typeof(entity.last_action) != "undefined") string += space + "last action: " + entity.last_action;
    if (typeof(entity.food) != "undefined") string += space + "food: " + entity.food + "/" + entity.max_food;
    if (typeof(entity.health) != "undefined") string += space + "health: " + entity.health + "/" + entity.max_health;
    if (typeof(entity.water) != "undefined") string += space + "water: " + entity.water + "/" + entity.max_water;
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

  this.set_location = function (entity, col, row) {
    entity.col = col;
    entity.row = row;
    entity.type_index = get_entity_type_index(entity);
  };

  this.choose_action = function (entity) {
    var actions = [];

    //eat cell
    //only if hungry and standing on cell
    if (entity.grazing_type)
      if (entity.food < entity.max_food)
        if (check_cell_type(cellsPrev[entity.col][entity.row], entity.grazing_type))
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
        if (count_adjacent_entities(entitiesPrev, entity.col, entity.row, entity.adult) > 0)
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
      if (get_adjacent_entities_locations(entity.col, entity.row, entity_types.noEntity).length > 0) {
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

    if (check_entity_type(entity, entity_types.corpse) ||
        check_entity_type(entity, entity_types.corpseling))
      action = action_types.rot;

    entity.last_action = action;
    base_entity.perform_action(entity, action);
  }

  this.perform_action = function (entity, action) {
    switch (action) {
    case action_types.nothing:
      this.nothing(entity);
      break;
    case action_types.move:
      this.move(entity);
      break;
    case action_types.graze:
      this.graze(entity);
      break;
    case action_types.drink:
      this.drink(entity);
      break;
    case action_types.suckle:
      this.suckle(entity);
      break;
    case action_types.evolve:
      this.evolve(entity);
      break;
    case action_types.breed:
      this.breed(entity);
      break;
    case action_types.die:
      this.die(entity);
      break;
    case action_types.rot:
      this.rot(entity);
      break;
    }
  };
  this.nothing = function (entity) {
    entity.food--;
    //TODO: reduce water as well
  }
  this.rot = function (entity) {
    if (entity.food > 0)
      entity.food--;
    if (entity.water > 0)
    entity.water--;
    if (entity.health > 0)
    entity.health--;

    if (entity.food === 0 &&
       entity.water === 0 &&
       entity.health === 0)
      this.delete(entity)

    //TODO: update anything?
  }
  this.move = function (entity, new_col, new_row) {
    move_entity(entity, new_col, new_row);
    //TODO: fill old slot
    //TODO: reduce food and water while moving?
  };
  this.graze = function (entity) {
    entity.food += 1;
    if (entity.food > entity.max_food)
      entity.food = entity.max_food;
    cells[entity.col][entity.row].graze(entity.col, entity.row);
  };
  this.drink = function (entity) {
    entity.water++;
    //TODO: drink cell
  };
  this.suckle = function (entity) {
    entity.food += 1;
    //TODO: old logic of more parents = faster growth
    //entity.food += count_adjacent_entities(entitiesPrev, col, row, entity.adult);
  };
  this.die = function (entity) {
    if (entity.ling)
      transform_entity(entity, entity_types.corpseling);
    else
      transform_entity(entity, entity_types.corpse);
  };
  this.delete = function (entity) {
    board.set_entity(entity.col, entity.row, entity_types.noEntity);
  };
  this.evolve = function (entity) {
    transform_entity(entity, entity.adult);
    entities[entity.col][entity.row].food = entities[entity.col][entity.row].max_food / 2;
  };
  this.breed = function (entity) {
    var location = get_random_item(get_adjacent_entities_locations(entity.col, entity.row, entity_types.noEntity))
    if (location) {
      entity.food = entity.max_food / 2;
      board.set_entity(location.x, location.y, entity.spawn);
    } else {
      entity.food = entity.max_food;
    }
  };
};
