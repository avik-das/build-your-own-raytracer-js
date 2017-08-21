class RayTracer {
  constructor(scene, w, h) {
    this.scene = scene;
    this.w = w;
    this.h = h;
  }

  tracedValueAtPixel(x, y) {
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
    const ray = new Ray(
      point,
      point.minus(this.scene.camera)
    );

    return new Color(
      (ray.direction.x + 1.2) / 2.6,
      (ray.direction.y + 0.9) / 2,
      ray.direction.z / -6
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
  }
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
