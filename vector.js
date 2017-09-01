class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  scale(scalar) {
    return new Vector3(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar
    );
  }

  plus(other) {
    return new Vector3(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z
    );
  }

  minus(other) {
    return new Vector3(
      this.x - other.x,
      this.y - other.y,
      this.z - other.z
    );
  }

  dot(other) {
    return (
      this.x * other.x +
      this.y * other.y +
      this.z * other.z
    );
  }

  normalized() {
    const mag = Math.sqrt(this.dot(this));
    return new Vector3(
      this.x / mag,
      this.y / mag,
      this.z / mag
    );
  }

  static lerp(start, end, t) {
    return start.scale(1 - t).plus(end.scale(t));
  }
}

class Ray {
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }

  at(t) {
    return this.origin.plus(this.direction.scale(t));
  }
}
