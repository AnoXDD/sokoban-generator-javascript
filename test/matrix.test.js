import {
  BOX,
  BOX_GOAL,
  FLOOR,
  GOAL,
  PLAYER,
  PLAYER_GOAL,
  WALL
} from "../src/tiles";
import {DOWN, LEFT, RIGHT, UP} from "../src/direction";
import Matrix from "../src/matrix";

describe("move", () => {
  let matrix = null;
  const wall = [0, 0];
  const floor = [1, 1];
  const box = [2, 2];
  const box_goal = [4, 4];
  const player = [3, 3];
  const player_goal = [5, 3];

  describe("Move non-movable", () => {
    let matrix = null;

    beforeEach(() => {
      matrix = new Matrix(10, 10, 3);
      matrix.setAsArray([
        `##########`.split(""),
        `#       ##`.split(""),
        `# $ $ $  #`.split(""),
        `#  @ +   #`.split(""),
        `#   *    #`.split(""),
        `#  . .   #`.split(""),
        `#        #`.split(""),
        `#        #`.split(""),
        `#        #`.split(""),
        `##########`.split("")
      ]);
    });

    test("Move floor", () => {
      expect(matrix.move(1, 1, RIGHT)).toBeFalsy();
      expect(matrix.get(1, 1)).toBe(FLOOR);
    });
    test("Move goal", () => {
      expect(matrix.move(5, 5, DOWN)).toBeFalsy();
      expect(matrix.get(5, 5)).toBe(GOAL);
    });
    test("Move wall", () => {
      expect(matrix.move(8, 1, LEFT)).toBeFalsy();
      expect(matrix.get(8, 1)).toBe(WALL);
    });
  });

  describe("Move box", () => {
    let matrix = null;
    let pos = [3, 2];
    let pos2 = [7, 0];

    beforeEach(() => {
      matrix = new Matrix(10, 10, 3);
      matrix.setAsArray([
        `#######$##`.split(""),
        `#  *    ##`.split(""),
        `# $$.    #`.split(""),
        `#  @     #`.split(""),
        `#   *    #`.split(""),
        `#  . .   #`.split(""),
        `#        #`.split(""),
        `#        #`.split(""),
        `#        #`.split(""),
        `##########`.split("")
      ]);
    });

    test("Move to another box", () => {
      expect(matrix.move(...pos, LEFT)).toBeFalsy();
      expect(matrix.get(...pos)).toBe(BOX);
    });
    test("Move to another box on goal", () => {
      expect(matrix.move(...pos, UP)).toBeFalsy();
      expect(matrix.get(...pos)).toBe(BOX);
    });
    test("Move to another goal", () => {
      expect(matrix.move(...pos, RIGHT)).toBeTruthy();
      expect(matrix.get(...pos)).toBe(FLOOR);
      expect(matrix.get(pos[0] + 1, pos[1])).toBe(BOX_GOAL);
    });
    test("Move to another player", () => {
      expect(matrix.move(...pos, DOWN)).toBeFalsy();
      expect(matrix.get(...pos)).toBe(BOX);
    });
    test("Move to the edge", () => {
      expect(matrix.move(...pos2, UP)).toBeFalsy();
      expect(matrix.get(...pos2)).toBe(BOX);
    });
    test("Move to the wall", () => {
      expect(matrix.move(...pos2, RIGHT)).toBeFalsy();
      expect(matrix.get(...pos2)).toBe(BOX);
    });
    test("Move to another floor", () => {
      expect(matrix.move(...pos2, DOWN)).toBeTruthy();
      expect(matrix.get(...pos2)).toBe(FLOOR);
      expect(matrix.get(pos2[0], pos2[1] + 1)).toBe(BOX);
    });
  });

  describe("Move box on goal", () => {
    let matrix = null;
    let pos = [3, 2];
    let pos2 = [7, 0];

    beforeEach(() => {
      matrix = new Matrix(10, 10, 3);
      matrix.setAsArray([
        `#######*##`.split(""),
        `#  *    ##`.split(""),
        `# $*.    #`.split(""),
        `#  @     #`.split(""),
        `#   *    #`.split(""),
        `#  . .   #`.split(""),
        `#        #`.split(""),
        `#        #`.split(""),
        `#        #`.split(""),
        `##########`.split("")
      ]);
    });

    test("Move to another box", () => {
      expect(matrix.move(...pos, LEFT)).toBeFalsy();
      expect(matrix.get(...pos)).toBe(BOX_GOAL);
    });
    test("Move to another box on goal", () => {
      expect(matrix.move(...pos, UP)).toBeFalsy();
      expect(matrix.get(...pos)).toBe(BOX_GOAL);
    });
    test("Move to another goal", () => {
      expect(matrix.move(...pos, RIGHT)).toBeTruthy();
      expect(matrix.get(...pos)).toBe(GOAL);
      expect(matrix.get(pos[0] + 1, pos[1])).toBe(BOX_GOAL);
    });
    test("Move to another player", () => {
      expect(matrix.move(...pos, DOWN)).toBeFalsy();
      expect(matrix.get(...pos)).toBe(BOX_GOAL);
    });
    test("Move to the edge", () => {
      expect(matrix.move(...pos2, UP)).toBeFalsy();
      expect(matrix.get(...pos2)).toBe(BOX_GOAL);
    });
    test("Move to the wall", () => {
      expect(matrix.move(...pos2, RIGHT)).toBeFalsy();
      expect(matrix.get(...pos2)).toBe(BOX_GOAL);
    });
    test("Move to another floor", () => {
      expect(matrix.move(...pos2, DOWN)).toBeTruthy();
      expect(matrix.get(...pos2)).toBe(GOAL);
      expect(matrix.get(pos2[0], pos2[1] + 1)).toBe(BOX);
    });
  });

  describe("Move player", () => {
    let matrix = null;
    let pos = [3, 2];
    let pos2 = [7, 0];

    beforeEach(() => {
      matrix = new Matrix(10, 10, 3);
      matrix.setAsArray([
        `#######@##`.split(""),
        `#  *    ##`.split(""),
        `# $@.    #`.split(""),
        `#        #`.split(""),
        `#   *    #`.split(""),
        `#  . .   #`.split(""),
        `#        #`.split(""),
        `#        #`.split(""),
        `#        #`.split(""),
        `##########`.split("")
      ]);
    });

    test("Move to another box", () => {
      expect(matrix.move(...pos, LEFT)).toBeFalsy();
      expect(matrix.get(...pos)).toBe(PLAYER);
    });
    test("Move to another box on goal", () => {
      expect(matrix.move(...pos, UP)).toBeFalsy();
      expect(matrix.get(...pos)).toBe(PLAYER);
    });
    test("Move to another goal", () => {
      expect(matrix.move(...pos, RIGHT)).toBeTruthy();
      expect(matrix.get(...pos)).toBe(FLOOR);
      expect(matrix.get(pos[0] + 1, pos[1])).toBe(PLAYER_GOAL);
    });
    test("Move to the edge", () => {
      expect(matrix.move(...pos2, UP)).toBeFalsy();
      expect(matrix.get(...pos2)).toBe(PLAYER);
    });
    test("Move to the wall", () => {
      expect(matrix.move(...pos2, RIGHT)).toBeFalsy();
      expect(matrix.get(...pos2)).toBe(PLAYER);
    });
    test("Move to another floor", () => {
      expect(matrix.move(...pos2, DOWN)).toBeTruthy();
      expect(matrix.get(...pos2)).toBe(FLOOR);
      expect(matrix.get(pos2[0], pos2[1] + 1)).toBe(PLAYER);
    });
  });

  describe("Move player on goal", () => {
    let matrix = null;
    let pos = [3, 2];
    let pos2 = [7, 0];

    beforeEach(() => {
      matrix = new Matrix(10, 10, 3);
      matrix.setAsArray([
        `#######+##`.split(""),
        `#  *    ##`.split(""),
        `# $+.    #`.split(""),
        `#        #`.split(""),
        `#   *    #`.split(""),
        `#  . .   #`.split(""),
        `#        #`.split(""),
        `#        #`.split(""),
        `#        #`.split(""),
        `##########`.split("")
      ]);
    });

    test("Move to another box", () => {
      expect(matrix.move(...pos, LEFT)).toBeFalsy();
      expect(matrix.get(...pos)).toBe(PLAYER_GOAL);
    });
    test("Move to another box on goal", () => {
      expect(matrix.move(...pos, UP)).toBeFalsy();
      expect(matrix.get(...pos)).toBe(PLAYER_GOAL);
    });
    test("Move to another goal", () => {
      expect(matrix.move(...pos, RIGHT)).toBeTruthy();
      expect(matrix.get(...pos)).toBe(GOAL);
      expect(matrix.get(pos[0] + 1, pos[1])).toBe(PLAYER_GOAL);
    });
    test("Move to the edge", () => {
      expect(matrix.move(...pos2, UP)).toBeFalsy();
      expect(matrix.get(...pos2)).toBe(PLAYER_GOAL);
    });
    test("Move to the wall", () => {
      expect(matrix.move(...pos2, RIGHT)).toBeFalsy();
      expect(matrix.get(...pos2)).toBe(PLAYER_GOAL);
    });
    test("Move to another floor", () => {
      expect(matrix.move(...pos2, DOWN)).toBeTruthy();
      expect(matrix.get(...pos2)).toBe(GOAL);
      expect(matrix.get(pos2[0], pos2[1] + 1)).toBe(PLAYER);
    });
  });
});

