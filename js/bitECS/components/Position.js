import { defineComponent } from 'bitecs'
import { Vector2, Vector2Proxy } from './Vector2.js'

export class PositionProxy extends Vector2Proxy {
  constructor(eid) { super(Position, eid) }
}
export const Position = defineComponent(Vector2)