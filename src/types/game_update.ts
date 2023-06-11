import { Game } from "./game";

export interface GameUpdateResponse {
  result: string;
  game_id?: string;
  game?: Game;
  message?: string;
}
