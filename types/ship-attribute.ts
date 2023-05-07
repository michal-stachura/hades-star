export interface Attribute {
  id: string,
  name: string,
  set: number,
  max: number,
  type?: string,
  progress?: number,
}

export interface ShipAttribute {
  Weapon: Array<Attribute>,
  Support: Array<Attribute>,
  Mining: Array<Attribute>,
  Trade: Array<Attribute>,
  Shield: Array<Attribute>,
}