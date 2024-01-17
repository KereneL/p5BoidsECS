import { defineSystem, defineQuery } from 'bitecs'
import { Position, PositionProxy } from '../components/Position.js'
import { VelocityProxy } from '../components/Velocity.js'

export const createP5DrawSystem = (p5) => {
  const position = new PositionProxy(null);
  const positionQuery = defineQuery([Position]);
  const velocity = new VelocityProxy(null);

  return defineSystem(world => {
    const ents = positionQuery(world);
    p5.stroke(100);
    p5.strokeWeight(1);

    for (let i = 1; i < ents.length; i++) {
      const eid = ents[i];
      let boid = world.entities.get(eid);
      position.eid = eid;
      velocity.eid = eid;

      let angle = Math.atan2(velocity.y, velocity.x) + Math.PI / 2
      let a = boid.a;
      p5.fill(boid.fill);
      p5.noStroke();


      p5.push();
      p5.translate(position.x, position.y);
      p5.rotate(angle);
      p5.beginShape();
      p5.vertex(0, -a * 2);
      p5.vertex(-a, a * 2);
      p5.vertex(a, a * 2);
      p5.endShape(p5.CLOSE);

      //Radius check
      if (boid.eid === 1) {
        p5.stroke(255);
        p5.noFill();
        p5.ellipse(0, 0, 48, 48);
        p5.ellipse(0, 0, 48 * 3, 48 * 3);
        p5.rotate(-angle);
        p5.stroke('green')
        p5.line(0, 0, velocity.x, velocity.y)
        p5.stroke(100);
      }

      p5.pop();
    };
    return world;
  });
};