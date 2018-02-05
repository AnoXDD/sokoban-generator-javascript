# Sokoban Level Generator (JavaScript)

A procedural level generator for [Sokoban](https://en.wikipedia.org/wiki/Sokoban), written in JavaScript.

## Usage

```JavaScript
import {generateSokobanLevel} from sokoban-generator;
```

The generator can either returns a [string representation of the level](http://sokobano.de/wiki/index.php?title=Level_format), or a `grid` class. 

```JavaScript
const options = {
  width: 9, // the width of the sokoban grid 
  height: 9, // the height of the sokoban grid
  boxes: 3, // the boxes on the grid
  minWalls: 13, // the minimum number of walls on the grid
  attempts: 50, // when generating the map, the maximum attempts
  seed: Date.now(), // map seed. Same seed generates same map
  initialPosition: { // The initial position of player
    x: 0,
    y: 0
  },
  type: "string", // the return type, either "string" or "class" 
};

let level = generateSokobanLevel(options);

// Or to use the default options
let level = generateSokobanLevel();
```

## Performance

The time it takes to generate a level is greatly increased when the number of size and walls are increased. 

It took ~5 seconds to generate a result on default settings on a 2015 Ultrabook Laptop using node.

## License

GNU GPLv3

## Reference
The whole algorithm is partialy based on [this paper](http://larc.unt.edu/ian/pubs/GAMEON-NA_METH_03.pdf)