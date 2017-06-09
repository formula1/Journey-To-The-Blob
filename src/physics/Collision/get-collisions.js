var { calculateCollisionTime } = require("./physics")

module.exports = getAllCollisions;
module.exports = getBodyCollisions;

function getAllCollisions(bodyList, maxDelta){
  var l = bodyList.length;
  var ll = l - 1;
  var collisions = [];
  for(var i = 0; i < ll; i++){
    var bodyA = bodyList[i];
    for(var j = i + 1; j < l; j++){
      var bodyB = bodyList[j];
      var time = calculateCollisionTime(bodyA, bodyB, maxDelta);
      if(time === false){
        continue;
      }
      collisions.push([ time, i, j ]);
    }
  }
  return collisions;
}

function getBodyCollisions(dirtyBodyIndexes, bodyList, maxDelta){
  var l = dirtyBodyIndexes.length;
  var ll = bodyList.length;
  var collisions = [];
  for(var i = 0; i < ll; i++){
    var bodyAIndex = dirtyBodyIndexes[i];
    var bodyA = bodyList[bodyAIndex];
    for(var j = 0; j < l; j++){
      if(bodyAIndex === j) continue;
      var bodyB = bodyList[j];
      var time = calculateCollisionTime(bodyA, bodyB, maxDelta);
      if(time === false){
        continue;
      }
      collisions.push([ time, bodyAIndex, j ]);
    }
  }
  return collisions;
}
