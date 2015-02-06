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
  subtitle.resize();
  graph.resize();
  board.resize();
  toolbox.resize();

}

window.addEventListener("resize", function (e) {

  new_state = states.menu;

  clearTimeout(doit);
  doit = setTimeout(resize_handler, 100);
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

  e.preventDefault();

  //switched from e.pageX/Y
  //not sure if good idea
  controller.click(e.clientX, e.clientY);

  if (state == states.main) {
    //TODO: figure out how the hell this cursor is working
    var target = board.target(cursor.x, cursor.y);

    if (target.col > 0 && target.row > 0)
      cursor.trigger(target.col, target.row);
    
    toolbox.click(e.clientX, e.clientY);
  }

}, false);

document.addEventListener("mousemove", function (e) {

  cursor.move_to(e.clientX, e.clientY);

  if (state == states.main) {
    if (click_hold) {
      var target = board.target(cursor.x, cursor.y);

        if (target.col > 0 && target.row > 0)
          cursor.trigger(target.col, target.row);
    }

  }

  if (state == states.menu) {
    click_hold = false;
    menu.mouse_move(e.clientX, e.clientY);
  }

  //controller.click(e.pageX, e.pageY);


}, false);

var click_hold;

document.addEventListener("mousedown", function (e) {

  click_hold = true;

}, false);

document.addEventListener("mouseup", function (e) {

  click_hold = false;
}, false);





//document.addEventListener("onmousemove", function (e) {
//  cursor.move(e.pageX, e.pageY);
//
//}, false);


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