// Thank you Daniel Shiffman
// https://p5js.org/examples/simulate-flocking.html, https://natureofcode.com/

import { Position } from './bitECS/components/Position.js'
import { Velocity } from './bitECS/components/Velocity.js'
import { AccelerationProxy } from './bitECS/components/Acceleration.js'
import { Utils } from './Utils.js';

const acceleration = new AccelerationProxy(null);

export function Boid(world, eid) {
  this.eid = eid;
  let rnd = Math.random();
  this.a = (rnd * 3) + 0.5;
  this.fill = 100 + (rnd*100)
  this.maxspeed = 150;    // Maximum speed
  this.maxforce = 0.5; // Maximum steering force
  this.position = { x: 0, y: 0 }
  this.velocity = { x: 0, y: 0 }
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function (boids) {
  this.position.x = Position.x[this.eid]
  this.position.y = Position.y[this.eid]
  this.velocity.x = Velocity.x[this.eid]
  this.velocity.y = Velocity.y[this.eid]

  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion

  // Arbitrarily weight these forces
  sep.x *= 1.5
  sep.y *= 1.5

  ali.x *= 1.0
  ali.y *= 1.0

  coh.x *= 1.0
  coh.y *= 1.0

  // Add the force vectors to acceleration
  acceleration.eid = this.eid;
  acceleration.x = 0 + sep.x + ali.x + coh.x;
  acceleration.y = 0 + sep.y + ali.y + coh.y;
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function (target) {
  let desired = { x: target.x - this.position.x, y: target.y - this.position.y };  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired = Utils.normV2(desired)
  desired.x *= this.maxspeed;
  desired.y *= this.maxspeed;

  // Steering = Desired minus Velocity
  let steer = { x: desired.x - this.velocity.x, y: desired.y - this.velocity.y }
  steer = Utils.limitV2(steer, this.maxforce)
  return steer;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function (boids) {
  let steer = { x: 0, y: 0 }
  let desiredseparation = 48.0;
  let count = 0;

  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let boidPosition = { x: Position.x[boids[i]], y: Position.y[boids[i]] };
    let d = Utils.distance(this.position, boidPosition);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {

      // Calculate vector pointing away from neighbor
      let diff = {
        x: this.position.x - boidPosition.x,
        y: this.position.y - boidPosition.y
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

    steer.x *= this.maxspeed;
    steer.y *= this.maxspeed;
    steer.x -= this.velocity.x;
    steer.y -= this.velocity.y;


    steer = Utils.limitV2(steer, this.maxforce)
  }


  return steer;

}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function (boids) {
  let neighbordist = 48 * 3;
  let sum = { x: 0, y: 0 }
  let count = 0;
  let thisVelocity = { x: Velocity.x[this.eid], y: Velocity.y[this.eid] }

  for (let i = 0; i < boids.length; i++) {
    let boidPosition = { x: Position.x[boids[i]], y: Position.y[boids[i]] };
    let d = Utils.distance(this.position, boidPosition);

    if ((d > 0) && (d < neighbordist)) {
      let boidVelocity = { x: Velocity.x[boids[i]], y: Velocity.y[boids[i]] }
      sum.x += boidVelocity.x;
      sum.y += boidVelocity.y;
      count++;
    }
  }
  if (count > 0) {
    sum.x /= count;
    sum.y /= count;
    sum = Utils.normV2(sum)
    sum.x *= this.maxspeed;
    sum.y *= this.maxspeed;
    let steer = {
      x: sum.x - thisVelocity.x,
      y: sum.y - thisVelocity.y
    }
    steer = Utils.limitV2(steer, this.maxforce)
    return steer;
  } else {
    return { x: 0, y: 0 }
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function (boids) {
  let neighbordist = 48 * 3;
  let sum = { x: 0, y: 0 }   // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let boidPosition = { x: Position.x[boids[i]], y: Position.y[boids[i]] }
    let d = Utils.distance(this.position, boidPosition)

    if ((d > 0) && (d < neighbordist)) {
      sum.x += boidPosition.x;
      sum.y += boidPosition.y;
      count++;
    }
  }
  if (count > 0) {
    sum.x /= count;
    sum.y /= count;
    return this.seek(sum);  // Steer towards the location
  } else {
    return { x: 0, y: 0 }
  }
}