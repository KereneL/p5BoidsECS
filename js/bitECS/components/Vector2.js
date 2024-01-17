import { Types } from 'bitecs'

export const Vector2 = { x: Types.f32, y: Types.f32 }
export class Vector2Proxy {
  constructor(store, eid) {
    this.eid = eid
    this.store = store
  }

  get x() { return this.store.x[this.eid] }
  set x(val) { this.store.x[this.eid] = val }
  get y() { return this.store.y[this.eid] }
  set y(val) { this.store.y[this.eid] = val }
}