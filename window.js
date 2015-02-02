/*
TilesOfLife
author: John Adam Ziolkowski
github: JohnAdamZiolkowski
email:  johnadamziolkowski@gmail.com
*/

"use strict";

window.onload = function () {
  fullscreenElement = false;
  fullscreenEnabled = false;
  controller = new Controller();
  init();
  doLoop();
};

var doit;
function resize_handler() {
  bg_canvas.width = window.innerWidth;
  bg_canvas.height = window.innerHeight;
  background.resize();
  menu.resize();
  
}

window.addEventListener("resize", function (e) {
  
  new_state = states.menu;
  
  clearTimeout(doit);
  doit = setTimeout(resize_handler, 100);
  
//  entity_canvas.width = window.innerWidth;
//  entity_canvas.height = window.innerHeight;
//  cell_canvas.width = window.innerWidth;
//  cell_canvas.height = window.innerHeight;
//  extra_canvas.width = window.innerWidth;
//  extra_canvas.height = window.innerHeight;
//  ui_canvas.width = window.innerWidth;
//  ui_canvas.height = window.innerHeight;
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

document.addEventListener("click", function (e) {

  controller.click();

}, false);


//TODO: figure out why fullscreenchange event handler isn't firing
//document.addEventListener("fullscreenchange", function (e) {
//  fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
//  fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitIsFullScreen ? true : false;;
//}, false);

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

function requestFullscreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}