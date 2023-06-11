export interface Game {
  player_white: GamePlayer;
  player_black: GamePlayer;
  last_move_time: Date;
  whose_turn: string;
  board: string[][];
}

export interface GamePlayer {
  socket: string;
  username: string;
}