describe("isWall", () => {
  test("Solid wall", () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    // Out of bounds
    expect(matrix.isWall(-1, -2)).toBeTruthy();
    expect(matrix.isWall(2, 12)).toBeTruthy();
    expect(matrix.isWall(-2, 2)).toBeTruthy();
    expect(matrix.isWall(2, -2)).toBeTruthy();

    // In bounds
    expect(matrix.isWall(0, 0)).toBeTruthy();
    expect(matrix.isWall(0, 2)).toBeTruthy();
    expect(matrix.isWall(0, 9)).toBeTruthy();
    expect(matrix.isWall(1, 0)).toBeTruthy();
    expect(matrix.isWall(2, 9)).toBeTruthy();
    expect(matrix.isWall(9, 0)).toBeTruthy();
    expect(matrix.isWall(9, 9)).toBeTruthy();
  });

  test("Solid floor", () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split("")
    ]);

    // Out of bounds
    expect(matrix.isWall(-1, -2)).toBeTruthy();
    expect(matrix.isWall(2, 12)).toBeTruthy();
    expect(matrix.isWall(-2, 2)).toBeTruthy();
    expect(matrix.isWall(2, -2)).toBeTruthy();

    // In bounds
    expect(matrix.isWall(0, 0)).toBeFalsy();
    expect(matrix.isWall(0, 2)).toBeFalsy();
    expect(matrix.isWall(0, 9)).toBeFalsy();
    expect(matrix.isWall(1, 0)).toBeFalsy();
    expect(matrix.isWall(2, 9)).toBeFalsy();
    expect(matrix.isWall(9, 0)).toBeFalsy();
    expect(matrix.isWall(9, 9)).toBeFalsy();
  });
});

