export const Utils = {
  distance: function (pointA, pointB) {
    return Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y)
  },
  normV2: function (vector2like) {
    let magnitude = this.distance({ x: 0, y: 0 }, vector2like)
    if (magnitude === 0) {
      return vector2like
    }
    vector2like.x /= magnitude;
    vector2like.y /= magnitude;
    return vector2like
  },
  limitV2: function (vector2like, length) {
    (length || (length = 1))
    let magnitude = this.distance({ x: 0, y: 0 }, vector2like)
    if (magnitude > length) {
      vector2like = this.normV2(vector2like)
      vector2like.x *= length;
      vector2like.y *= length;
      return vector2like
    }
    return vector2like
  },

  //Thank you jacklmoore - https://www.jacklmoore.com/notes/rounding-in-javascript/
  round: function (value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  }
}
