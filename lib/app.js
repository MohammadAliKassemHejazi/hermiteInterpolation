// TODO: Use special prefix for the global variables!
var canvas = null;
var canvasPosition = null;
var context = null;
var screen = null;

/**
 * Initialize the application.
 */
function initialize()
{
  initCanvas();
  screen = new Screen();
  initContent();
  resize();
}

/**
 * Initialize the canvas related variables.
 */
function initCanvas()
{
  canvas = document.getElementById("my-canvas");
  canvasPosition = canvas.getBoundingClientRect();
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mousemove", mouseMove, false);
  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("mousewheel", mouseWheel, false);
  canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  window.addEventListener("keydown", keyDown, false);
  window.addEventListener("keyup", keyUp, false);
  context = canvas.getContext("2d");
}

/**
 * Resize the application.
 */
function resize()
{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  screen.resize({
    width: window.innerWidth,
    height: window.innerHeight
  });
  screen.draw(context);
}

/**
 * Calculate the mouse event with proper coordinates.
 */
function calcMouseEvent(event)
{
   return {
     x: event.clientX - canvasPosition.left,
     y: event.clientY - canvasPosition.top,
     button: event.button
   };
}

/**
 * Callback function for the mouse down event.
 * Directly called from the canvas element.
 */
function mouseDown(event)
{
  const mouse = calcMouseEvent(event);
  screen.handleMouseDown(mouse);
  screen.draw(context);
}

/**
 * Callback function for the mouse move event.
 * Directly called from the canvas element.
 */
function mouseMove(event)
{
  const mouse = calcMouseEvent(event);
  screen.handleMouseMove(mouse);
  screen.draw(context);
}

/**
 * Callback function for the mouse up event.
 * Directly called from the canvas element.
 */
function mouseUp(event)
{
  const mouse = calcMouseEvent(event);
  screen.handleMouseUp(mouse);
  screen.draw(context);
}

/**
 * Callback function for the mouse wheel event.
 * Directly called from the canvas element.
 */
function mouseWheel(event)
{
  const mouse = calcMouseEvent(event);
  const delta = event.wheelDelta;
  event.preventDefault();
}

/**
 * Callback function for the key down event.
 * Directly called from the window.
 */
function keyDown(event)
{
  screen.handleKeyDown(event);
  screen.draw(context);
}

/**
 * Callback function for the key up event.
 * Directly called from the window.
 */
function keyUp(event)
{
  screen.handleKeyUp(event);
  screen.draw(context);
}

