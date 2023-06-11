import { Game } from "./game";

export interface GameOver {
  result: string;
  game_id: string;
  game: Game;
  who_won: string;
  message?: string;
}
