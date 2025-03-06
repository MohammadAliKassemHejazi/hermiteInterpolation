/**
 * Represents a screen, as the largest rectangular element for drawing and event handling.
 */
class Screen
{
  /**
   * Construct a new screen.
   */
  constructor()
  {
    this._dimension = null;
    this._root = null;
    this._cursor = null;
    // NOTE: Reserved for future use!
    // this._focused = null;
    this._dragging = null;
  }

  /**
   * Resize the root panel.
   */
  resize(dimension)
  {
    this._dimension = dimension;
    if (this._root != null) {
      this._root.width = dimension.width;
      this._root.height = dimension.height;
      this._root._resize();
    }
  }

  /**
   * Set the root panel.
   */
  setRoot(panel)
  {
    this._root = panel;
    // NOTE: We can assume that the root panel of the screen can be set to null
    //       without problem.
    console.log(panel);
    if (this._root != null) {
      this._root._resize(this._dimension);
    }
  }

  /**
   * Handle the mouse down event.
   */
  handleMouseDown(mouse)
  {
    this.updateCursor(mouse);
    if (this._cursor.panel != null) {
      let m = {
        x: this._cursor.x,
        y: this._cursor.y,
        button: mouse.button
      }
      this._cursor.panel.onMouseDown(m);
    }
  }

  /**
   * Handle the mouse move event.
   */
  handleMouseMove(mouse)
  {
    this.updateCursor(mouse);
    if (this._cursor.panel != null) {
      let m = {
        x: this._cursor.x,
        y: this._cursor.y
      }
      this._cursor.panel.onMouseMove(m);
    }
    if (this._dragging != null) {
      switch (this._dragging.mode) {
      case "internal":
        let m = {
          x: mouse.x - this._dragging.offset.x,
          y: mouse.y - this._dragging.offset.y,
          button: this._dragging.mouse.button
        }
        this._dragging.panel.onDragging(this._dragging, m);
        break;
      case "external":
        break;
      }
    }
  }

  /**
   * Handle the mouse up event.
   */
  handleMouseUp(mouse)
  {
    this.updateCursor(mouse);
    if (this._cursor.panel != null) {
      let m = {
        x: this._cursor.x,
        y: this._cursor.y,
        button: mouse.button
      }
      this._cursor.panel.onMouseUp(m);
    }
    if (this._dragging != null) {
      switch (this._dragging.mode) {
      case "internal":
        let m = {
          x: mouse.x - this._dragging.offset.x,
          y: mouse.y - this._dragging.offset.y,
          button: this._dragging.mouse.button
        }
        this._dragging.panel.onDrop(this._dragging, m);
        break;
      case "external":
        break;
      }
      this._dragging = null;
    }
  }

  /**
   * Update the mouse cursor related data.
   */
  updateCursor(position)
  {
    if (this._root != null) {
      this._cursor = this._root.findCursor(position);
    } else {
      this._cursor = null;
    }
  }

  /**
   * Handle the key down event.
   */
  handleKeyDown(key)
  {
    if (key.repeat == true) {
      return;
    }
    if (this._cursor != null && this._cursor.panel != null) {
      this._cursor.panel.onKeyDown(key);
    }
  }

  /**
   * Handle the key up event.
   */
  handleKeyUp(key)
  {
    if (this._cursor != null && this._cursor.panel != null) {
      this._cursor.panel.onKeyUp(key);
    }
  }

  /**
   * Draw the content of the screen.
   */
  draw(context)
  {
    if (this._root != null) {
      this._root._draw(context);
    }
  }
}

