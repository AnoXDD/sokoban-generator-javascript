import {FLOOR, GOAL, PLAYER, WALL} from "./tiles";
import seedrandom from "seedrandom";
import {DIRECTIONS, moveToDirection, oppositeDirection} from "./direction";
import Matrix from "./matrix";
import {emptyMatrix} from "./util";
import {TEMPLATE_SIZE, Templates} from "./template";

export default class Grid {
  constructor(width = 0,
              height = 0,
              box = 3,
              seed = 0,
              minWall = 0,
              playerPos) {
    this._width = width;
    this._height = height;
    this._box = box;
    this._data = new Matrix(this._width, this._height, FLOOR);
    this._rand = seedrandom(seed);
    this._seed = seed;
    this._minWall = minWall;
    this._playerFixedPos = playerPos;
  }

  get(x, y) {
    return this._data.get(x, y);
  }

  set(x, y, tile) {
    this._data.set(x, y, tile)
  }

  setMatrixAsArray(array) {
    this._data.setAsArray(array);
  }

  /**
   * Wrapper to move a tile
   * @param x
   * @param y
   * @param direction
   * @return boolean if the move is legit and successful
   */
  move(x, y, direction) {
    return this._data.move(x, y, direction);
  }

  isInRange(x, y) {
    return this._data.isInRange(x, y);
  }

  clone() {
    let newGrid = new Grid(this._width,
      this._height,
      this._box,
      this._seed,
      this._minWall,
      this._playerFixedPos);
    newGrid._data = this._data.clone();

    return newGrid;
  }

  /**
   * Resets the grid and apply template.
   * @return boolean - true if one is generated successfully
   */
  applyTemplates() {
    let wallCount = 0;

    for (let x = 0; x < this._width; x += TEMPLATE_SIZE) {
      for (let y = 0; y < this._height; y += TEMPLATE_SIZE) {
        wallCount += this._applyTemplate(x, y);
      }
    }

    if (this._playerFixedPos) {
      if (this._data.isWall(this._playerFixedPos.x, this._playerFixedPos.y)) {
        return false;
      }
    }

    return wallCount >= this._minWall;
  }

  /**
   * Applies a single template at (x,y)
   * @param x
   * @param y
   * @return {Number} the number of walls, or -1 if not created successfully
   * @private
   *
   */
  _applyTemplate(x, y) {
    // Choose a random template
    let temp = Templates[Math.floor(this._rand() * Templates.length)];
    let i = 0;
    let t = 0;

    for (let dx = 0; dx < TEMPLATE_SIZE && x + dx < this._width; ++dx) {
      for (let dy = 0; dy < TEMPLATE_SIZE && y + dy < this._height; ++dy, ++i) {
        if (temp[i] === WALL) {
          ++t;
        }

        this.set(x + dx, y + dy, temp[i]);
      }
    }

    return t;
  }

  /**
   * Applies a string grid to this class
   * @param {String} str
   */
  applyStringGrid(str) {
    let i = 0;

    for (let y = 0; y < this._height; ++y) {
      for (let x = 0; x < this._width; ++x) {
        this.set(x, y, str[i++]);
      }
    }
  }

  /**
   * Checks several things to make sure current grid is a good one for sokoban
   */
  isGoodCandidate() {
    return this._data.isAllConnected()
      && !this._data.hasLargeEmptySpace()
      && this.hasEnoughRoom()
      && !this._data.hasDeadEnd();
  }


  hasEnoughRoom() {
    return this._data.count(FLOOR) >= this._box + 2; // one for player, the
                                                     // other for moving
  }

  /**
   * Wipes out any goals placed (if any) and randomly deploy goals on the
   * floor
   */
  redeployGoals() {
    this._data.clearGoals();

    // Find all floors
    let floors = [];
    for (let x = 0; x < this._width; ++x) {
      for (let y = 0; y < this._height; ++y) {
        if (this.get(x, y) === FLOOR) {
          floors.push({x, y});
        }
      }
    }

    if (floors.length <= this._box) {
      return false;
    }

    // Randomly choose by shuffling
    let i = floors.length;
    while (--i) {
      let j = Math.floor(this._rand() * (i + 1));

      [floors[i], floors[j]] = [floors[j], floors[i]];
    }

    // Set the first several to be goals
    for (let i = 0; i < this._box; ++i) {
      let {x, y} = floors[i];
      this.set(x, y, GOAL);
    }

    return true;
  }

  /**
   * Wipes out boxes, put them back to their goals and find the farthest
   * position each box can be
   */
  generateFarthestBoxes() {
    let boxes = this._data.resetBoxesToGoals();

    // Backtrack maps
    let map = {};
    let playerPos = this._data.findAvailablePlayerPositions();

    // Generate all possible maps
    for (let pos of playerPos) {
      this._pullBoxes(boxes, pos, map);
    }

    // Iterate over map to find the farthest one
    let keys = Object.keys(map);
    let maxMap = "";
    let maxPos = null;
    let max = -1;

    for (let key of keys) {
      let matrix = map[key];

      for (let x = 0; x < this._width; ++x) {
        for (let y = 0; y < this._height; ++y) {
          if (!matrix[y][x] || matrix[y][x] <= max) {
            continue;
          }

          if (this._playerFixedPos) {
            // The player position is fixed, so we need to know if current
            // position is accessible by the player (to move the player
            // position later)
            if (!this._data.isAccessible(this._playerFixedPos.x,
                this._playerFixedPos.y,
                x,
                y)) {
              continue;
            }
          }

          maxMap = key;
          maxPos = {x, y};
          max = matrix[y][x];
        }
      }
    }

    if (maxPos === null) {
      return false;
    }

    this.applyStringGrid(maxMap);

    // Set player position
    if (this._playerFixedPos) {
      this.set(this._playerFixedPos.x, this._playerFixedPos.y, PLAYER);
    } else {
      this.set(maxPos.x, maxPos.y, PLAYER);
    }

    return true;
  }

//region private functions

