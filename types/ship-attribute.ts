export interface Attribute {
  id: string,
  name: string,
  set: number,
  max: number
}

export interface ShipAttribute {
  weapon: Array<Attribute>,
  support: Array<Attribute>,
  mining: Array<Attribute>,
  trade: Array<Attribute>,
  shield: Array<Attribute>,
}