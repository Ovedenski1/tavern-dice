import { CustomDie, Die, Face, StatueType } from "../types/game";
import { uid } from "./utils";

type RollOutcome = {
  value: Face;
  effectiveType: CustomDie["type"];
  memoryStoredValue: CustomDie["memoryStoredValue"];
  gamblerChain: number;
  gamblerMultiplier: number;
  iceFrozenValue: CustomDie["iceFrozenValue"];
  iceConsecutiveKeeps: number;
  iceGhost: boolean;
  blockBlockedValue: CustomDie["blockBlockedValue"];
  lostMissing: boolean;
  lostBorrowedThisTurn: boolean;
  lostReturnAfterOwnerNextTurn: boolean;
  destroyed: boolean;
  germaLoopCarry: boolean;
};

function weightedRandom(entries: Array<{ value: Face; weight: number }>): Face {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;

  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) return entry.value;
  }

  return entries[entries.length - 1].value;
}

function uniqueFaces(values: Array<Face | null | undefined>): Face[] {
  return [...new Set(values.filter((v): v is Face => v != null))];
}

function applyStatuePassiveWeights(
  entries: Array<{ value: Face; weight: number }>,
  statue: StatueType
) {
  if (statue === "gomgumfruit") {
    return entries.map((entry) => {
      if (entry.value === 5 || entry.value === 6) {
        return { ...entry, weight: entry.weight * 1.08 };
      }
      return entry;
    });
  }

  if (statue === "cursemark") {
    return entries.map((entry) =>
      entry.value === 6 ? { ...entry, weight: entry.weight * 1.1 } : entry
    );
  }

  return entries;
}

function rollAllowedFace(blockedFaces: Face[], statue: StatueType): Face {
  const entries = applyStatuePassiveWeights(
    [
      { value: 1, weight: 1 },
      { value: 2, weight: 1 },
      { value: 3, weight: 1 },
      { value: 4, weight: 1 },
      { value: 5, weight: 1 },
      { value: 6, weight: 1 },
    ],
    statue
  ).filter((entry) => !blockedFaces.includes(entry.value));

  if (entries.length === 0) {
    return (Math.floor(Math.random() * 6) + 1) as Face;
  }

  return weightedRandom(entries);
}

function weightedRandomAllowed(
  entries: Array<{ value: Face; weight: number }>,
  blockedFaces: Face[],
  statue: StatueType
): Face {
  const filtered = applyStatuePassiveWeights(entries, statue).filter(
    (entry) => !blockedFaces.includes(entry.value)
  );

  if (filtered.length === 0) {
    return rollAllowedFace([], statue);
  }

  return weightedRandom(filtered);
}

function rollStandardFace(blockedFaces: Face[] = [], statue: StatueType = "none"): Face {
  return rollAllowedFace(blockedFaces, statue);
}

