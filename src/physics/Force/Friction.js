

class Friction{
  constructor(factor){
    this.factor = factor;
  }
  applyToBody(body, time){
    body.vel = body.vel.mulNum(this.factor * time);
  }
}

module.exports = Friction;
