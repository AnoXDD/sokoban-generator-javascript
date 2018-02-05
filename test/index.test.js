import Grid from "../src/grid";
import {PLAYER, PLAYER_GOAL} from "../src/tiles";
import {generateSokobanLevel} from "../index";
import seedrandom from "seedrandom";

test("Same seed yields same map", () => {
  let options = {
    seed           : 42,
    initialPosition: {x: 3, y: 3},

  };

  let g1 = generateSokobanLevel(options);
  let g2 = generateSokobanLevel(options);

  console.log(g1);

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