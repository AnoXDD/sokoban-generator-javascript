export const WALL = "#";
export const PLAYER = "@";
export const PLAYER_GOAL = "+";
export const BOX = "$";
export const BOX_GOAL = "*";
export const GOAL = ".";
export const FLOOR = " ";

const BOX_NO = 1;
const PLAYER_NO = 2;
const GOAL_NO = 4;
const MAP_TO_NUM = {
  [FLOOR]      : 0,
  [PLAYER]     : PLAYER_NO,
  [PLAYER_GOAL]: PLAYER_NO | GOAL_NO,
  [BOX]        : BOX_NO,
  [BOX_GOAL]   : BOX_NO | GOAL_NO,
  [GOAL]       : GOAL_NO,
};
const MAP_FROM_NUM = Object.keys(MAP_TO_NUM)
  .reduce((obj, key) => (obj[MAP_TO_NUM[key]] = key, obj), {});

export function isTransparentTile(tile) {
  return tile !== WALL;
}

export function isMovableTile(tile) {
  return !(tile === FLOOR || tile === WALL || tile === GOAL);

}

export function isWalkableTile(tile) {
  return tile === FLOOR || tile === GOAL;
}

export function extractMovableTile(tile) {
  let num = MAP_TO_NUM[tile];

  if (!num) {
    return null;
  }

  let res = MAP_FROM_NUM[(num & PLAYER_NO) || (num & BOX_NO)];
  return res === FLOOR ? null : res;
}

export function removeMovableTile(tile) {
  let num = MAP_TO_NUM[tile];

  if (!num) {
    return tile;
  }

  return (num & GOAL_NO) ? GOAL : FLOOR;
}

export function addMovableTile(tile, movable) {
  let tileNum = MAP_TO_NUM[tile];
  let movableNum = MAP_TO_NUM[movable];

  if (tileNum === undefined || movableNum === undefined) {
    return tile;
  }

  return MAP_FROM_NUM[tileNum | movableNum];
}