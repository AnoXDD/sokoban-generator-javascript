export function emptyMatrix(width, height, initValue) {
  return new Array(height).fill()
    .map(a => new Array(width).fill(initValue));
}