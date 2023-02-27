export interface Attribute {
  id: string,
  name: string,
  value: number,
  max: number,
  current: number
}

export interface ShipAttribute {
  weapon?: Array<Attribute>,
  support?: Array<Attribute>,
  mining?: Array<Attribute>,
  trade?: Array<Attribute>,
  shield?: Array<Attribute>,
}