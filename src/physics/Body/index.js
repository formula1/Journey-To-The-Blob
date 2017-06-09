var Vec2 = require("../Vec2");

class Body {
  constructor(x, y, radius){
    this.rest = true;
    this.pos = new Vec2(x, y);
    this.vel = new Vec2(0, 0);
    this.acc = new Vec2(0, 0);
    this.radius = radius;
    this.mass = 1;
    this.pressure = 0;
    this.temperature = 0;
    this.activeCollisions = [];
  }
  moveToTime(delta){
    if(this.rest) return;
    this.vel = this.vel.add(this.acc.mulNum(delta))
    this.pos = this.pos.add(this.vel.mul(delta))
  }
}


//   accelerate(delta){
//     this.pos = this.pos.add2(this.acc.mulNum(delta * delta));
//     this.acc = new Vec2(0, 0);
//   }
//   inertia(/* delta */){
//     var nextPos = this.pos.mulNum(2).sub(this.prevPos)
//     this.prevPos = this.pos;
//     this.pos = nextPos;
//   }
// }
//
// Object.defineProperty(Body.prototype, "vel", {
//   get(){
//     return this.pos.sub(this.prevPos);
//   }
// })

module.exports = Body;
