import Grid from "./grid";

export function generateSokoban(width = 9,
                                height = 9,
                                boxes = 3,
                                maxAttempts = 100) {
  let grid = new Grid(width, height);
  while (--maxAttempts > 0) {
    grid.applyTemplate();
    if (!grid.isGoodCandidate() || !grid.redeployGoals()) {
      continue;
    }

  }
}