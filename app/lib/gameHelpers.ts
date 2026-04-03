import { CustomDie, Die, PlayerSide } from "../types/game";

export function createDieTemplate(
  slot: number,
  type: CustomDie["type"] = "normal"
): CustomDie {
  return {
    slot,
    type,
    memoryStoredValue: null,
    gamblerChain: 0,
    iceFrozenValue: null,
    iceConsecutiveKeeps: 0,
    iceGhost: false,
    blockBlockedValue: null,
  };
}

export function createNormalDiceSet(): CustomDie[] {
  return Array.from({ length: 6 }, (_, i) => createDieTemplate(i, "normal"));
}

export function cloneCustomDiceLocal(dice: CustomDie[]): CustomDie[] {
  return dice.map((die) => ({ ...die }));
}

export function customDieFromDie(die: Die): CustomDie {
  return {
    slot: die.slot,
    type: die.dieType,
    memoryStoredValue: die.memoryStoredValue ?? null,
    gamblerChain: die.gamblerChain ?? 0,
    iceFrozenValue: die.iceFrozenValue ?? null,
    iceConsecutiveKeeps: die.iceConsecutiveKeeps ?? 0,
    iceGhost: die.iceGhost ?? false,
    blockBlockedValue: die.blockBlockedValue ?? null,
  };
}

export function resetTurnRuntimeState(die: CustomDie): CustomDie {
  return {
    ...die,
    gamblerChain: 0,
    iceFrozenValue: null,
    iceConsecutiveKeeps: 0,
    iceGhost: false,
    blockBlockedValue: null,
  };
}

export function resetBankedDieRuntimeState(die: Die): Die {
  return {
    ...die,
    selected: false,
    gamblerChain: 0,
    gamblerMultiplier: 1,
    iceFrozenValue: null,
    iceConsecutiveKeeps: 0,
    iceGhost: false,
    blockBlockedValue: die.blockBlockedValue ?? null,
  };
}

export function rebuildHotDiceAvailable(
  allDice: Die[],
  side: PlayerSide,
  customDice: CustomDie[]
) {
  if (side === "bot") {
    return createNormalDiceSet();
  }

  return cloneCustomDiceLocal(customDice).map((die) =>
    resetTurnRuntimeState({
      ...die,
      memoryStoredValue: die.memoryStoredValue ?? null,
      gamblerChain: 0,
      iceFrozenValue: null,
      iceConsecutiveKeeps: 0,
      iceGhost: false,
      blockBlockedValue: null,
    })
  );
}

export function finalizeRemainingDiceForNextRoll(left: Die[]) {
  const nextAvailableDice: CustomDie[] = [];
  let iceBonus = 0;

  for (const die of left) {
    if (die.dieType === "ice") {
      const keepCount = die.iceConsecutiveKeeps ?? 0;

      if (keepCount >= 1) {
        iceBonus += 200;
        continue;
      }

      nextAvailableDice.push({
        ...customDieFromDie(die),
        iceFrozenValue: die.value,
        iceConsecutiveKeeps: 1,
        iceGhost: true,
      });
      continue;
    }

    if (die.dieType === "gambler") {
      nextAvailableDice.push({
        ...customDieFromDie(die),
        gamblerChain: left.length === 1 ? die.gamblerChain ?? 0 : 0,
      });
      continue;
    }

    if (die.dieType === "block") {
      nextAvailableDice.push({
        ...customDieFromDie(die),
        blockBlockedValue: die.value,
      });
      continue;
    }

    nextAvailableDice.push(customDieFromDie(die));
  }

  return { nextAvailableDice, iceBonus };
}

export function isSpecialHolyFace(die: Die) {
  return die.dieType === "holy" && die.value === 1;
}

export function isSpecialDevilFace(die: Die) {
  return die.dieType === "devil" && die.value === 1;
}

export function isDevilSixCombo(dice: Die[]) {
  if (dice.length !== 4) return false;

  const devilCount = dice.filter((die) => isSpecialDevilFace(die)).length;
  const sixCount = dice.filter(
    (die) => die.value === 6 && !isSpecialDevilFace(die)
  ).length;

  return devilCount === 1 && sixCount === 3;
}