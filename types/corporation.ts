import { Member } from '@/types/member';
import { Filter } from '@/types/filter';

export interface Corporation {
  id: string;
  name: string;
  membersCount?: number;
}

export interface CorporationDetails extends Corporation {
  discord: string;
  wsWins: number;
  level: number;
  flagShip: number;
  requiredInfluence: number;
  members: Array<Member>;
  filters: Array<Filter>;
}