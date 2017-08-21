const WIDTH = 256;
const HEIGHT = 192;

const image = new Image(WIDTH, HEIGHT);
document.image = image;

for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    image.putPixel(x, y, {
      r: x / WIDTH * 256,
      g: y / HEIGHT * 256,
      b: 0
    });
  }
}

image.renderInto(document.querySelector('body'));
