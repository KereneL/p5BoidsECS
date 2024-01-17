import { defineSystem, defineQuery } from 'bitecs'
import { Position, PositionProxy } from '../components/Position.js'
import { Velocity, VelocityProxy } from '../components/Velocity.js'
import { Acceleration, AccelerationProxy } from '../components/Acceleration.js'

export const createMovementSystem = function (p5) {
    const position = new PositionProxy(null);
    const velocity = new VelocityProxy(null);
    const acceleration = new AccelerationProxy(null);
    const movementQuery = defineQuery([Position, Velocity, Acceleration]);

    return defineSystem(world => {
        const ents = movementQuery(world);
        const { time: { delta } } = world;
        const effectiveDelta = delta / 1000; // delta is given in miliseconds and we want wo be working in seconds

        for (let i = 0; i < ents.length; i++) {
            const eid = ents[i]
            position.eid = eid;
            velocity.eid = eid;
            acceleration.eid = eid;

            velocity.x += acceleration.x * 100 * effectiveDelta;
            velocity.y += acceleration.y * 100 * effectiveDelta;

            position.x += velocity.x * effectiveDelta;
            position.y += velocity.y * effectiveDelta;


            acceleration.x = 0;
            acceleration.y = 0;

            if (position.x < 0) position.x += p5.width;
            if (position.y < 0) position.y += p5.height;
            if (position.x > p5.width) position.x = position.x % p5.width;
            if (position.y > p5.height) position.y = position.y % p5.height;
        };
        return world;
    });
}