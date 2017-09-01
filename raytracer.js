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
        .map(obj => {
          const t = obj.getIntersection(ray);
          if (!t) { return null; }

          let point = ray.at(t);

          return {
            object: obj,
            t: t,
            point: point,
            normal: obj.normalAt(point)
          };
        })
        .filter(intersection => intersection),
      intersection => intersection.t
    );

    if (!intersection) {
      return new Color(0, 0, 0);
    }

    return this._colorAtIntersection(intersection);
  }

  _colorAtIntersection(intersection) {
    let color = new Color(0, 0, 0);
    const material = intersection.object.material;

    const v = this.scene
      .camera
      .minus(intersection.point)
      .normalized();

    this.scene
      .lights
      .forEach(light => {
        const l = light
          .position
          .minus(intersection.point)
          .normalized();

        const lightInNormalDirection = intersection.normal.dot(l);
        if (lightInNormalDirection < 0) {
          return;
        }

        const diffuse = material
          .kd
          .times(light.id)
          .scale(lightInNormalDirection);
        color.addInPlace(diffuse);

        const r = intersection
          .normal
          .scale(2)
          .scale(lightInNormalDirection)
          .minus(l);

        const amountReflectedAtViewer = v.dot(r);
        const specular = material
          .ks
          .times(light.is)
          .scale(Math.pow(amountReflectedAtViewer, material.alpha));
        color.addInPlace(specular);
      });

    const ambient = material
      .ka
      .times(this.scene.ia);
    color.addInPlace(ambient);

    color.clampInPlace();
    return color;
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
  ia: new Color(0.5, 0.5, 0.5),
  lights: [
    {
      position: new Vector3(-3, -0.5, 1),
      id: new Color(0.8, 0.3, 0.3),
      is: new Color(0.8, 0.8, 0.8)
    },
    {
      position: new Vector3(3, 2, 1),
      id: new Color(0.4, 0.4, 0.9),
      is: new Color(0.8, 0.8, 0.8)
    }
  ],
  objects: [
    new Sphere(
      new Vector3(-1.1, 0.6, -1),
      0.2,
      {
        ka: new Color(0.1, 0.1, 0.1),
        kd: new Color(0.5, 0.5, 0.9),
        ks: new Color(0.7, 0.7, 0.7),
        alpha: 20
      }
    ),
    new Sphere(
      new Vector3(0.2, -0.1, -1),
      0.5,
      {
        ka: new Color(0.1, 0.1, 0.1),
        kd: new Color(0.9, 0.5, 0.5),
        ks: new Color(0.7, 0.7, 0.7),
        alpha: 20
      }
    ),
    new Sphere(
      new Vector3(1.2, -0.5, -1.75),
      0.4,
      {
        ka: new Color(0.1, 0.1, 0.1),
        kd: new Color(0.5, 0.9, 0.5),
        ks: new Color(0.7, 0.7, 0.7),
        alpha: 20
      }
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
