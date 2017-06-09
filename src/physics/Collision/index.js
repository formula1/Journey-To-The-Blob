var {
  getAllCollisions,
  getBodyCollisions,
} = require("get-collisions");

var {
  resolveVelocities,
} = require("./physics");

module.exports = collisionStep;

function collisionStep(bodyList, maxDelta){
  var leftOverTime = maxDelta
  var resolvedCollsions = [];

  var collisions = getAllCollisions(bodyList, leftOverTime)
  while(collisions.length){
    var state = collisions.reduce(findCollisionReducer);
    var curTime = state.min.time;
    var toResolve = state.min.active;
    bodyList.forEach(function(b){
      b.moveToTime(curTime);
    })
    var collisionResults = toResolve.reduce(
      resolveCollisionReducer(bodyList)
    )
    resolvedCollsions = resolvedCollsions.concat(
      collisionResults.resolvedCollsions
    );
    leftOverTime = leftOverTime - curTime
    collisions = state.min.inactive.filter(
      hasDirtyBody(collisionResults.dirtyBodies)
    )
    .concat(getBodyCollisions(
      Array.from(collisionResults.dirtyBodies.values()),
      bodyList
    ))
  }
  return resolvedCollsions;
}

function hasDirtyBody(bodies){
  return function(c){
    return !bodies.has(c[1]) && !bodies.has(c[2]);
  }
}

function defaultResolveState(){
  return {
    dirtyBodies: new Set(),
    resolvedCollsions: []
  };
}

function resolveCollisionReducer(bodyList){
  return function(state, col){
    if(!state) state = defaultResolveState();
    state.dirtyBodies.add(col[1])
    state.dirtyBodies.add(col[2])
    var bodyA = bodyList[col[1]];
    var bodyB = bodyList[col[2]];
    resolveVelocities(bodyA, bodyB);
    state.resolvedCollsions.push({ time: col[0], a: bodyA, b: bodyB });
    return state
  }
}

function defaultFindState(){
  return {
    cols: [],
    min: {
      inactive: [],
      active: [],
      time: Number.POSITIVE_INFINITY
    }
  }
}

function findCollisionReducer(state, col){
  if(!state) state = defaultFindState();
  return {
    cols: state.cols.concat([ col ]),
    min: getActive(state.min, col),
  }
}

function getActive(state, col){
  var diff = col[0] - state.time;
  if(diff < 0){
    return {
      inactive: state.inactive.concat(state.active),
      time: col[0],
      active: [col]
    }
  }
  if(diff === 0){
    state.active.push(col);
    return state;
  }

  state.inactive.push(col);
  return state;
}