  /**
   * Generates an empty matrix based on current width and height
   * @return {any[][]}
   * @private
   */
  _emptyMatrix(initValue) {
    return emptyMatrix(this._width, this._height, initValue);
  }

  /**
   * Returns actual x and y coordinate given an index in the string
   * @param index
   * @return {{x: number, y: number}}
   * @private
   */
  _toCoord(index) {
    let x = Math.floor(index / this._width);

    return {
      x,
      y: index - x * this._width,
    };
  }

  /**
   * To index
   * @param x
   * @param y
   * @return {Number}
   * @private
   */
  _toIndex(x, y) {
    return x * this._width + y;
  }

  /**
   * Pull all boxes to a random position (using bfs)
   * @param {Array} initBoxes - an array of positions in the form of {x:number,
   *   y:number}
   * @param {{x:number, y:number}} initPos - current position of player
   * @param {Object} map - a backtrack map to keep track of what kind of grids
   *   have been explored, with each key as a string, and value as a 2d array
   *   to keep track of the steps when the player is at that specific location
   * @private
   */
  _pullBoxes(initBoxes, initPos, map) {
    let size = 0;
    let stack = [{
      boxes : initBoxes.map(b => ({...b})),
      pos   : {...initPos},
      matrix: this._data.clone(),
      step  : 0,
    }];

    while (stack.length) {
      size = Math.max(stack.length, size);
      let top = stack.shift();
      let {boxes, pos, matrix, step} = top;

      if (this._pullBoxesCheckIfMapCached(map, top)) {
        continue;
      }

      for (let i = 0; i < boxes.length; ++i) {
        let box = boxes[i];

        // Go each direction
        for (let direction of DIRECTIONS) {
          let {x, y} = box;
          let newBoxPos = moveToDirection(x, y, direction);

          if (!matrix.isAccessible(pos.x,
              pos.y,
              newBoxPos.x,
              newBoxPos.y)) {
            continue;
          }

          let newPlayerPos = moveToDirection(newBoxPos.x,
            newBoxPos.y,
            direction);

          if (!matrix.isAccessible(pos.x,
              pos.y,
              newPlayerPos.x,
              newPlayerPos.y)) {
            continue;
          }

          let matrixCopy = matrix.clone();
          if (!matrixCopy.move(x, y, direction)) {
            continue;
          }

          // Set new box position
          let boxesCopy = boxes.map(a => ({...a}));
          boxesCopy[i] = newBoxPos;
          stack.push({
            boxes : boxesCopy,
            pos   : newPlayerPos,
            matrix: matrixCopy,
            step  : step + 1,
          });
        }
      }
    }
  }

  /**
   * A helper function for _pullBoxes to check if the map has cached value,
   * and modify the map accordingly
   * @param map
   * @param {{step:number, pos:object, matrix:Matrix}} obj - an object stored in
   *   the stack of _pullBoxes when doing bfs
   * @private
   */
  _pullBoxesCheckIfMapCached(map, obj) {
    let {step, pos, matrix} = obj;
    let {x, y} = pos;

    if (step === 0) {
      return false;
    }

    let str = matrix.toString();

    // Check if the value is already cached
    if (map[str]) {
      if (map[str][y][x]) {
        if (step < map[str][y][x]) {
          this._pullBoxesPropagateMapStepValue(matrix, map[str], x, y, step);
        }

        return true;
      }
    }

    if (!map[str]) {
      map[str] = this._emptyMatrix(0);
    }

    this._pullBoxesPropagateMapStepValue(matrix,
      map[str],
      x,
      y,
      step,
      true);

    return false;
  }

  /**
   * Use dfs to make sure connected cells has synced step value
   * @param {Matrix} matrix
   * @param {Array[][]} playerMatrix - a 2d matrix that caches the max step of
   *   player
   * @param x
   * @param y
   * @param step
   * @param {boolean} setValue - true if the propagation should set the value
   *   and reference the actual map. Otherwise it will just propagate depending
   *   on if the neighbor has a value
   * @private
   */
  _pullBoxesPropagateMapStepValue(matrix,
                                  playerMatrix,
                                  x,
                                  y,
                                  step,
                                  setValue = false) {
    // if (setValue ?
    //     (matrix[y][x] === step || !this._isWalkable(x, y)) : !matrix[y][x]) {
    if (playerMatrix[y][x] === step || !matrix.isWalkable(x, y)) {
      return;
    }

    playerMatrix[y][x] = step;

    if (x > 0) {
      this._pullBoxesPropagateMapStepValue(matrix, playerMatrix, x - 1,
        y,
        step,
        setValue);
    }

    if (x < this._width - 1) {
      this._pullBoxesPropagateMapStepValue(matrix, playerMatrix, x + 1,
        y,
        step,
        setValue);
    }

    if (y > 0) {
      this._pullBoxesPropagateMapStepValue(matrix, playerMatrix,
        x, y - 1,
        step,
        setValue);
    }

    if (y < this._height - 1) {
      this._pullBoxesPropagateMapStepValue(matrix, playerMatrix,
        x, y + 1,
        step,
        setValue);
    }
  }

  /**
   * Returns a copy of a 2d array current _data
   * @private
   */
  _copy2dArray(data = this._data) {
    return data.map(a => a.slice());
  }

//endregion

  toString() {
    return this._data.toString();
  }

  toReadableString() {
    return this._data.toReadableString();
  }
}
;
