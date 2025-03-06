const POINT_RADIUS = 10;

/**
 * A panel for drawing splines and calculating Hermite interpolations.
 */
class SplinePanel extends Panel {
  constructor(mock) {
    super();
    this._points = [
      { u: 0, p: [200, 200] },
      { u: 1, p: [400, 200] },
      { u: 2, p: [200, 400] },
      { u: 3, p: [400, 400] },
    ];
    this._selectedPoint = null;
  }

  onMouseDown(mouse) {
    this._selectedPoint = this.findPoint(mouse.x, mouse.y);
  }

  onMouseMove(mouse) {
    if (this._selectedPoint != null) {
      this._selectedPoint.p = [mouse.x, mouse.y];
      this.requireRedraw();
    }
  }

  onMouseUp(mouse) {
    this._selectedPoint = null;
  }

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

  calculateTangent(i) {
    if (i === 0) {
      return [
        (this._points[i + 1].p[0] - this._points[i].p[0]) * 0.5,
        (this._points[i + 1].p[1] - this._points[i].p[1]) * 0.5,
      ];
    } else if (i === this._points.length - 1) {
      return [
        (this._points[i].p[0] - this._points[i - 1].p[0]) * 0.5,
        (this._points[i].p[1] - this._points[i - 1].p[1]) * 0.5,
      ];
    } else {
      return [
        (this._points[i + 1].p[0] - this._points[i - 1].p[0]) * 0.5,
        (this._points[i + 1].p[1] - this._points[i - 1].p[1]) * 0.5,
      ];
    }
  }

  hermiteInterpolation(p0, p1, t0, t1, u) {
    let h00 = (2 * u ** 3) - (3 * u ** 2) + 1;
    let h10 = (u ** 3) - (2 * u ** 2) + u;
    let h01 = (-2 * u ** 3) + (3 * u ** 2);
    let h11 = (u ** 3) - (u ** 2);

    let x = h00 * p0[0] + h10 * t0[0] + h01 * p1[0] + h11 * t1[0];
    let y = h00 * p0[1] + h10 * t0[1] + h01 * p1[1] + h11 * t1[1];
    return [x, y];
  }

  draw(context) {
    context.fillStyle = "#FFF";
    context.fillRect(0, 0, this.width, this.height);

    context.strokeStyle = "#F00";
    context.beginPath();
    for (let i = 0; i < this._points.length - 1; i++) {
      let p0 = this._points[i].p;
      let p1 = this._points[i + 1].p;
      let t0 = this.calculateTangent(i);
      let t1 = this.calculateTangent(i + 1);

      let firstHermite = this.hermiteInterpolation(p0, p1, t0, t1, 0);
      context.moveTo(firstHermite[0], firstHermite[1]);

      for (let u = 0; u <= 1; u += 0.02) {
        let [x, y] = this.hermiteInterpolation(p0, p1, t0, t1, u);
        context.lineTo(x, y);
      }
    }
    context.stroke();

    this.drawPoints(context);
    this.drawLines(context);
  }

  drawPoints(context) {
    for (const point of this._points) {
      this.drawPoint(context, point);
    }
  }

  drawPoint(context, point) {
    context.strokeStyle = "#00F";
    context.beginPath();
    context.arc(point.p[0], point.p[1], POINT_RADIUS, 0, Math.PI * 2);
    context.stroke();
  }

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
