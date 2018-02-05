# Sokoban Level Generator (JavaScript)

[![npm](https://img.shields.io/npm/v/sokoban-generator.svg?maxAge=86400)](https://www.npmjs.com/package/sokoban-generator)

A procedural level generator for [Sokoban](https://en.wikipedia.org/wiki/Sokoban), written in JavaScript.

## Install

```
npm i sokoban-generator
```

## Usage

```JavaScript 1.6
// es6
import {generateSokobanLevel} from sokoban-generator;
generateSokobanLevel();

// es5 or older
var sokobanGenerator = require("sokoban-generator");
sokobanGenerator.generateSokobanLevel();
```

The generator accepts an optional `options`, and can return either a [string representation of the level](http://sokobano.de/wiki/index.php?title=Level_format), or a [`grid`](https://github.com/AnoXDD/sokoban-generator-javascript/blob/master/src/grid.js) class. 

If will return `null` if no solution is found. Increasing `attempts` might help.

```JavaScript
const options = {
  width: 9, // the width of the sokoban grid 
  height: 9, // the height of the sokoban grid
  boxes: 3, // the boxes on the grid
  minWalls: 13, // the minimum number of walls on the grid
  attempts: 5000, // when generating the map, the maximum attempts
  seed: Date.now(), // map seed. See note below
  initialPosition: { // The initial position of player
    x: 0,
    y: 0
  },
  type: "string", // the return type, either "string" or "class" 
};

let level = generateSokobanLevel(options);
```

### Note

* Seed is only expected to generate the same map under the same options. This means, for example,  
`generateSokobanLevel({seed: 1, boxes: 2})`
and
`generateSokobanLevel({seed: 1, boxes: 3})`
will probably generate different levels.

## Performance

The time it takes to generate a level is greatly increased when the number of size and walls are increased. 

It took ~5 seconds to generate a result on default settings on a 2015 Ultrabook Laptop using node, but it took only less than a second on [runkit](https://npm.runkit.com/sokoban-generator).

## License

GNU GPLv3

## Reference
The whole algorithm is partially based on [this paper](http://larc.unt.edu/ian/pubs/GAMEON-NA_METH_03.pdf)