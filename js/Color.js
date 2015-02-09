/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var Color = function (red, green, blue) {
  this.red = red;
  this.green = green;
  this.blue = blue;

  this.style = 'rgb(' + this.red + ', ' + this.green + ', ' + this.blue + ')';

  this.darken = function () {
    var modifier = 1 / 4 * 3;
    return new Color(Math.floor(this.red * modifier), Math.floor(this.green * modifier), Math.floor(this.blue * modifier));
  };
}; // end Color
