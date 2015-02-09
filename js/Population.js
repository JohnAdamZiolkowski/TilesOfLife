/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var Population = function (cells, entities) {
  this.total_cells = board.cols * board.rows;
  this.cell_counts = [];
  for (var cell_type = 0; cell_type < cell_types.length; cell_type++)
    this.cell_counts.push(count_cells_by_type(cells, cell_types[cell_type]));
  this.cell_ratios = [];
  for (var cell_type = 0; cell_type < cell_types.length; cell_type++)
    this.cell_ratios.push(this.cell_counts[cell_type] / this.total_cells);

  this.total_entities = this.total_cells - count_entities_by_type(entities, entity_types.noEntity);
  this.entity_counts = [];
  for (var entity_type = 0; entity_type < entity_types.length; entity_type++)
    this.entity_counts.push(count_entities_by_type(entities, entity_types[entity_type]));
  this.entity_ratios = [];
  for (var entity_type = 0; entity_type < entity_types.length; entity_type++)
    this.entity_ratios.push(this.entity_counts[entity_type] / this.total_entities);
};
