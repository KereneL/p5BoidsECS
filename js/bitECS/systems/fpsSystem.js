import { defineSystem, getAllEntities } from 'bitecs'
import { Utils } from '../../Utils.js';

export const createFPSSystem = (p5) => {
  return defineSystem(world => {

    let fps = Math.round(p5.frameRate());
    let entitiesQuantity = getAllEntities(world).length
    let timeElapsed = world.time.elapsed / 1000

    p5.strokeWeight(0);
    p5.fill(p5.color(255,69,0));
    p5.text(`FPS: ${fps}`, 12, 12, 372, 40)
    p5.text(`Entities: ${entitiesQuantity}`, 12, 26, 372, 40)
    p5.text(`Time elapsed: ${Utils.round(timeElapsed, 2)}s`, 12, 40, 372, 40)
    return world;
  });
};