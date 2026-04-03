import { Die } from "../../types/game";
import { findAllScoringSelections } from "../scoring";

type BotPick = {
  ids: string[];
  score: number;
};

export function bestFrankySelection(
  dice: Die[],
  currentTurnPoints: number,
  botTotal: number,
  playerTotal: number,
  target: number
): BotPick | null {
  const options = findAllScoringSelections(dice);
  if (!options.length) return null;

  const behind = playerTotal > botTotal;

  const oneOnly = options.find((opt) => opt.score === 100 && opt.ids.length === 1);
  const oneAndFive = options.find((opt) => opt.score === 150 && opt.ids.length === 2);
  const largeComboExists = options.some((opt) => opt.ids.length >= 3);

  // Franky sometimes greedily keeps only the 1 to fish for something better than the 5.
  if (
    dice.length === 6 &&
    oneOnly &&
    oneAndFive &&
    !largeComboExists &&
    currentTurnPoints < 700 &&
    Math.random() < 0.34
  ) {
    return oneOnly;
  }

  const scored = options
    .map((opt) => {
      const remaining = dice.length - opt.ids.length;
      const projected = botTotal + currentTurnPoints + opt.score;

      const finishBonus = projected >= target ? 10000 : 0;
      const catchupBonus = behind ? opt.score * 0.12 : 0;
      const comboBonus = opt.ids.length >= 3 ? 90 : 0;

      let riskAdjust = 0;
      if (remaining === 0) riskAdjust += 260;
      else if (remaining >= 4) riskAdjust += 80;
      else if (remaining === 3) riskAdjust += 25;
      else if (remaining === 2) riskAdjust -= 120;
      else if (remaining === 1) riskAdjust -= 190;

      const value =
        opt.score * 1.18 +
        finishBonus +
        catchupBonus +
        comboBonus +
        riskAdjust;

      return { ...opt, value };
    })
    .sort((a, b) => b.value - a.value);

  return scored[0];
}

export function shouldFrankyRollAgain(
  turnPoints: number,
  remainingDice: number,
  botTotal: number,
  playerTotal: number,
  target: number
) {
  if (botTotal + turnPoints >= target) return false;
  if (remainingDice === 0) return true;

  const behind = playerTotal > botTotal;
  const farBehind = playerTotal - botTotal > target * 0.2;

  if (remainingDice === 1) {
    if (turnPoints < 250) return Math.random() < 0.16;
    return false;
  }

  if (remainingDice === 2) {
    if (turnPoints < 250) return Math.random() < 0.52;
    if (turnPoints < 550) return Math.random() < 0.32;
    if (turnPoints < 900) return Math.random() < 0.14;
    return false;
  }

  if (remainingDice === 3) {
    if (turnPoints < 300) return true;
    if (turnPoints < 700) return Math.random() < 0.62;
    if (turnPoints < 1100) return Math.random() < 0.35;
    return false;
  }

  if (remainingDice >= 4) {
    let threshold = 850;
    if (behind) threshold += 80;
    if (farBehind) threshold += 120;
    return turnPoints < threshold;
  }

  return false;
}

export function shouldFrankyUseStatue(
  currentTurnPoints: number,
  remainingDice: number,
  botTotal: number,
  playerTotal: number,
  target: number,
  colaUsed: boolean,
  colaBuffTurns: number
) {
  if (colaUsed || colaBuffTurns > 0) return false;

  const behind = playerTotal > botTotal;

  if (currentTurnPoints >= 500) return true;
  if (behind && currentTurnPoints >= 350) return true;
  if (remainingDice <= 3 && currentTurnPoints >= 300) return true;
  if (botTotal < target * 0.55 && currentTurnPoints >= 400) return true;

  return false;
}