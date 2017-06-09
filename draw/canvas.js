

const CanvasDraw = {
  drawBody(ctx, body){
    ctx.beginPath();
    ctx.arc(body.pos[0], body.pos[0], body.radius, 0, Math.PI*2, false);
    ctx.fill();
  }
}

module.exports = CanvasDraw;