describe("isAllConnected", () => {
  test(`Completely no place to go`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.isAllConnected()).toBeFalsy();
  });

  test(`Completely empty`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split("")
    ]);

    expect(matrix.isAllConnected()).toBeTruthy();
  });

  test(`One empty spot`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `#### #####`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.isAllConnected()).toBeTruthy();
  });

  test(`Two empty spots`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `#### #####`.split(""),
      `##########`.split(""),
      `###### ###`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.isAllConnected()).toBeFalsy();
  });

  test(`Zig-zag`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `#   #   ##`.split(""),
      `# # # # ##`.split(""),
      `# # # # ##`.split(""),
      `# # # # ##`.split(""),
      `# # # # ##`.split(""),
      `# # # # ##`.split(""),
      `# # # # ##`.split(""),
      `# #   # ##`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.isAllConnected()).toBeTruthy();
  });

  test(`Almost adjacent empty spots`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `#### #####`.split(""),
      `#####   ##`.split(""),
      `#####   ##`.split(""),
      `#####   ##`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.isAllConnected()).toBeFalsy();
  });
});

describe("hasLargeEmptySpace", () => {
  test(`Solid wall`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeFalsy();
  });

  test(`Solid floor`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeTruthy();
  });

  test(`One dot`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `#### #####`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeFalsy();
  });

  test(`One line`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `####   ###`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeFalsy();
  });

  test(`Two lines`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `####   ###`.split(""),
      `####   ###`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeFalsy();
  });

  test(`3x3`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `####   ###`.split(""),
      `####   ###`.split(""),
      `####   ###`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeFalsy();
  });

  test(`3x3 with a dot`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `###   ####`.split(""),
      `###    ###`.split(""),
      `###   ####`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeFalsy();
  });

  test(`Zigzag 3x4`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `###    ###`.split(""),
      `##    ####`.split(""),
      `###    ###`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeFalsy();
  });

  test(`Zigzag 4x3`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `### ######`.split(""),
      `###  #####`.split(""),
      `###   ####`.split(""),
      `###   ####`.split(""),
      `####  ####`.split(""),
      `##### ####`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeFalsy();
  });

  test(`Space with a wall`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `###    ###`.split(""),
      `### #  ###`.split(""),
      `###    ###`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeFalsy();
  });

  test(`Larger space with a wall`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `###   ####`.split(""),
      `###   ####`.split(""),
      `#       ##`.split(""),
      `#   #   ##`.split(""),
      `#       ##`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeFalsy();
  });

  test(`Corner 3x3`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `#######   `.split(""),
      `#######   `.split(""),
      `#######   `.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeFalsy();
  });

  test(`Corner 4x3`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `   #######`.split(""),
      `   #######`.split(""),
      `   #######`.split(""),
      `   #######`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeTruthy();
  });

  test(`Corner 3x4`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `    ######`.split(""),
      `    ######`.split(""),
      `    ######`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeTruthy();
  });

  test(`4x3`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `###   ####`.split(""),
      `###   ####`.split(""),
      `###   ####`.split(""),
      `###   ####`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeTruthy();
  });

  test(`3x4`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `###    ###`.split(""),
      `###    ###`.split(""),
      `###    ###`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeTruthy();
  });

  test(`Overlapped`, () => {
    let matrix = new Matrix(10, 10);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `###   ####`.split(""),
      `###   ####`.split(""),
      `###      #`.split(""),
      `###      #`.split(""),
      `#####    #`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasLargeEmptySpace()).toBeTruthy();
  });
});

