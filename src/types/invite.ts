export interface InviteRequest {
  requested_user: string;
}

export interface InviteResponse {
  result: string;
  message?: string;
  socket_id?: string; // ID of requested user
}

export interface Invited {
  result: string;
  message?: string;
  socket_id?: string; // ID of socket that invited the person
}

export interface UninviteRequest {
  requested_user: string;
}

export interface UninviteResponse {
  result: string;
  message?: string;
  socket_id?: string; // ID of requested user
}
