/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

window.onload = function () {
  canvas = document.getElementById('world');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  c = canvas.getContext('2d');
  controller = new Controller();
  init();
  doLoop();
};

window.addEventListener("resize", function (e) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}, false);

window.addEventListener("keydown", function (e) {
  e.preventDefault();
  controller.keysDown[e.keyCode] = true;
  delete controller.keysUp[e.keyCode];
}, false);

window.addEventListener("keyup", function (e) {
  e.preventDefault();
  controller.keysUp[e.keyCode] = true;
  delete controller.keysDown[e.keyCode];
}, false);

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();