describe("hasDeadEnd", () => {
  test(`Solid wall`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeFalsy();
  });

  test(`Solid floor`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeFalsy();
  });

  test(`One dot`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `#### #####`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Square in the middle`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `####  ####`.split(""),
      `####  ####`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeFalsy();
  });

  test(`Square in the middle with a dot at bottom`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `####  ####`.split(""),
      `####  ####`.split(""),
      `#### #####`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Square in the middle with a dot at top`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##### ####`.split(""),
      `####  ####`.split(""),
      `####  ####`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Square in the middle with a dot at left`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `###   ####`.split(""),
      `####  ####`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Square in the middle with a dot at right`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `####  ####`.split(""),
      `####   ###`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Vertical line`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `#### #####`.split(""),
      `#### #####`.split(""),
      `#### #####`.split(""),
      `#### #####`.split(""),
      `#### #####`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Horizontal line`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##     ###`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Cross`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `###  #####`.split(""),
      `###  #####`.split(""),
      `#       ##`.split(""),
      `#       ##`.split(""),
      `###  #####`.split(""),
      `###  #####`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeFalsy();
  });

  test(`Cross with a dot`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `###  #####`.split(""),
      `###  # ###`.split(""),
      `#       ##`.split(""),
      `#       ##`.split(""),
      `###  #####`.split(""),
      `###  #####`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Dead end at corner (top right)`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `######### `.split(""),
      `#######   `.split(""),
      `#######   `.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Dead end at corner (top left)`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      ` #########`.split(""),
      `    ######`.split(""),
      `    ######`.split(""),
      `    ######`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Dead end at corner (bottom left)`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `    ######`.split(""),
      `    ######`.split(""),
      ` #########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Dead end at corner (bottom right)`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `######  ##`.split(""),
      `######  ##`.split(""),
      `######  ##`.split(""),
      `######    `.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Dead end on left edge`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `#    #####`.split(""),
      `#    #####`.split(""),
      `     #####`.split(""),
      `#    #####`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Dead end on top edge`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `#### #####`.split(""),
      `##    ####`.split(""),
      `##    ####`.split(""),
      `##    ####`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Dead end on right edge`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `#####     `.split(""),
      `#####    #`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });

  test(`Dead end on bottom edge`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `###    ###`.split(""),
      `###    ###`.split(""),
      `###    ###`.split(""),
      `##### ####`.split(""),
      `##### ####`.split("")
    ]);

    expect(matrix.hasDeadEnd()).toBeTruthy();
  });
});

describe("resetBoxesToGoals", () => {
  test(`Already there`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `#*  ######`.split(""),
      `# * ######`.split(""),
      `#  *######`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.resetBoxesToGoals())
      .toEqual([{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}]);
  });

  test(`Partially there`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `#*  ######`.split(""),
      `# . ######`.split(""),
      `#$ *######`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.resetBoxesToGoals())
      .toEqual([{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}]);
  });

  test(`None there`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `#.  ######`.split(""),
      `#$.$######`.split(""),
      `#$ .######`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.resetBoxesToGoals())
      .toEqual([{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}]);
  });
});