function rollBasicFaceForType(
  type: CustomDie["type"],
  blockedFaces: Face[] = [],
  statue: StatueType = "none"
): Face {
  switch (type) {
    case "wooden":
      return weightedRandomAllowed(
        [
          { value: 1, weight: 18 },
          { value: 2, weight: 18 },
          { value: 3, weight: 40 },
          { value: 4, weight: 8 },
          { value: 5, weight: 8 },
          { value: 6, weight: 8 },
        ],
        blockedFaces,
        statue
      );

    case "lucky":
      return weightedRandomAllowed(
        [
          { value: 1, weight: 26 },
          { value: 2, weight: 10 },
          { value: 3, weight: 10 },
          { value: 4, weight: 9 },
          { value: 5, weight: 26 },
          { value: 6, weight: 9 },
        ],
        blockedFaces,
        statue
      );

    case "unlucky":
      return weightedRandomAllowed(
        [
          { value: 1, weight: 12 },
          { value: 2, weight: 30 },
          { value: 3, weight: 18 },
          { value: 4, weight: 18 },
          { value: 5, weight: 12 },
          { value: 6, weight: 10 },
        ],
        blockedFaces,
        statue
      );

    case "unbalanced":
      return weightedRandomAllowed(
        [
          { value: 1, weight: 30 },
          { value: 2, weight: 30 },
          { value: 3, weight: 8 },
          { value: 4, weight: 8 },
          { value: 5, weight: 16 },
          { value: 6, weight: 8 },
        ],
        blockedFaces,
        statue
      );

    case "odd":
      return weightedRandomAllowed(
        [
          { value: 1, weight: 24 },
          { value: 2, weight: 9 },
          { value: 3, weight: 24 },
          { value: 4, weight: 9 },
          { value: 5, weight: 24 },
          { value: 6, weight: 10 },
        ],
        blockedFaces,
        statue
      );

    case "misfortune":
      return weightedRandomAllowed(
        [
          { value: 1, weight: 8 },
          { value: 2, weight: 23 },
          { value: 3, weight: 23 },
          { value: 4, weight: 23 },
          { value: 5, weight: 8 },
          { value: 6, weight: 15 },
        ],
        blockedFaces,
        statue
      );

    case "middle":
      return weightedRandomAllowed(
        [
          { value: 1, weight: 6 },
          { value: 2, weight: 22 },
          { value: 3, weight: 22 },
          { value: 4, weight: 22 },
          { value: 5, weight: 22 },
          { value: 6, weight: 6 },
        ],
        blockedFaces,
        statue
      );

    case "lost":
      return weightedRandomAllowed(
        [
          { value: 1, weight: 1 },
          { value: 2, weight: 1 },
          { value: 3, weight: 1.25 },
          { value: 4, weight: 1 },
          { value: 5, weight: 1 },
          { value: 6, weight: 1 },
        ],
        blockedFaces,
        statue
      );

    case "holy":
      return weightedRandomAllowed(
        [
          { value: 1, weight: 0.55 },
          { value: 2, weight: 1.1 },
          { value: 3, weight: 1.1 },
          { value: 4, weight: 1.1 },
          { value: 5, weight: 1.1 },
          { value: 6, weight: 1.1 },
        ],
        blockedFaces,
        statue
      );

    case "merry":
    case "sun":
    case "scar":
    case "germa":
    case "sunny":
    case "chopper":
    case "gambler":
    case "memory":
    case "ice":
    case "block":
    case "devil":
    case "joker":
    case "normal":
    default:
      return rollStandardFace(blockedFaces, statue);
  }
}

function randomVoidTargetType(): CustomDie["type"] {
  const pool: CustomDie["type"][] = [
    "normal",
    "lucky",
    "wooden",
    "joker",
    "unlucky",
    "unbalanced",
    "odd",
    "misfortune",
    "devil",
    "holy",
    "gambler",
    "memory",
    "ice",
    "block",
    "middle",
    "lost",
    "merry",
    "sun",
    "scar",
    "germa",
    "sunny",
    "chopper",
  ];

  return pool[Math.floor(Math.random() * pool.length)];
}

