

class Gravity{
  constructor(vec2){
    this.accel = vec2;
  }
  applyToBody(def, body){
    body.vel = body.vel.mul(def.factor);
  }
}

module.exports = Gravity;
