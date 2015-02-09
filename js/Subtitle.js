/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

var Subtitle = function () {
  this.text = "Tiles of Life";
  this.element = document.getElementById('messenger2');

  //this.element.style.textAlign = "center";
  this.element.style.fontSize = 48+"px";
//  this.element.style.margin = "auto";


  this.draw = function () {
    //clear messenger
    this.element.innerHTML = this.text;
  };


  this.resize = function () {

    this.x = window.innerWidth / 2 - 195;

    this.element.style.top = 0 + "px";
  }

  this.resize();
};