function rollResolvedDie(
  resolvedType: CustomDie["type"],
  customDie: CustomDie,
  diceSetLength: number,
  blockedFaces: Face[],
  statue: StatueType
): RollOutcome {
  if (customDie.destroyed) {
    return {
      value: 1,
      effectiveType: resolvedType,
      memoryStoredValue: customDie.memoryStoredValue ?? null,
      gamblerChain: 0,
      gamblerMultiplier: 1,
      iceFrozenValue: customDie.iceFrozenValue ?? null,
      iceConsecutiveKeeps: customDie.iceConsecutiveKeeps ?? 0,
      iceGhost: customDie.iceGhost ?? false,
      blockBlockedValue: customDie.blockBlockedValue ?? null,
      lostMissing: customDie.lostMissing ?? false,
      lostBorrowedThisTurn: customDie.lostBorrowedThisTurn ?? false,
      lostReturnAfterOwnerNextTurn: customDie.lostReturnAfterOwnerNextTurn ?? false,
      destroyed: true,
      germaLoopCarry: false,
    };
  }

  if (resolvedType === "lost") {
    const disappears = Math.random() < 0.05;

    if (disappears && !customDie.lostBorrowedThisTurn) {
      return {
        value: 1,
        effectiveType: "lost",
        memoryStoredValue: customDie.memoryStoredValue ?? null,
        gamblerChain: 0,
        gamblerMultiplier: 1,
        iceFrozenValue: customDie.iceFrozenValue ?? null,
        iceConsecutiveKeeps: customDie.iceConsecutiveKeeps ?? 0,
        iceGhost: customDie.iceGhost ?? false,
        blockBlockedValue: customDie.blockBlockedValue ?? null,
        lostMissing: true,
        lostBorrowedThisTurn: false,
        lostReturnAfterOwnerNextTurn: false,
        destroyed: false,
        germaLoopCarry: false,
      };
    }

    return {
      value: rollBasicFaceForType("lost", blockedFaces, statue),
      effectiveType: "lost",
      memoryStoredValue: customDie.memoryStoredValue ?? null,
      gamblerChain: 0,
      gamblerMultiplier: 1,
      iceFrozenValue: customDie.iceFrozenValue ?? null,
      iceConsecutiveKeeps: customDie.iceConsecutiveKeeps ?? 0,
      iceGhost: customDie.iceGhost ?? false,
      blockBlockedValue: customDie.blockBlockedValue ?? null,
      lostMissing: false,
      lostBorrowedThisTurn: customDie.lostBorrowedThisTurn ?? false,
      lostReturnAfterOwnerNextTurn: customDie.lostReturnAfterOwnerNextTurn ?? false,
      destroyed: false,
      germaLoopCarry: false,
    };
  }

  if (resolvedType === "memory") {
    const stored = customDie.memoryStoredValue ?? null;

    if (stored === null) {
      const firstRoll = rollStandardFace(blockedFaces, statue);
      return {
        value: firstRoll,
        effectiveType: "memory",
        memoryStoredValue: firstRoll,
        gamblerChain: customDie.gamblerChain ?? 0,
        gamblerMultiplier: 1,
        iceFrozenValue: customDie.iceFrozenValue ?? null,
        iceConsecutiveKeeps: customDie.iceConsecutiveKeeps ?? 0,
        iceGhost: customDie.iceGhost ?? false,
        blockBlockedValue: customDie.blockBlockedValue ?? null,
        lostMissing: customDie.lostMissing ?? false,
        lostBorrowedThisTurn: customDie.lostBorrowedThisTurn ?? false,
        lostReturnAfterOwnerNextTurn: customDie.lostReturnAfterOwnerNextTurn ?? false,
        destroyed: false,
        germaLoopCarry: false,
      };
    }

    const canReuseStored = !blockedFaces.includes(stored);
    const repeat = Math.random() < 0.9;

    if (repeat && canReuseStored) {
      return {
        value: stored,
        effectiveType: "memory",
        memoryStoredValue: stored,
        gamblerChain: customDie.gamblerChain ?? 0,
        gamblerMultiplier: 1,
        iceFrozenValue: customDie.iceFrozenValue ?? null,
        iceConsecutiveKeeps: customDie.iceConsecutiveKeeps ?? 0,
        iceGhost: customDie.iceGhost ?? false,
        blockBlockedValue: customDie.blockBlockedValue ?? null,
        lostMissing: customDie.lostMissing ?? false,
        lostBorrowedThisTurn: customDie.lostBorrowedThisTurn ?? false,
        lostReturnAfterOwnerNextTurn: customDie.lostReturnAfterOwnerNextTurn ?? false,
        destroyed: false,
        germaLoopCarry: false,
      };
    }

    const rerolled = rollStandardFace(blockedFaces, statue);
    return {
      value: rerolled,
      effectiveType: "memory",
      memoryStoredValue: rerolled,
      gamblerChain: customDie.gamblerChain ?? 0,
      gamblerMultiplier: 1,
      iceFrozenValue: customDie.iceFrozenValue ?? null,
      iceConsecutiveKeeps: customDie.iceConsecutiveKeeps ?? 0,
      iceGhost: customDie.iceGhost ?? false,
      blockBlockedValue: customDie.blockBlockedValue ?? null,
      lostMissing: customDie.lostMissing ?? false,
      lostBorrowedThisTurn: customDie.lostBorrowedThisTurn ?? false,
      lostReturnAfterOwnerNextTurn: customDie.lostReturnAfterOwnerNextTurn ?? false,
      destroyed: false,
      germaLoopCarry: false,
    };
  }

  if (resolvedType === "ice") {
    const frozenValue = customDie.iceFrozenValue ?? null;
    const keepCount = customDie.iceConsecutiveKeeps ?? 0;
    const canUseFrozen = frozenValue !== null && !blockedFaces.includes(frozenValue);
    const rolledValue = canUseFrozen
      ? frozenValue
      : rollStandardFace(blockedFaces, statue);

    return {
      value: rolledValue,
      effectiveType: "ice",
      memoryStoredValue: customDie.memoryStoredValue ?? null,
      gamblerChain: customDie.gamblerChain ?? 0,
      gamblerMultiplier: 1,
      iceFrozenValue: canUseFrozen ? frozenValue : null,
      iceConsecutiveKeeps: keepCount,
      iceGhost: keepCount >= 1 || Boolean(customDie.iceGhost),
      blockBlockedValue: customDie.blockBlockedValue ?? null,
      lostMissing: customDie.lostMissing ?? false,
      lostBorrowedThisTurn: customDie.lostBorrowedThisTurn ?? false,
      lostReturnAfterOwnerNextTurn: customDie.lostReturnAfterOwnerNextTurn ?? false,
      destroyed: false,
      germaLoopCarry: false,
    };
  }

  if (resolvedType === "gambler") {
    const value = rollStandardFace(blockedFaces, statue);
    const eligible = diceSetLength === 1;
    const playable = value === 1 || value === 5;
    const previousChain = customDie.gamblerChain ?? 0;

    if (eligible && playable) {
      return {
        value,
        effectiveType: "gambler",
        memoryStoredValue: customDie.memoryStoredValue ?? null,
        gamblerChain: Math.min(previousChain + 1, 4),
        gamblerMultiplier: Math.min(previousChain + 2, 5),
        iceFrozenValue: customDie.iceFrozenValue ?? null,
        iceConsecutiveKeeps: customDie.iceConsecutiveKeeps ?? 0,
        iceGhost: customDie.iceGhost ?? false,
        blockBlockedValue: customDie.blockBlockedValue ?? null,
        lostMissing: customDie.lostMissing ?? false,
        lostBorrowedThisTurn: customDie.lostBorrowedThisTurn ?? false,
        lostReturnAfterOwnerNextTurn: customDie.lostReturnAfterOwnerNextTurn ?? false,
        destroyed: false,
        germaLoopCarry: false,
      };
    }

    return {
      value,
      effectiveType: "gambler",
      memoryStoredValue: customDie.memoryStoredValue ?? null,
      gamblerChain: 0,
      gamblerMultiplier: 1,
      iceFrozenValue: customDie.iceFrozenValue ?? null,
      iceConsecutiveKeeps: customDie.iceConsecutiveKeeps ?? 0,
      iceGhost: customDie.iceGhost ?? false,
      blockBlockedValue: customDie.blockBlockedValue ?? null,
      lostMissing: customDie.lostMissing ?? false,
      lostBorrowedThisTurn: customDie.lostBorrowedThisTurn ?? false,
      lostReturnAfterOwnerNextTurn: customDie.lostReturnAfterOwnerNextTurn ?? false,
      destroyed: false,
      germaLoopCarry: false,
    };
  }

  if (resolvedType === "block") {
    const value = rollStandardFace(blockedFaces, statue);

    return {
      value,
      effectiveType: "block",
      memoryStoredValue: customDie.memoryStoredValue ?? null,
      gamblerChain: 0,
      gamblerMultiplier: 1,
      iceFrozenValue: customDie.iceFrozenValue ?? null,
      iceConsecutiveKeeps: customDie.iceConsecutiveKeeps ?? 0,
      iceGhost: customDie.iceGhost ?? false,
      blockBlockedValue: value,
      lostMissing: customDie.lostMissing ?? false,
      lostBorrowedThisTurn: customDie.lostBorrowedThisTurn ?? false,
      lostReturnAfterOwnerNextTurn: customDie.lostReturnAfterOwnerNextTurn ?? false,
      destroyed: false,
      germaLoopCarry: false,
    };
  }

  return {
    value: rollBasicFaceForType(resolvedType, blockedFaces, statue),
    effectiveType: resolvedType,
    memoryStoredValue: customDie.memoryStoredValue ?? null,
    gamblerChain: 0,
    gamblerMultiplier: 1,
    iceFrozenValue: customDie.iceFrozenValue ?? null,
    iceConsecutiveKeeps: customDie.iceConsecutiveKeeps ?? 0,
    iceGhost: customDie.iceGhost ?? false,
    blockBlockedValue: customDie.blockBlockedValue ?? null,
    lostMissing: customDie.lostMissing ?? false,
    lostBorrowedThisTurn: customDie.lostBorrowedThisTurn ?? false,
    lostReturnAfterOwnerNextTurn: customDie.lostReturnAfterOwnerNextTurn ?? false,
    destroyed: customDie.destroyed ?? false,
    germaLoopCarry: customDie.germaLoopCarry ?? false,
  };
}