describe("isAccessible", () => {
  test(`On wall`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.isAccessible(0, 0, 9, 9)).toBeFalsy();
  });

  test(`Out of bounds`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.isAccessible(0, -2, 9, 9)).toBeFalsy();
  });

  test(`On wall but same position`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.isAccessible(0, 0, 0, 0)).toBeFalsy();
  });

  test(`On floor with same position`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split("")
    ]);

    expect(matrix.isAccessible(0, 0, 0, 0)).toBeTruthy();
  });

  test(`Solid floor`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split("")
    ]);

    expect(matrix.isAccessible(0, 0, 9, 9)).toBeTruthy();
  });

  test(`Direct top`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `          `.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.isAccessible(0, 0, 9, 0)).toBeTruthy();
  });

  test(`Direct left`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      ` #########`.split(""),
      ` #########`.split(""),
      ` #########`.split(""),
      ` #########`.split(""),
      ` #########`.split(""),
      ` #########`.split(""),
      ` #########`.split(""),
      ` #########`.split(""),
      ` #########`.split(""),
      ` #########`.split("")
    ]);

    expect(matrix.isAccessible(0, 0, 0, 9)).toBeTruthy();
  });

  test(`Direct bottom`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `          `.split("")
    ]);

    expect(matrix.isAccessible(0, 9, 9, 9)).toBeTruthy();
  });

  test(`Direct right`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `######### `.split(""),
      `######### `.split(""),
      `######### `.split(""),
      `######### `.split(""),
      `######### `.split(""),
      `######### `.split(""),
      `######### `.split(""),
      `######### `.split(""),
      `######### `.split(""),
      `######### `.split("")
    ]);

    expect(matrix.isAccessible(9, 0, 9, 9)).toBeTruthy();
  });

  test(`Blocked`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `    ##    `.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.isAccessible(0, 0, 9, 0)).toBeFalsy();
  });

  test(`Zig-zag`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `          `.split(""),
      `######### `.split(""),
      `          `.split(""),
      ` #########`.split(""),
      `          `.split(""),
      `######### `.split(""),
      `          `.split(""),
      ` #########`.split(""),
      `          `.split(""),
      `######### `.split("")
    ]);

    expect(matrix.isAccessible(0, 0, 9, 9)).toBeTruthy();
  });

  test(`Bounded wall`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `#       ##`.split(""),
      `#       ##`.split(""),
      `#       ##`.split(""),
      `#       ##`.split(""),
      `#       ##`.split(""),
      `#       ##`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.isAccessible(3, 3, 5, 5)).toBeTruthy();
  });
});

describe("findAvailablePlayerPositions", () => {
  test(`Solid wall`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.findAvailablePlayerPositions().length).toBe(0);
  });

  test(`Solid floor`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split(""),
      `          `.split("")
    ]);

    expect(matrix.findAvailablePlayerPositions().length).toBe(1);
  });

  test(`Bounded floor`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##      ##`.split(""),
      `##      ##`.split(""),
      `##      ##`.split(""),
      `##      ##`.split(""),
      `##      ##`.split(""),
      `##      ##`.split(""),
      `##########`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.findAvailablePlayerPositions().length).toBe(1);
  });

  test(`Zigzag`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `#  #   ###`.split(""),
      `#  # # ###`.split(""),
      `#  # # # #`.split(""),
      `#  # # # #`.split(""),
      `#  # #   #`.split(""),
      `#    ## ##`.split(""),
      `#    ## ##`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.findAvailablePlayerPositions().length).toBe(1);
  });

  test(`Two rooms`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `#    #####`.split(""),
      `#    #####`.split(""),
      `#    #####`.split(""),
      `##########`.split(""),
      `####    ##`.split(""),
      `####    ##`.split(""),
      `##########`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.findAvailablePlayerPositions().length).toBe(2);
  });

  test(`Multiple rooms separated by boxes`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `##########`.split(""),
      `##  #     `.split(""),
      `##  $     `.split(""),
      `###$#     `.split(""),
      `##  ##$###`.split(""),
      `##  ##  ##`.split(""),
      `##  #$  ##`.split(""),
      `######  ##`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.findAvailablePlayerPositions().length).toBe(4);
  });

  test(`Dots`, () => {
    let matrix = new Matrix(10, 10, 3);
    matrix.setAsArray([
      `##########`.split(""),
      `### ######`.split(""),
      `##########`.split(""),
      `##### ####`.split(""),
      `##########`.split(""),
      `#### #####`.split(""),
      `####### ##`.split(""),
      ` #########`.split(""),
      `### ######`.split(""),
      `##########`.split("")
    ]);

    expect(matrix.findAvailablePlayerPositions().length).toBe(6);
  });
});
