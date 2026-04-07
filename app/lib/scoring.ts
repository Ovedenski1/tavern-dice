import { Die, StatueType } from "../types/game";

type ScoreResult = {
  score: number;
  valid: boolean;
};

function sortNumbers(values: number[]) {
  return [...values].sort((a, b) => a - b);
}

function isExactStraightWithJokers(
  naturalValues: number[],
  jokerCount: number,
  target: number[]
) {
  const naturalsSorted = sortNumbers(naturalValues);
  const targetSorted = sortNumbers(target);

  const used = new Set<number>();

  for (const value of naturalsSorted) {
    const index = targetSorted.findIndex((t, i) => t === value && !used.has(i));
    if (index === -1) return false;
    used.add(index);
  }

  return target.length - naturalsSorted.length === jokerCount;
}

function setScore(face: number, count: number) {
  const base = face === 1 ? 1000 : face * 100;
  return base * Math.pow(2, count - 3);
}

function isSpecialJokerFace(die: Die) {
  return die.dieType === "joker" && die.value === 1;
}

function isSpecialDevilFace(die: Die) {
  return die.dieType === "devil" && die.value === 1;
}

function isSpecialHolyFace(die: Die) {
  return die.dieType === "holy" && die.value === 1;
}

function isSpecialMerryFace(die: Die) {
  return die.dieType === "merry" && die.value === 1;
}

function isSpecialSunFace(die: Die) {
  return die.dieType === "sun" && die.value === 1;
}

function isSpecialSunnyFace(die: Die) {
  return die.dieType === "sunny" && die.value === 1;
}

function isSpecialScarFace(die: Die) {
  return die.dieType === "scar" && die.value === 3;
}

function isSpecialGermaFace(die: Die) {
  return die.dieType === "germa" && die.value === 6;
}

function isLuckyCloverFace(die: Die) {
  return die.dieType === "lucky" && die.value === 4;
}

function isHolyThreeCombo(group: Die[]) {
  if (group.length !== 4) return false;

  const holyCount = group.filter((die) => isSpecialHolyFace(die)).length;
  const threes = group.filter(
    (die) => die.value === 3 && !isSpecialHolyFace(die)
  ).length;

  return holyCount === 1 && threes === 3;
}

function isDevilSixCombo(group: Die[]) {
  if (group.length !== 4) return false;

  const devilCount = group.filter((die) => isSpecialDevilFace(die)).length;
  const sixes = group.filter(
    (die) => die.value === 6 && !isSpecialDevilFace(die)
  ).length;

  return devilCount === 1 && sixes === 3;
}

function isSunOneCombo(group: Die[]) {
  if (group.length !== 2) return false;
  const sun = group.filter((die) => isSpecialSunFace(die)).length;
  const ones = group.filter(
    (die) => die.value === 1 && !isSpecialSunFace(die)
  ).length;
  return sun === 1 && ones === 1;
}

function isScarFourCombo(group: Die[]) {
  if (group.length !== 2) return false;
  const scar = group.filter((die) => isSpecialScarFace(die)).length;
  const fours = group.filter(
    (die) => die.value === 4 && !isSpecialScarFace(die)
  ).length;
  return scar === 1 && fours === 1;
}

function isGomuFiveSixCombo(group: Die[], statue: StatueType) {
  if (statue !== "gomgumfruit") return false;
  if (group.length !== 2) return false;

  const jokers = group.filter((die) => isSpecialJokerFace(die)).length;
  if (jokers > 0) return false;

  const hasFive = group.some((die) => die.value === 5);
  const hasSix = group.some((die) => die.value === 6);

  return hasFive && hasSix;
}

function scoreAllPlayableByNika(group: Die[]) {
  let total = 1000;

  for (const die of group) {
    if (die.value === 1) total += 100;
    else if (die.value === 2) total += 20;
    else if (die.value === 3) total += 30;
    else if (die.value === 4) total += 40;
    else if (die.value === 5) total += 50;
    else if (die.value === 6) total += 60;
  }

  return total;
}

