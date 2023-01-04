export interface Member {
  id: string;
  username: string;
  nextWs: string;
  timeZone?: string;
  rsLevel?: number;
  bsLevel?: number;
  maxMods?: number;
  asLeader?: boolean;
  preferences?: string[];
}
