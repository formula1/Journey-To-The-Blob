var M = require("../../util/math")
var Vec2 = require("../Vec2");
module.exports.resolveVelocities = reflectionCollision;
module.exports.resolveSingleVelocity = reflectAgainstWall;

//
// module.exports = distributeMomentum;
// module.exports = calculateCollisionTime;
// module.exports = applyImpulse;

function reflectAgainstWall(a, wallSlope){
  var perp = getPerpendicular(wallSlope);
  var rotatedA = rotateVector(a.vel, perp);
  var nextA = rotatedA.mul(new Vec2(-1, 1));
  a.vel = rotateVector(nextA, perp, true);
}

function reflectionCollision(a, b){
  var perp = getPerpendicular(a.pos.sub(b.pos));
  //direction vector
  var rotatedA = rotateVector(a.vel, perp);
  var rotatedB = rotateVector(b.vel, perp);
  var oriVelA = rotatedA.x;
  var oriVelB = rotatedB.x;
  var [ nextVelA, nextVelB ] = resolveVelocities(
    1, oriVelA, a.mass, oriVelB, b.mass
  );
  var nextA = rotatedA.clone();
  nextA.x = nextVelA;
  var nextB = rotatedB.clone();
  nextB.x = nextVelB;

  a.vel = rotateVector(nextA, perp, true);
  b.vel = rotateVector(nextA, perp, true);
}

function getPerpendicular(slope){
  return new Vec2(
    slope.y, - slope.x
  ).normal();
}

function rotateVector(v, perp, inverse){
  if(inverse) perp = perp.mul(new Vec2(1, -1));
  return new Vec2(
    v.x * perp.x - v.y * perp.y,
    v.y * perp.x + v.x * perp.y
  );
}

// (r * massB(velB - velA + velB) + massA*velA)
// (r * massB * velB -  r * massB * velA + massA*velA + massB * velB)/(massA + massB),
// (r * massB * velB -  r * massB * velA + massA*velA + massB * velB)/(massA + massB),
// (r * massB * velB + velA * (-  r * massB + massA) + massB * velB)/(massA + massB),
// (massB * velB (r  + 1) + velA * (-  r * massB + massA))/(massA + massB),

function resolveVelocities(r, velA, massA, velB, massB){
  return [
    (r * massB(velB - velA) + massA*velA + massB * velB)/(massA + massB),
    (r * massA(velA - velB) + massA*velA + massB * velB)/(massA + massB),
  ]
}



function distributeMomentum(a, b){
  var pNorm = a.pos.sub(b.pos).normal();

  var pval = a.vel.sub(b.vel).mulNum(2).mul(pNorm).div(a.mass + b.mass);

  a.vel = a.vel.sub(pval.mul(a.mass).mul(pNorm))
  b.vel = b.vel.sub(pval.mul(b.mass).mul(pNorm))
}
/*


	//calculate the total speed of the two balls
	var totalVelMag = a.vel.length() + b.vel.length();

	//then add to their velocity 50% of the speed * the vector they need to move in
	//you could look at radius if you want and change the amnt of the vel of each based on mass (radius squared)

	var frictionalLoss = 0.95;
	totalVelMag *= frictionalLoss;

	var massA = a.radius * a.radius;
	var massB = b.radius * b.radius;

	var total = massA + massB;

  var amntA = massA / total;
	var amntB = massB / total;

	a.vel.add(pDist.normal().mulNum(amntB * totalVelMag * 0.5 ));
  b.vel.add(pDist.normal().mulNum(- amntA * totalVelMag * 0.5 ));
*/

// reflected array http://paulbourke.net/geometry/reflected/

/*

Goal
- For each collion
  - Find time of first impact
- Sort found collisions by time in ascending order
- Apply Repulsive forces based upon
  - the current "pressure" of the body
*/

/*


*/

function calculateCollisionTime(aBody, bBody, maxDelta){
  /*

    (
      + posax ^ 2
      + posay ^ 2
      - ra^2
      - posbx ^ 2
      - posby ^ 2
      + rb^2
    )
    + 2 * t * (
      + posax * velax
      + posay * velay
      - posbx * velbx
      - posby * velby
    )
    + t^2 * (
      + velax ^ 2
      + velay ^ 2
      - velbx ^ 2
      - velby ^ 2
    );
  */
  var aRad = aBody.radius;
  var aPos = aBody.pos;
  var aVel = aBody.vel;
  var bRad = bBody.radius;
  var bPos = bBody.pos;
  var bVel = bBody.vel;
  var a = (
    aPos.dot()
    - bPos.dot()
    - aRad * aRad
    + bRad * bRad
  );
  var b = 2 * (
    aPos.dot(aVel)
    - bPos.dot(bVel)
  );
  var c = aVel.dot() - bVel.dot();
  var collisions = M.quadratic(
    a, b, c
  );
  if(collisions === false){
    return false;
  }
  collisions.filter(function(num){
    return num > 0 && num <= maxDelta;
  });
  if(collisions.length === 0){
    return false;
  }
  var collision;
  if(collisions.length > 1){
    collision = collisions[
      collisions[0] < collisions[1] ? 0 : 1
    ];
  } else {
    collision = collisions[0]
  }
  return collision;
}


function applyImpulse(a, b){

  var netvel = a.vel.sub(b.vel);
  var initialMomentum = a.vel.mulNum(a.mass).add(b.vel.mulNum(b.mass));
  var netKinetic = (
    a.vel.powNum(2).mulNum(a.mass / 2)
  ).add(
    b.vel.powNum(2).mulNum(b.mass / 2)
  )

  var netvelVector = netvel.distance();

  var posDiff = a.pos.sub(b.pos);
  var normalAngel = posDiff.normal();
  var intersectionPoint = normalAngle.mulNum(a.radius + b.radius);

  var percentOfCircle = 2 * M.areaOfCircleSegment(
    { slope: normalAngel, offset: 0 },
    { mid: intersectionPoint, radius: b.radius }
  );

  var velFA = a.vel.mulNum(
    (a.mass - b.mass)/(a.mass + b.mass)
  ).add(
    b.vel.mulNum(
      2 * b.mass / (a.mass + b.mass)
    )
  );

  var velFA = a.vel.mulNum(
    (a.mass - b.mass)/(a.mass + b.mass)
  ).add(
    b.vel.mulNum(
      2 * b.mass / (a.mass + b.mass)
    )
  );



  var finalVector = normalAngel.mul(netvelVector * percentOfCircle);


  var diff = a.pos.sub(b.pos);
  var distance2 = diff.dot();
  var target = a.radius + b.radius;

  var va = a.vel;
  var vb = b.vel;

  // resolve the body overlap conflict
  var distance = Math.sqrt(distance2);
  var factor = (distance-target)/distance;

  // compute the projected component factors
  var f1 = (damping*diff.dot(va))/distance2;
  var f2 = (damping*diff.dot(vb))/distance2;

  // swap the projected components

  va = va.add(diff.mulNum(f2 - f1))
  vb = vb.add(diff.mulNum(f1 - f2))

  // the previous position is adjusted
  // to represent the new velocity
  a.prevPos = a.prevPos.sub(va);
  b.prevPos = b.prevPos.sub(vb);
}
