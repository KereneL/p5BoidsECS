import {
  createWorld,
  addEntity,
  addComponent,
  pipe,
} from 'bitecs'

import { Position } from './components/Position.js';
import { Velocity } from './components/Velocity.js';
import { Acceleration } from './components/Acceleration.js';
import { Mass } from './components/Mass.js'

import { createFlockSystem } from './systems/flockSystem.js';
import { createMovementSystem } from './systems/movementSystem.js';
import { createP5DrawSystem } from './systems/p5DrawSystem.js';
import { createFPSSystem } from './systems/fpsSystem.js';
import { createTimeSystem } from './systems/timeSystem.js';

export function createNewWorld(p5) {
  const world = createWorld()
  world.time = { delta: 0, elapsed: 0, then: performance.now() };
  world.pipeline = pipe(
    createFlockSystem(p5),
    createMovementSystem(p5),
    createP5DrawSystem(p5),
    createFPSSystem(p5),
    createTimeSystem(p5)
  );

  world.createEntity = function () {
    const eid = addEntity(world);
    addComponent(world, Position, eid);
    addComponent(world, Velocity, eid);
    addComponent(world, Acceleration, eid);
    addComponent(world, Mass, eid);
    return eid;
  };

  return world;
};