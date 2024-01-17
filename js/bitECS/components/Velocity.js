import { defineComponent } from 'bitecs'
import { Vector2, Vector2Proxy } from './Vector2.js'

export class VelocityProxy extends Vector2Proxy {
  constructor(eid) { super(Velocity, eid) }
}
export const Velocity = defineComponent(Vector2)