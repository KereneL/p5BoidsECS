import { defineComponent } from 'bitecs'
import { Vector2, Vector2Proxy } from './Vector2.js'

export class AccelerationProxy extends Vector2Proxy {
  constructor(eid) { super(Acceleration, eid) }
}
export const Acceleration = defineComponent(Vector2)