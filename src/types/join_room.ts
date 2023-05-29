export interface JoinRoomRequest {
  room: string;
  username: string | null;
}

export interface JoinRoomResponse {
  result: string;
  socket_id: string;
  room?: string | null;
  username?: string | null;
  count?: number;
  message?: string;
}
