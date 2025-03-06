const POINT_RADIUS = 10;

/**
 * A panel for drawing splines and calculating the Lagrange interpolation.
 */
class SplinePanel extends Panel {
  /**
   * Construct a new spline panel.
   */
  constructor(mock) {
    super();
    // Initial points (can be moved)
    this._points = [
      { u: 0, p: [300, 300] },
      { u: 1, p: [600, 300] },
      { u: 2, p: [300, 600] },
      { u: 3, p: [600, 600] },
      { u: 4, p: [900, 600] },
      { u: 5, p: [600, 900] },
    ];
    this._selectedPoint = null;
  }

  /**
   * Handle the mouse down event.
   */
  onMouseDown(mouse) {
    this._selectedPoint = this.findPoint(mouse.x, mouse.y);
  }

  /**
   * Handle the mouse move event.
   */
  onMouseMove(mouse) {
    if (this._selectedPoint != null) {
      this._selectedPoint.p = [mouse.x, mouse.y];
      this.requireRedraw();
    }
  }

  /**
   * Handle the mouse up event.
   */
  onMouseUp(mouse) {
    this._selectedPoint = null;
  }

  /**
   * Find a control point at the given coordinates.
   */
  findPoint(x, y) {
    for (let point of this._points) {
      const dx = point.p[0] - x;
      const dy = point.p[1] - y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < POINT_RADIUS) {
        return point;
      }
    }
    return null;
  }

  /**
   * Compute the Lagrange interpolation for a given parameter u.
   */
  lagrangeInterpolation(points, u) {
    let n = points.length;
    let dimension = points[0].p.length;
    let result = new Array(dimension).fill(0);

    for (let i = 0; i < n; i++) {
      let L_i = 1;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          L_i *= (u - points[j].u) / (points[i].u - points[j].u);
        }
      }
      for (let d = 0; d < dimension; d++) {
        result[d] += L_i * points[i].p[d];
      }
    }
    return result;
  }

  /**
   * Draw the content of the panel.
   */
  draw(context) {
    context.fillStyle = "#FFF";
    context.fillRect(0, 0, this.width, this.height);

    // Draw Lagrange interpolation curve
    context.strokeStyle = "#F00";
    context.beginPath();
    let firstPoint = this.lagrangeInterpolation(this._points, 0);
    context.moveTo(firstPoint[0], firstPoint[1]);

    for (let u = 0; u <= this._points.length - 1; u += 0.01) {
      let [x, y] = this.lagrangeInterpolation(this._points, u);
      if (x >= 0 && x <= this.width && y >= 0 && y <= this.height) {
        context.lineTo(x, y);
      }
    }
    context.stroke();

    this.drawPoints(context);
    this.drawLines(context);
  }

  /**
   * Draw the control points.
   */
  drawPoints(context) {
    for (const point of this._points) {
      this.drawPoint(context, point);
    }
  }

  /**
   * Draw a control point.
   */
  drawPoint(context, point) {
    context.strokeStyle = "#00F";
    context.beginPath();
    context.arc(point.p[0], point.p[1], POINT_RADIUS, 0, Math.PI * 2);
    context.stroke();
  }

  /**
   * Draw the lines connecting control points.
   */
  drawLines(context) {
    context.strokeStyle = "#AAA";
    context.beginPath();
    context.moveTo(this._points[0].p[0], this._points[0].p[1]);
    for (let i = 1; i < this._points.length; i++) {
      context.lineTo(this._points[i].p[0], this._points[i].p[1]);
    }
    context.stroke();
  }
}
