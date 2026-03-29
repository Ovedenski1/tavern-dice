export type Face = 1 | 2 | 3 | 4 | 5 | 6;

export type Phase = "menu" | "rules" | "choose" | "playing" | "gameover";

export type PlayerSide = "player" | "bot";

export type Difficulty = 2000 | 4000 | 8000;

export type Bot = {
  id: string;
  name: string;
  avatar: string;
  target: Difficulty;
  greed: number;
  risk: number;
};

export type Die = {
  id: string;
  value: Face;
  selected: boolean;
};

export type TurnState = {
  rolledDice: Die[];
  bankedDice: Die[];
  unscoredTurnPoints: number;
  canContinue: boolean;
  hotDice: boolean;
};

export type Scores = {
  player: number;
  bot: number;
};