function rollFaceForCustomDie(
  customDie: CustomDie,
  diceSetLength: number,
  blockedFaces: Face[],
  statue: StatueType
): RollOutcome {
  if (customDie.type === "void") {
    const transformedType = randomVoidTargetType();
    return rollResolvedDie(
      transformedType,
      customDie,
      diceSetLength,
      blockedFaces,
      statue
    );
  }

  return rollResolvedDie(customDie.type, customDie, diceSetLength, blockedFaces, statue);
}

export function rollDice(
  diceSet: CustomDie[],
  statue: StatueType = "none"
): Die[] {
  const activeDice = diceSet.filter((die) => !die.destroyed && !die.lostMissing);

  const blockedFaces = uniqueFaces(
    activeDice
      .filter((die) => die.type === "block")
      .map((die) => die.blockBlockedValue ?? null)
  );

  return activeDice.map((customDie) => {
    const rolled = rollFaceForCustomDie(
      customDie,
      activeDice.length,
      blockedFaces,
      statue
    );

    return {
      id: uid(),
      value: rolled.value,
      selected: false,
      slot: customDie.slot,
      dieType: rolled.effectiveType,
      memoryStoredValue: rolled.memoryStoredValue,
      gamblerChain: rolled.gamblerChain,
      gamblerMultiplier: rolled.gamblerMultiplier,
      iceFrozenValue: rolled.iceFrozenValue,
      iceConsecutiveKeeps: rolled.iceConsecutiveKeeps,
      iceGhost: rolled.iceGhost,
      blockBlockedValue: rolled.blockBlockedValue,
      lostMissing: rolled.lostMissing,
      lostBorrowedThisTurn: rolled.lostBorrowedThisTurn,
      lostReturnAfterOwnerNextTurn: rolled.lostReturnAfterOwnerNextTurn,
      destroyed: rolled.destroyed,
      germaLoopCarry: rolled.germaLoopCarry,
    };
  });
}