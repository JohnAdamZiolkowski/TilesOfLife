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

document.documentElement.addEventListener("click", function (e) {
  document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  

}, false);

window.addEventListener("fullscreenchange ", function (e) {
  fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
  fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
}, false);

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}