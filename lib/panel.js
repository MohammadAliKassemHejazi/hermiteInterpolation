/**
 * Represents a rectangular shaped panel.
 */
class Panel
{
    /**
     * Construct a new panel.
     */
    constructor()
    {
        // NOTE: Their visibility is intentional.
        //       These data must be available for the container.
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        this.parent = null;

        // TODO: Consider a possibility to use an object instead of an array!
        //       It maybe results better code reability!
        this.children = [];

        this.isRedrawNeeded = true;
    }

    /**
     * Add a child panel.
     */
    addChild(child)
    {
        child.parent = this;
        this.children.push(child);
    }

    /**
     * Resize the panel and its children.
     */
    _resize()
    {
        this.resize();
        this.resizeChildren();
        this.requireRedraw();
    }

    /**
     * Update the content according to the actual size of the panel.
     *
     * It assumes that, the container panel has updated its size
     * (the x, y, width and height attributes) in the meantime.
     */
    resize()
    {
    }

    /**
     * Resize the children of the panel.
     */
    resizeChildren(context)
    {
        for (let child of this.children) {
            child._resize();
        }
    }

    /**
     * Find the panel and its local coordinates at the position
     * of the mouse pointer.
     */
    findCursor(position)
    {
        for (let child of this.children) {
            if (position.x >= child.x &&
                position.x < child.x + child.width &&
                position.y >= child.y &&
                position.y < child.y + child.height
            ) {
                let relativePosition = {
                    x: position.x - child.x,
                    y: position.y - child.y
                };
                return child.findCursor(relativePosition);
            }
        }
        let cursor = {
            x: position.x,
            y: position.y,
            panel: this
        };
        return cursor;
    }

    /**
    * Handle the mouse down event.
    */
    onMouseDown(mouse)
    {
    }

    /**
    * Handle the mouse move event.
    */
    onMouseMove(mouse)
    {
    }

    /**
    * Handle the mouse up event.
    */
    onMouseUp(mouse)
    {
    }

    /**
    * Handle the key down event.
    */
    onKeyDown(key)
    {
    }

    /**
    * Handle the key up event.
    */
    onKeyUp(key)
    {
    }

    /**
     * Start the dragging.
     */
    startDragging(dragging)
    {
        if (dragging.mode == "internal") {
            dragging.offset = {
                x: 0,
                y: 0
            };
        }
        this._startDragging(dragging);
    }

    /**
     * Notify the parent about the starting of the dragging.
     */
    _startDragging(dragging)
    {
        if (this.parent != null) {
            if (dragging.mode == "internal") {
                dragging.offset.x += this.x;
                dragging.offset.y += this.y;
            }
            this.parent._startDragging(dragging);
        } else {
            // NOTE: This is the root.
            screen._dragging = dragging;
        }
    }

    /**
     * Called on mouse move event during a dragging operation.
     */
    onDragging(dragging, mouse)
    {
    }

    /**
     * Handle the drop event.
     */
    onDrop(dragging, mouse)
    {
    }

    /**
     * Require the parent to redraw this element in the next time.
     */
    requireRedraw()
    {
        this.isRedrawNeeded = true;
        if (this.parent != null) {
            // NOTE: It assumes that the parent container also have used the method `requireRedraw`
            //       for requiring redrawing (instead of direct assignment).
            //       It improves the performance in the case of recursive resize calls and
            //       deeply nested layouts.
            if (this.parent.isRedrawNeeded == false) {
                this.parent.requireRedraw();
            }
        }
    }

    /**
     * Draw the panel itself, and all of their children after.
     */
    _draw(context)
    {
        if (this.isRedrawNeeded == true) {
            this.draw(context);
            this.drawChildren(context);
            this.drawOverlay(context);
            this.isRedrawNeeded = false;
        }
    }

    /**
     * Draw the content of the panel.
     */
    draw(context)
    {
    }

    /**
     * Draw an overlay above the children.
     */
    drawOverlay(context)
    {
    }

    /**
     * Draw the children of the panel.
     */
    drawChildren(context)
    {
        for (let child of this.children) {
            context.save();
            context.translate(child.x, child.y);
            child._draw(context);
            context.restore();
        }
    }
}

