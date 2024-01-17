import { defineComponent, Types } from 'bitecs'

export const Mass = defineComponent({ value: Types.f32 })

export class MassProxy {
  constructor(eid) {
    this.eid = eid
    this.store = Mass
  }

  get () { return this.store[this.eid] }
  set (val) { this.store[this.eid] = val }
}