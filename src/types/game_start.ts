export interface GameStartRequest {
  requested_user: string;
}

export interface GameStartResponse {
  result: string;
  message?: string;
  game_id?: string;
}
