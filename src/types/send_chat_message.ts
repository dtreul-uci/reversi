export interface SendChatMessageRequest {
  room: string | null;
  username: string | null;
  message: string | null;
}

export interface SendChatMessageResponse {
  result: string;
  room?: string | null;
  username?: string | null;
  count?: number;
  message?: string;
}
