export interface WsLog {
  id: string,
  corporation: string,
  opponentCorporationName?: string,
  matchType?: '5vs5' | '10vs10' | '15vs15',
  matchStart?: string
}