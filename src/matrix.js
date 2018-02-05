import {
  addMovableTile,
  BOX,
  BOX_GOAL,
  extractMovableTile,
  FLOOR,
  GOAL,
  isMovableTile,
  isWalkableTile,
  removeMovableTile,
  WALL
} from "./tiles";
import {moveToDirection} from "./direction";
import {emptyMatrix} from "./util";

export default class Matrix {
  _data = [];
  _width = 0;
  _height = 0;

  constructor(width, height, initValue) {
    this._width = width;
    this._height = height;
    this._data = this._emptyMatrix(height, width, initValue);
  }

  get(x, y) {
    return this._data[y][x];
  }

  set(x, y, tile) {
    this._data[y][x] = tile;
  }

  setAsArray(arr) {
    this._data = arr.map(a => a.slice());
  }

  /**
   * Moves a tile to a certain direction. The movable tile is either player or
   * box. This function does not cause ripple effect (i.e. moving a player to a
   * box does not push it further, and it's also a invalid move)
   * @param x
   * @param y
   * @param direction
   * @return boolean if the move is legit and successful
   */
  move(x, y, direction) {
    if (!this.isMovable(x, y)) {
      return false;
    }

    let coord = moveToDirection(x, y, direction);
    let x2 = coord.x;
    let y2 = coord.y;

    if (!this.isInRange(x2, y2) || !this.isWalkable(x2, y2)) {
      return false;
    }

    let src = this.get(x, y,);
    let dest = this.get(x2, y2);
    let tile = extractMovableTile(src);

    this.set(x, y, removeMovableTile(src));
    this.set(x2, y2, addMovableTile(dest, tile));

    return true;
  }

  clone() {
    let newMatrix = new Matrix(this._width, this._height);
    newMatrix._data = this._data.map(a => a.slice());

    return newMatrix;
  }

  /**
   * Returns if current grid can be is all connected
   */
  isAllConnected() {
    // Find first floor
    let x = 0;
    let y = 0;
    for (; y < this._height; ++y) {
      x = this._data[y].indexOf(FLOOR);

      if (x !== -1) {
        break;
      }
    }

    if (x === -1) {
      return false;
    }

    let c = this.clone();
    c._propagateFloorWith(x, y);

    return !c._data.some(row => row.includes(FLOOR));
  }

  /**
   * Returns whether the grid has empty area larger than 4x3 or 3x4
   */
  hasLargeEmptySpace() {
    let map = {};
    let qualify3x3 = {};

    // Find all indices with three space
    let index = 0;
    for (let x = 0; x < this._height; ++x, index += 2) {
      let last = false;
      let last2 = false;

      for (let y = 0; y < this._width - 2; ++y, ++index) {
        let curr = this._data[y][x] === FLOOR;

        if (curr && last && last2) {
          // Check up 3x3
          if (map[index - this._width] && map[index - this._width - this._width]) {
            // Check 4x3 or 3x4
            if (qualify3x3[index - this._width] || qualify3x3[index - 1]) {
              return true;
            }
            qualify3x3[index] = true;
          }

          map[index] = true;
        }

        last2 = last;
        last = curr;
      }
    }

    return false;
  }

  count(t) {
    let i = 0;
    for (let row of this._data) {
      for (let tile of row) {
        if (tile === t) {
          ++i;
        }
      }
    }

    return i;
  }

