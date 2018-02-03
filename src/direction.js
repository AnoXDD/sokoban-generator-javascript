export const UP = 1;
export const DOWN = 2;
export const RIGHT = 3;
export const LEFT = 4;
export const DIRECTIONS = [UP, DOWN, LEFT, RIGHT];

export function oppositeDirection(direction) {
  switch (direction) {
    case UP:
      return DOWN;
    case DOWN:
      return UP;
    case LEFT:
      return RIGHT;
    case RIGHT:
      return LEFT;
    default:
  }

  return null;
}

export function moveToDirection(x, y, direction) {
  switch (direction) {
    case UP:
      --y;
      break;
    case DOWN:
      ++y;
      break;
    case LEFT:
      --x;
      break;
    case RIGHT:
      ++x;
      break;
    default:
  }

  return {x, y};
}
