export interface JoinRoomRequest {
  room: string | null;
  username: string | null;
}

export interface JoinRoomResponse {
  result: string;
  room?: string | null;
  username?: string | null;
  count?: number;
  message?: string;
}
