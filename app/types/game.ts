export type Face = 1 | 2 | 3 | 4 | 5 | 6;

export type Phase =
  | "menu"
  | "rules"
  | "choose"
  | "customize"
  | "playing"
  | "gameover";

export type PlayerSide = "player" | "bot";

export type Difficulty = 2000 | 4000 | 8000;

export type DieType =
  | "normal"
  | "lucky"
  | "wooden"
  | "joker"
  | "unlucky"
  | "unbalanced"
  | "odd"
  | "misfortune"
  | "devil"
  | "holy"
  | "gambler"
  | "void"
  | "memory"
  | "ice"
  | "block"
  | "middle";

export type StatueType =
  | "none"
  | "cola"
  | "gomgumfruit"
  | "rumbleball"
  | "cursemark";

export type CustomDie = {
  slot: number;
  type: DieType;

  // runtime state
  memoryStoredValue?: Face | null;
  gamblerChain?: number;
  iceFrozenValue?: Face | null;
  iceConsecutiveKeeps?: number;
  iceGhost?: boolean;
  blockBlockedValue?: Face | null;
};

export type Bot = {
  id: string;
  name: string;
  avatar: string;
  target: Difficulty;
  greed: number;
  risk: number;
  statue: StatueType;
};

export type Die = {
  id: string;
  value: Face;
  selected: boolean;
  slot: number;
  dieType: DieType;

  // runtime state copied from CustomDie
  memoryStoredValue?: Face | null;
  gamblerChain?: number;
  gamblerMultiplier?: number;
  iceFrozenValue?: Face | null;
  iceConsecutiveKeeps?: number;
  iceGhost?: boolean;
  blockBlockedValue?: Face | null;
};

export type TurnState = {
  rolledDice: Die[];
  bankedDice: Die[];
  availableDice: CustomDie[];
  unscoredTurnPoints: number;
  canContinue: boolean;
  hotDice: boolean;
};

export type Scores = {
  player: number;
  bot: number;
};