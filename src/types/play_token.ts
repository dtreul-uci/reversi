export interface PlayTokenRequest {
  row: number;
  column: number;
  color: string;
}

export interface PlayTokenResponse {
  result: string;
  message?: string;
}
