function seed() {
  let argsLength = arguments.length;
  let argsArray = [];
  for (let index = 0; index < argsLength; index++) {
    argsArray.push(arguments[index]);
  }

  return argsArray;
}

function same([x, y], [j, k]) {
  return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some((c) => same(c, cell));
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? "\u25A3" : "\u25A2";
};

const corners = (state = []) => {
  if (state.length === 0) {
    return {
      topRight: [0,0],
      bottomLeft: [0, 0]
    }
  }

  let xAxis = [];
  let yAxis = [];

  for (i = 0; i < state.length; i++) {
    xAxis.push(state[i][0]);
    yAxis.push(state[i][1]);
  }

  return {
    topRight: [Math.max (...xAxis), Math.max(...yAxis)],
    bottomLeft: [Math.min(...xAxis), Math.min(...yAxis)]
  };

};

const printCells = (state) => {
  const { bottomLeft, topRight } = corners(state);
  
  let cells = "";

  for (y = topRight[1]; y >= bottomLeft[1]; y--) {
    let row = [];
    for (x = bottomLeft[0]; x <= topRight[0]; x++) {
      row.push(printCell([x, y], state));
    }
    cells += row.join(" ") + "\n";
  }

  return cells;

};

const getNeighborsOf = ([x, y]) => {
  return [
    [x - 1, y -1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1]
  ];
};

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter((neighbor) => contains.bind(state)(neighbor));
};

const willBeAlive = (cell, state) => {
  let alive = contains.call(state, cell);
  let neighbors = getLivingNeighbors(cell, state);

  if (neighbors.length === 3 || (alive && neighbors.length === 2)) {
    return true;
  } else {
    return false;
  }

};

const calculateNext = (state) => {
  const {bottomLeft, topRight } = corners(state);

  let next = [];

  for (y = topRight[1] + 1; y >= bottomLeft[1] - 1; y--) {
    for (x = bottomLeft[0] - 1; x <= topRight[0]; x++) {
      next = next.concat(willBeAlive([x, y], state) ? [[x,y]] : []);
    }
  }
  return next;
};

const iterate = (state, iterations) => {
  const iterationStates = [state];
  for(let i = 0; i < iterations; i++) {
      iterationStates.push(calculateNext(iterationStates[i]));
  }
  return iterationStates;
};

const main = (pattern, iterations) => {
  const results = iterate(startPatterns[pattern], iterations);
  results.forEach(r => console.log(printCells(r)));
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;