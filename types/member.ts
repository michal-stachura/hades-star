import { ShipAttribute } from "@/types/ship-attribute";

export interface Member {
  id: string;
  name: string;
  nextWs: string;
  timeZone: string;
  rsLevel: number;
  bsLevel: number;
  maxMods: number;
  asLeader: boolean;
  wsShipRoles: string[];
  attributes: ShipAttribute
}
