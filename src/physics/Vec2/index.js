
class Vec2 extends Array {
  constructor(x, y){
    super(x, y);
  }
  clone(){
    return new Vec2(this[0], this[1]);
  }
  normal(){
    return this.mulNum(1/this.distance());
  }
  add(vec2){
    return new Vec2(this[0] + vec2[0], this[1] + vec2[1]);
  }
  mul(vec2){
    return new Vec2(this[0] * vec2[0], this[1] * vec2[1]);
  }
  sub(vec2){
    return this.add(vec2.mulNum(-1));
  }

  addNum(value){
    return new Vec2(this[0] + value, this[1] + value);
  }
  powNum(value){
    return new Vec2(
      Math.pow(this[0], value),
      Math.pow(this[1], value)
    );
  }
  mulNum(value){
    return new Vec2(this[0] * value, this[1] * value);
  }
  subNum(value){
    return this.addNum(-1 * value);
  }

  dot(vec2){
    if(!vec2) vec2 = this;
    return this[0] * vec2[0] + this[1] * vec2[1];
  }
  length(vec2){
    return Math.sqrt(this.dot(vec2));
  }
  distance(vec2){
    return Math.sqrt(this.dot(vec2));
  }

  polynomial(vec2){
    if(!vec2) vec2 = this;
    return [
      this[0] * vec2[0],
      2 * this[0] * vec2[1],
      this[1] * vec2[1]
    ];
  }

}
["x", "y"].forEach(function(key, i){
  Object.defineProperty(Vec2.prototype, key, {
    get: function(){
      return this[i];
    },
    set: function(v){
      this[i] = v;
    }
  })
})

module.exports = Vec2;
