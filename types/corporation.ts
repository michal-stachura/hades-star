import { Member } from '~/types/member';

export interface Corporation {
  id: string;
  name: string;
  members: number | Array<Member>;
}

export interface CorporationDetails extends Corporation {
  discord: string;
  wsWins: number;
}