import Grid from "./src/grid";

export function generateSokobanLevel(parameters = {}) {
  let {
    width = 9,
    height = 9,
    boxes = 3,
    minWalls = 13,
    attempts = 5000,
    seed = Date.now(),
    initialPosition,
    type = "string",
  } = parameters;

  let grid = new Grid(width, height, boxes, seed, minWalls, initialPosition);

  while (--attempts > 0) {
    if (!grid.applyTemplates() || !grid.isGoodCandidate() || !grid.redeployGoals()) {
      continue;
    }

    grid.generateFarthestBoxes();

    if (type === "string") {
      return grid.toReadableString();
    }

    if (type === "class") {
      return grid;
    }

    console.warn(`sokoban-generator/generateSokobanLevel: Unrecognized value for key "string": ${type}. It should be either "string" or "class`);
    return grid.toReadableString();
  }

  return null;
}