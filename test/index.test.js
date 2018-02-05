import Grid from "../src/grid";
import {PLAYER, PLAYER_GOAL} from "../src/tiles";
import {generateSokobanLevel} from "../index";
import seedrandom from "seedrandom";

describe("Options", () => {
  test("Same seed yields same map", () => {
    let options = {
      seed           : 42,
      initialPosition: {x: 3, y: 3},
    };

    let g1 = generateSokobanLevel(options);
    let g2 = generateSokobanLevel(options);

    expect(g1).not.toBe(null);
    expect(g1).toBe(g2);
  });

  test("Fixes player position", () => {
    let x = 3;
    let y = 3;
    let options = {
      seed           : 42,
      initialPosition: {x, y},
      type           : "class",
    };

    let g1 = generateSokobanLevel(options);

    expect(g1.get(x, y)).toMatch(new RegExp(PLAYER + PLAYER_GOAL));
  });

  test("Sets minWall", () => {
    let options = {
      minWalls: 99,
      attempts: 1000,
    };

    expect(generateSokobanLevel(options)).toBeNull();
  });
});

describe("Sanity check", () => {
  test("1x1", () => {
    expect(generateSokobanLevel({width: 1, height: 1, boxes: 1, minWalls: 0}))
      .toBeNull();
  });

  test("1x2", () => {
    expect(generateSokobanLevel({width: 2, height: 1, boxes: 1, minWalls: 0}))
      .toBeNull();
  });

  test("1x2 too many boxes", () => {
    expect(generateSokobanLevel({width: 2, height: 1, boxes: 5, minWalls: 0}))
      .toBeNull();
  });

  test("1x3", () => {
    expect(generateSokobanLevel({width: 3, height: 2, boxes: 1, minWalls: 0}))
      .not
      .toBeNull();
  });

  test("2x2", () => {
    expect(generateSokobanLevel({width: 2, height: 2, boxes: 1, minWalls: 0}))
      .toBeNull();
  });

  test("2x2 too many boxes", () => {
    expect(generateSokobanLevel({width: 2, height: 2, boxes: 5, minWalls: 0}))
      .toBeNull();
  });
});