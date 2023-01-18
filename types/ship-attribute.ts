export interface Attribute {
  name: string,
  value: number,
  max: number
}

export interface ShipAttribute {
  weapon?: Array<Attribute>,
  support?: Array<Attribute>,
  mining?: Array<Attribute>,
  trade?: Array<Attribute>,
  shield?: Array<Attribute>,
}