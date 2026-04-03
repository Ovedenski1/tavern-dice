
import { Die } from "../../types/game";
import { findAllScoringSelections } from "../scoring";

type BotPick = {
  ids: string[];
  score: number;
};

export function bestChopperSelection(
  dice: Die[],
  currentTurnPoints: number,
  botTotal: number,
  playerTotal: number,
  target: number
): BotPick | null {
  const options = findAllScoringSelections(dice);
  if (!options.length) return null;

  const best = [...options].sort((a, b) => b.score - a.score || b.ids.length - a.ids.length)[0];

  // Chopper sometimes forgets an extra valid die/combo.
  const forgetfulOption = [...options]
    .filter(
      (opt) =>
        opt.score < best.score &&
        opt.ids.length < best.ids.length
    )
    .sort((a, b) => a.score - b.score || a.ids.length - b.ids.length)[0];

  if (forgetfulOption && Math.random() < 0.45) {
    return forgetfulOption;
  }

  const behind = playerTotal > botTotal;

  const scored = options
    .map((opt) => {
      const remaining = dice.length - opt.ids.length;
      const projected = botTotal + currentTurnPoints + opt.score;
      const finishBonus = projected >= target ? 10000 : 0;
      const panicBonus = behind ? opt.score * 0.05 : 0;

      let safetyAdjust = 0;
      if (remaining >= 4) safetyAdjust += 50;
      else if (remaining === 3) safetyAdjust += 5;
      else if (remaining === 2) safetyAdjust -= 150;
      else if (remaining === 1) safetyAdjust -= 240;
      else if (remaining === 0) safetyAdjust += 120;

      const value =
        opt.score * 0.96 +
        finishBonus +
        panicBonus +
        safetyAdjust;

      return { ...opt, value };
    })
    .sort((a, b) => b.value - a.value);

  return scored[0];
}

export function shouldChopperRollAgain(
  turnPoints: number,
  remainingDice: number,
  botTotal: number,
  playerTotal: number,
  target: number
) {
  if (botTotal + turnPoints >= target) return false;
  if (remainingDice === 0) return true;

  // Chopper is safe and weak.
  if (remainingDice <= 1) {
    return turnPoints < 80 && Math.random() < 0.03;
  }

  if (remainingDice === 2) {
    return turnPoints < 120 && Math.random() < 0.06;
  }

  if (remainingDice === 3) {
    return turnPoints < 160 && Math.random() < 0.12;
  }

  if (remainingDice >= 4) {
    let threshold = 260;
    if (playerTotal > botTotal) threshold += 40;
    return turnPoints < threshold;
  }

  return false;
}

export function shouldChopperUseStatue(
  currentTurnPoints: number,
  remainingDice: number,
  rumbleBallUsesLeft: number,
  rumbleBallActiveThisTurn: boolean
) {
  if (rumbleBallUsesLeft <= 0 || rumbleBallActiveThisTurn) return false;

  if (remainingDice <= 3 && currentTurnPoints >= 120) return Math.random() < 0.8;
  if (currentTurnPoints >= 250) return Math.random() < 0.55;

  return false;
}
