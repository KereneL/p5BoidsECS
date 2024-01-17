import { defineSystem, defineQuery, Not, addComponent, removeComponent } from 'bitecs'
import { Flag } from '../components/Flag.js'
import { Position, PositionProxy } from '../components/Position.js'
import { Velocity, VelocityProxy } from '../components/Velocity.js'
import { Acceleration, AccelerationProxy } from '../components/Acceleration.js'
import { Utils } from '../../Utils.js'
let maxspeed = null;     // Maximum speed
let maxforce = null;     // Maximum steering force

export const createFlockSystem = function (p5) {

    maxspeed = 150;     
    maxforce = 0.5;     

    const flockingQuery = defineQuery([Position])
    const notFlaggedQuery = defineQuery([Position, Not(Flag)])

    return defineSystem(world => {
        const ents = flockingQuery(world)
        for (let i = 0; i < ents.length; i++) {
            const eid = ents[i];
            addComponent(world, Flag, eid)
            const others = notFlaggedQuery(world)
            flock(eid, others);
            removeComponent(world, Flag, eid)
        }
        return world;
    })
}



// Thank you Daniel Shiffman
// https://p5js.org/examples/simulate-flocking.html, https://natureofcode.com/

const currentPosition = new PositionProxy(null)
const currentVelocity = new VelocityProxy(null);
const currentAcceleration = new AccelerationProxy(null);
const otherPosition = new PositionProxy(null)
const otherVelocity = new VelocityProxy(null);

// We accumulate a new acceleration each time based on three rules
function flock(currentBoid, otherBoids) {
    currentPosition.eid = currentBoid
    currentVelocity.eid = currentBoid
    currentAcceleration.eid = currentBoid

    let sep = separate(otherBoids);   // Separation
    let ali = align(otherBoids);      // Alignment
    let coh = cohesion(otherBoids);   // Cohesion

    // Arbitrarily weight these forces
    sep.x *= 1.5
    sep.y *= 1.5

    ali.x *= 1.0
    ali.y *= 1.0

    coh.x *= 1.0
    coh.y *= 1.0

    // Add the force vectors to acceleration
    currentAcceleration.x = 0 + sep.x + ali.x + coh.x;
    currentAcceleration.y = 0 + sep.y + ali.y + coh.y;
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
function seek(target) {
    let desired = { x: target.x - currentPosition.x, y: target.y - currentPosition.y };  // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired = Utils.normV2(desired)
    desired.x *= maxspeed;
    desired.y *= maxspeed;

    // Steering = Desired minus Velocity
    let steer = { x: desired.x - currentVelocity.x, y: desired.y - currentVelocity.y }
    steer = Utils.limitV2(steer, maxforce)
    return steer;
}

// Separation
// Method checks for nearby boids and steers away
function separate(otherBoids) {
    let steer = { x: 0, y: 0 }
    let desiredSeparation = 48.0;
    let count = 0;

    // For every boid in the system, check if it's too close
    for (let i = 0; i < otherBoids.length; i++) {
        otherPosition.eid = otherBoids[i]
        let d = Utils.distance(currentPosition, otherPosition);
        // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
        if ((d > 0) && (d < desiredSeparation)) {

            // Calculate vector pointing away from neighbor
            let diff = {
                x: currentPosition.x - otherPosition.x,
                y: currentPosition.y - otherPosition.y
            }

            diff = Utils.normV2(diff)

            diff.x /= d;
            diff.y /= d;
            steer.x += diff.x;
            steer.y += diff.y;
            // Keep track of how many
            count++;
        }
    }
    // Average -- divide by how many
    if (count > 0) {
        steer.x /= count;
        steer.y /= count;
    }

    // As long as the vector is greater than 0
    if ((steer.x != 0 || steer.y != 0)) {
        // Implement Reynolds: Steering = Desired - Velocity
        steer = Utils.normV2(steer)

        steer.x *= maxspeed;
        steer.y *= maxspeed;
        steer.x -= currentVelocity.x;
        steer.y -= currentVelocity.y;

        steer = Utils.limitV2(steer, maxforce)
    }

    return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
function align(otherBoids) {
    let neighborDist = 48 * 3;
    let sum = { x: 0, y: 0 }
    let count = 0;

    for (let i = 0; i < otherBoids.length; i++) {
        otherPosition.eid = otherBoids[i]
        let d = Utils.distance(currentPosition, otherPosition);

        if ((d > 0) && (d < neighborDist)) {
            otherVelocity.eid = otherBoids[i];
            sum.x += otherVelocity.x;
            sum.y += otherVelocity.y;
            count++;
        }
    }
    if (count > 0) {
        sum.x /= count;
        sum.y /= count;
        sum = Utils.normV2(sum)
        sum.x *= maxspeed;
        sum.y *= maxspeed;
        let steer = {
            x: sum.x - currentVelocity.x,
            y: sum.y - currentVelocity.y
        }
        steer = Utils.limitV2(steer, maxforce)
        return steer;
    } else {
        return { x: 0, y: 0 }
    }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
function cohesion (otherBoids) {
    let neighborDist = 48 * 3;
    let sum = { x: 0, y: 0 }   // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < otherBoids.length; i++) {
        otherPosition.eid = otherBoids[i]
        let d = Utils.distance(currentPosition, otherPosition);

        if ((d > 0) && (d < neighborDist)) {
            sum.x += otherPosition.x;
            sum.y += otherPosition.y;
            count++;
        }
    }
    if (count > 0) {
        sum.x /= count;
        sum.y /= count;
        return seek(sum);  // Steer towards the location
    } else {
        return { x: 0, y: 0 }
    }
}