class RayTracer {
  constructor(scene, w, h) {
    this.scene = scene;
    this.w = w;
    this.h = h;
  }

  tracedValueAtPixel(x, y) {
    function min(xs, f) {
      if (xs.length == 0) {
        return null;
      }

      let minValue = Infinity;
      let minElement = null;
      for (let x of xs) {
        const value = f(x);
        if (value < minValue) {
          minValue = value;
          minElement = x;
        }
      }

      return minElement;
    }

    const ray = this._rayForPixel(x, y);
    const intersection = min(
      this.scene
        .objects
        .map(obj => ({object: obj, t: obj.getIntersection(ray)}))
        .filter(intersection => intersection.t),
      intersection => intersection.t
    );

    if (!intersection) {
      return new Color(0, 0, 0);
    }

    return intersection.object.color;
  }

  _rayForPixel(x, y) {
    const xt = x / this.w;
    const yt = (this.h - y - 1) / this.h;

    const top = Vector3.lerp(
      this.scene.imagePlane.topLeft,
      this.scene.imagePlane.topRight,
      xt
    );

    const bottom = Vector3.lerp(
      this.scene.imagePlane.bottomLeft,
      this.scene.imagePlane.bottomRight,
      xt
    );

    const point = Vector3.lerp(bottom, top, yt);
    return new Ray(
      point,
      point.minus(this.scene.camera)
    );
  }
}

const WIDTH = 256;
const HEIGHT = 192;

const SCENE = {
  camera: new Vector3(0, 0, 2),
  imagePlane: {
    topLeft: new Vector3(-1.28, 0.86, -0.5),
    topRight: new Vector3(1.28, 0.86, -0.5),
    bottomLeft: new Vector3(-1.28, -0.86, -0.5),
    bottomRight: new Vector3(1.28, -0.86, -0.5)
  },
  objects: [
    new Sphere(
      new Vector3(-1.1, 0.6, -1),
      0.2,
      new Color(0, 0, 1)
    ),
    new Sphere(
      new Vector3(0.2, -0.1, -1),
      0.5,
      new Color(1, 0, 0)
    ),
    new Sphere(
      new Vector3(1.2, -0.5, -1.75),
      0.4,
      new Color(0, 1, 0)
    )
  ]
};

const image = new Image(WIDTH, HEIGHT);
document.image = image;

const imageColorFromColor = color => ({
  r: Math.floor(color.r * 255),
  g: Math.floor(color.g * 255),
  b: Math.floor(color.b * 255)
});

const tracer = new RayTracer(SCENE, WIDTH, HEIGHT);

for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    image.putPixel(
      x,
      y,
      imageColorFromColor(tracer.tracedValueAtPixel(x, y))
    );
  }
}

image.renderInto(document.querySelector('body'));