function groupScore(group: Die[], statue: StatueType): number | null {
  if (!group.length) return null;

  if (group.some((die) => isSpecialHolyFace(die))) {
    return scoreAllPlayableByNika(group);
  }

  if (isHolyThreeCombo(group)) {
    return 3000;
  }

  if (isDevilSixCombo(group)) {
    return 3000;
  }

  if (isSunOneCombo(group)) {
    return 500;
  }

  if (isScarFourCombo(group)) {
    return 700;
  }

  if (isGomuFiveSixCombo(group, statue)) {
    return 110;
  }

  const devilCount = group.filter((die) => isSpecialDevilFace(die)).length;
  const jokerCount = group.filter((die) => isSpecialJokerFace(die)).length;
  const cloverCount = group.filter((die) => isLuckyCloverFace(die)).length;

  const naturals = group.filter(
    (die) =>
      !isSpecialJokerFace(die) &&
      !isSpecialDevilFace(die) &&
      !isLuckyCloverFace(die)
  );

  const naturalValues = naturals.map((die) => die.value);
  const len = group.length;

  if (devilCount > 0) {
    if (len === 1 && isSpecialDevilFace(group[0])) return 50;
    return null;
  }

  if (len === 1) {
    if (jokerCount > 0) return null;
    if (cloverCount > 0) return null;
    if (isSpecialMerryFace(group[0])) return null;
    if (isSpecialSunFace(group[0])) return null;
    if (isSpecialSunnyFace(group[0])) return 100;
    if (isSpecialScarFace(group[0])) return null;
    if (isSpecialGermaFace(group[0])) return null;

    let base = 0;
    if (naturalValues[0] === 1) base = 100;
    if (naturalValues[0] === 5) base = 50;
    if (base <= 0) return null;

    if (group[0].dieType === "gambler") {
      const mult = Math.max(1, group[0].gamblerMultiplier ?? 1);
      return base * mult;
    }

    return base;
  }

  if (len === 5) {
    if (isExactStraightWithJokers(naturalValues, jokerCount, [1, 2, 3, 4, 5])) {
      return 500;
    }
    if (isExactStraightWithJokers(naturalValues, jokerCount, [2, 3, 4, 5, 6])) {
      return 750;
    }
  }

  if (len === 6) {
    if (isExactStraightWithJokers(naturalValues, jokerCount, [1, 2, 3, 4, 5, 6])) {
      return 1500;
    }
  }

  const germaCount = group.filter((die) => isSpecialGermaFace(die)).length;
  const otherSixCount = group.filter(
    (die) => die.value === 6 && !isSpecialGermaFace(die)
  ).length;

  if (germaCount === 1 && otherSixCount >= 2 && otherSixCount + germaCount === len) {
    let base = 1200;
    if (otherSixCount === 3) base = 2400;
    if (otherSixCount > 3) {
      base = 2400 * Math.pow(2, otherSixCount - 3);
    }
    return base;
  }

  if (len >= 3) {
    for (let face = 1; face <= 6; face++) {
      const allNaturalsMatch = naturalValues.every((value) => value === face);
      const hasAtLeastOneNatural = naturalValues.length > 0;

      if (allNaturalsMatch && hasAtLeastOneNatural) {
        let total = setScore(face, len);

        if (cloverCount > 0 && len >= 2) {
          total *= 4;
        }

        return total;
      }
    }
  }

  return null;
}

export function scoreSelectedDice(
  dice: Die[],
  statue: StatueType = "none"
): ScoreResult {
  if (!dice.length) {
    return { score: 0, valid: false };
  }

  const n = dice.length;
  const memo = new Map<number, number>();

  function solve(mask: number): number {
    if (mask === 0) return 0;
    if (memo.has(mask)) return memo.get(mask)!;

    let best = Number.NEGATIVE_INFINITY;

    for (let submask = mask; submask > 0; submask = (submask - 1) & mask) {
      const group: Die[] = [];
      for (let i = 0; i < n; i++) {
        if (submask & (1 << i)) {
          group.push(dice[i]);
        }
      }

      const score = groupScore(group, statue);
      if (score === null) continue;

      const remaining = mask ^ submask;
      const tail = solve(remaining);
      if (tail !== Number.NEGATIVE_INFINITY) {
        best = Math.max(best, score + tail);
      }
    }

    memo.set(mask, best);
    return best;
  }

  const best = solve((1 << n) - 1);

  if (best === Number.NEGATIVE_INFINITY || best <= 0) {
    return { score: 0, valid: false };
  }

  return { score: best, valid: true };
}

export function findAllScoringSelections(
  dice: Die[],
  statue: StatueType = "none"
) {
  const results: { ids: string[]; score: number }[] = [];
  const n = dice.length;

  for (let mask = 1; mask < (1 << n); mask++) {
    const selection = dice.filter((_, i) => (mask & (1 << i)) !== 0);
    const scored = scoreSelectedDice(selection, statue);

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

export function hasAnyScoringDice(
  dice: Die[],
  statue: StatueType = "none"
) {
  if (dice.length === 1 && isSpecialDevilFace(dice[0])) return false;
  if (dice.length === 1 && isSpecialHolyFace(dice[0])) return true;
  if (dice.length === 1 && isSpecialJokerFace(dice[0])) return false;
  if (dice.length === 1 && isLuckyCloverFace(dice[0])) return false;
  if (dice.length === 1 && isSpecialMerryFace(dice[0])) return false;
  if (dice.length === 1 && isSpecialSunFace(dice[0])) return false;
  if (dice.length === 1 && isSpecialScarFace(dice[0])) return false;
  if (dice.length === 1 && isSpecialGermaFace(dice[0])) return false;
  if (dice.length === 1 && isSpecialSunnyFace(dice[0])) return true;

  return findAllScoringSelections(dice, statue).length > 0;
}

export function canUseDevilPower(rolledDice: Die[], selectedDice: Die[]) {
  if (selectedDice.length !== 1) return false;
  if (!isSpecialDevilFace(selectedDice[0])) return false;

  if (rolledDice.length === 1 && isSpecialDevilFace(rolledDice[0])) {
    return false;
  }

  const nonDevilDice = rolledDice.filter((die) => !isSpecialDevilFace(die));
  return !hasAnyScoringDice(nonDevilDice);
}