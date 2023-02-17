import { Member } from '@/types/member';

export interface Corporation {
  id: string;
  name: string;
  membersCount?: number;
  members?: Array<Member>;
}

export interface CorporationDetails extends Corporation {
  discord: string;
  wsWins: number;
  level: number;
  flagShip: number;
  requiredInfluence: number;
}