  hasDeadEnd() {
    for (let x = 0; x < this._width; ++x) {
      for (let y = 0; y < this._height; ++y) {
        if (this.isWall(x, y)) {
          continue;
        }

        // this._data[i] !== WALL
        let notWall = (!this.isWall(x, y - 1) ? 1 : 0);

        notWall += (!this.isWall(x - 1, y) ? 1 : 0);
        if (notWall > 1) {
          continue;
        }

        notWall += (!this.isWall(x + 1, y) ? 1 : 0);
        if (notWall > 1) {
          continue;
        } else if (notWall === 0) {
          return true;
        }

        notWall += (!this.isWall(x, y + 1) ? 1 : 0);
        if (notWall <= 1) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Puts boxes back to their goals and returns the final positions of the
   * boxes (or goals)
   */
  resetBoxesToGoals() {
    let goals = [];

    for (let y = 0; y < this._height; ++y) {
      for (let x = 0; x < this._width; ++x) {
        let tile = this.get(x, y);
        if (tile === BOX) {
          this.set(x, y, FLOOR);
        } else if (tile === GOAL) {
          goals.push({x, y});
          this.set(x, y, BOX_GOAL);
        } else if (tile === BOX_GOAL) {
          goals.push({x, y});
        }
      }
    }

    return goals;
  }

  /**
   * Finds all available player starting positions
   * @return {[{x: number, y: number}]} A list of player positions. Each
   *   position is mutually non-accessible by other positions in the list.
   */
  findAvailablePlayerPositions() {
    let c = this.clone();
    let pos = [];

    for (let x = 0; x < this._width; ++x) {
      for (let y = 0; y < this._height; ++y) {
        if (c.get(x, y) === FLOOR) {
          pos.push({x, y});
          c._propagateFloorWith(x, y, WALL);
        }
      }
    }

    return pos;
  }

  is(x, y, tile, isEdgeConsideredTile = false) {
    if (!this.isInRange(x, y)) {
      return isEdgeConsideredTile;
    }

    return this.get(x, y) === tile;
  }

  /**
   * Returns if a given tile is a wall
   * @param x
   * @param y
   * @return {boolean}
   */
  isWall(x, y) {
    return this.is(x, y, WALL, true);
  }

  isInRange(x, y) {
    return x >= 0 && x < this._width && y >= 0 && y < this._height;
  }

  /**
   * Returns if (x1, y1) is accessible from (x2, y2)
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   * @param {array} [array] - if provided, this function will process this map
   *   instead of this._data. Should be of the same dimension as that of
   *   this._data
   * @return boolean
   */
  isAccessible(x1, y1, x2, y2) {
    if (!this.isInRange(x1, y1) || !this.isInRange(x2, y2) ||
      !this.isWalkable(x1, y1) || !this.isWalkable(x2, y2)) {
      return false;
    }

    let w = this._width;
    let h = this._height;
    let is = this.isWalkable.bind(this);

    // For this helper, we make sure (x,y) and (destX,destY) is always in
    // range, and we only change the value of x and y
    return (function helper(x, y, visited) {
      if (visited[y][x]) {
        return false;
      }
      visited[y][x] = true;

      if (x === x2 && y === y2) {
        return true;
      }

      if (x > 0 && is(x - 1, y) && helper(x - 1, y, visited)) {
        return true;
      }
      if (x < w - 1 && is(x + 1, y) && helper(x + 1, y, visited)) {
        return true;
      }
      if (y > 0 && is(x, y - 1) && helper(x, y - 1, visited)) {
        return true;
      }
      if (y < h - 1 && is(x, y + 1) && helper(x, y + 1, visited)) {
        return true;
      }

      return false;
    })(x1, y1, this._emptyMatrix());
  }

  /**
   * ASSUMING (x,y) IS VALID. Returns if (x,y) is walkable.
   * @param x
   * @param y
   * @param {Array} [array] - optional array to process instead of this._data
   */
  isWalkable(x, y, array) {
    return isWalkableTile(this.get(x, y, array));
  }

  /**
   * Returns if the tile at (x,y) is movable
   * @param x
   * @param y
   * @param [array] - if specified, will be processed instead of this._data
   */
  isMovable(x, y, array) {
    if (!this.isInRange(x, y)) {
      return false;
    }

    let tile = this.get(x, y, array);
    return isMovableTile(tile);
  }

  /**
   * Removes any goals tiles. This method assumes that only goal tile is GOAL
   * (thus excluding player or boxes already on goal)
   */
  clearGoals() {
    for (let row of this._data) {
      for (let i = 0; i < this._width; ++i) {
        if (row[i] === GOAL) {
          row[i] = FLOOR;
        }
      }
    }
  }

  /**
   * Uses DFS to spread wall at a given location
   * @param x
   * @param y
   * @param tile
   * @private
   */
  _propagateFloorWith(x, y, tile = WALL) {
    if (!this.is(x, y, FLOOR)) {
      return;
    }

    this.set(x, y, tile);

    this._propagateFloorWith(x - 1, y, tile);
    this._propagateFloorWith(x + 1, y, tile);
    this._propagateFloorWith(x, y - 1, tile);
    this._propagateFloorWith(x, y + 1, tile);
  }

  _emptyMatrix(width, height, initValue) {
    return emptyMatrix(this._width, this._height, initValue);
  }

  toString() {
    return this._data.map(a => a.join("")).join("");
  }

  toReadableString() {
    return this._data.map(a => a.join("")).join("\n");
  }
}