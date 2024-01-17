import { defineSystem, defineQuery, Not, addComponent, removeComponent } from 'bitecs'
import { Flag } from '../components/Flag.js'
import { Position, PositionProxy } from '../components/Position.js'

export const createFlockSystem = function (p5) {
    const position = new PositionProxy(null)
    const flockingQuery = defineQuery([Position])
    const notFlaggedQuery = defineQuery([Position, Not(Flag)])

    return defineSystem(world => {
        const ents = flockingQuery(world)
        for (let i = 0; i < ents.length; i++) {
            const eid = ents[i];
            position.eid = eid;

            addComponent(world, Flag, eid)
            const others = notFlaggedQuery(world)
            world.entities.get(eid).flock(others);
            removeComponent(world, Flag, eid)
        }
        return world
    })
}