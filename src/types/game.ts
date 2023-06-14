import { ChatCompletionRequestMessage } from "openai";

export interface Game {
  player_white: GamePlayer;
  player_black: GamePlayer;
  last_move_time: number;
  whose_turn: string;
  board: string[][];
  legal_moves: string[][];
  chat_messages: ChatCompletionRequestMessage[];
}

export interface GamePlayer {
  socket: string;
  username: string;
}
