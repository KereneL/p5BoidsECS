import { defineSystem } from 'bitecs'

export const createTimeSystem = (p5) => {

  return defineSystem(world => {
    const { time } = p5.world;
    const now = performance.now();
    const delta = now - time.then;

    time.delta = delta;
    time.elapsed += delta;
    time.then = now;

    return world;
  });
};