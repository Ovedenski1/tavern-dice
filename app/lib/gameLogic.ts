import { Bot, Die } from "../types/game";
import { uid } from "./utils";

type ScoreResult = {
  score: number;
  valid: boolean;
};

export function rollDice(count: number): Die[] {
  return Array.from({ length: count }, () => ({
    id: uid(),
    value: (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6,
    selected: false,
  }));
}

export function countValues(values: number[]) {
  const counts: Record<number, number> = {};
  for (const v of values) counts[v] = (counts[v] || 0) + 1;
  return counts;
}

function sortNumbers(values: number[]) {
  return [...values].sort((a, b) => a - b);
}

function matchesExact(values: number[], target: number[]) {
  const a = sortNumbers(values);
  const b = sortNumbers(target);

  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

/**
 * Rules implemented from the visible screenshot:
 *
 * Singles:
 * - 1 = 100
 * - 5 = 50
 *
 * Straights / runs:
 * - 1,2,3,4,5 = 500
 * - 2,3,4,5,6 = 750
 * - 1,2,3,4,5,6 = 1500
 *
 * Sets:
 * - 111 = 1000
 * - 222 = 200
 * - 333 = 300
 * - 444 = 400
 * - 555 = 500
 * - 666 = 600
 *
 * For 4/5/6 of a kind:
 * each additional die after 3 doubles the value
 *
 * Examples:
 * - 2222 = 400
 * - 22222 = 800
 * - 222222 = 1600
 * - 1111 = 2000
 * - 11111 = 4000
 * - 111111 = 8000
 *
 * Mixed scoring combinations are additive as long as every selected die
 * belongs to a scoring pattern.
 */
export function scoreSelectedDice(values: number[]): ScoreResult {
  if (!values.length) {
    return { score: 0, valid: false };
  }

  const sorted = sortNumbers(values);

  // Exact straight / run combinations from the screenshot
  if (matchesExact(sorted, [1, 2, 3, 4, 5])) {
    return { score: 500, valid: true };
  }

  if (matchesExact(sorted, [2, 3, 4, 5, 6])) {
    return { score: 750, valid: true };
  }

  if (matchesExact(sorted, [1, 2, 3, 4, 5, 6])) {
    return { score: 1500, valid: true };
  }

  const counts = countValues(values);
  let score = 0;
  let used = 0;

  // 3+ of a kind
  for (let face = 1; face <= 6; face++) {
    const count = counts[face] || 0;

    if (count >= 3) {
      const base = face === 1 ? 1000 : face * 100;
      const extraDice = count - 3;
      const comboScore = base * Math.pow(2, extraDice);

      score += comboScore;
      used += count;
      counts[face] = 0;
    }
  }

  // Remaining single 1s
  if ((counts[1] || 0) > 0) {
    score += counts[1] * 100;
    used += counts[1];
    counts[1] = 0;
  }

  // Remaining single 5s
  if ((counts[5] || 0) > 0) {
    score += counts[5] * 50;
    used += counts[5];
    counts[5] = 0;
  }

  const valid = used === values.length && score > 0;
  return { score, valid };
}

export function findAllScoringSelections(dice: Die[]) {
  const results: { ids: string[]; score: number }[] = [];
  const n = dice.length;

  for (let mask = 1; mask < (1 << n); mask++) {
    const selection = dice.filter((_, i) => (mask & (1 << i)) !== 0);
    const values = selection.map((d) => d.value);
    const scored = scoreSelectedDice(values);

    if (scored.valid) {
      results.push({
        ids: selection.map((d) => d.id),
        score: scored.score,
      });
    }
  }

  const unique = new Map<string, { ids: string[]; score: number }>();

  for (const result of results) {
    const key = result.ids.slice().sort().join("|");
    if (!unique.has(key)) {
      unique.set(key, result);
    }
  }

  return [...unique.values()].sort(
    (a, b) => b.score - a.score || a.ids.length - b.ids.length
  );
}

export function hasAnyScoringDice(dice: Die[]) {
  return findAllScoringSelections(dice).length > 0;
}

export function bestBotSelection(
  dice: Die[],
  bot: Bot,
  currentTurnPoints: number,
  botTotal: number,
  playerTotal: number
) {
  const options = findAllScoringSelections(dice);
  if (!options.length) return null;

  const target = bot.target;
  const behind = playerTotal - botTotal > target * 0.15;

  const scored = options
    .map((opt) => {
      const remaining = dice.length - opt.ids.length;
      const hotDiceBonus = remaining === 0 ? 220 : 0;
      const safetyPenalty = remaining <= 1 ? 90 : remaining <= 2 ? 40 : 0;
      const catchupBonus = behind ? opt.score * 0.16 : 0;
      const greedBonus = opt.score * bot.greed;
      const projected = botTotal + currentTurnPoints + opt.score;
      const finishBonus = projected >= target ? 10000 : 0;

      const value =
        opt.score +
        hotDiceBonus +
        greedBonus +
        catchupBonus +
        finishBonus -
        safetyPenalty;

      return { ...opt, value };
    })
    .sort((a, b) => b.value - a.value);

  return scored[0];
}

export function shouldBotRollAgain(
  bot: Bot,
  turnPoints: number,
  remainingDice: number,
  botTotal: number,
  playerTotal: number
) {
  const target = bot.target;

  if (botTotal + turnPoints >= target) return false;
  if (remainingDice === 0) return true;

  const behind = playerTotal > botTotal;
  const progress = (botTotal + turnPoints) / target;

  let threshold = 250;
  if (target === 4000) threshold = 450;
  if (target === 8000) threshold = 700;

  if (behind) threshold += 100;
  if (progress > 0.75) threshold -= 120;
  if (remainingDice <= 2) threshold += 130;
  if (remainingDice >= 4) threshold -= 70;

  const randomBias = Math.floor((Math.random() - 0.5) * 180 * (1 + bot.risk));
  return turnPoints < threshold + randomBias;
}