import { StatueType } from "../types/game";

export const STATUE_OPTIONS: { value: StatueType; label: string; description: string }[] = [
  {
    value: "none",
    label: "No Item",
    description: "Play without an equipped item.",
  },
  {
    value: "cola",
    label: "Cola",
    description:
      "Active: for the next 3 turns, banked points are increased by 50%, but busting loses 150% of your current bankable points from your total score. Can be used once per game.",
  },
  {
    value: "gomgumfruit",
    label: "Gom Gum Fruit",
    description:
      "Passive: slightly increases the chance to roll 5 and 6, and 5 + 6 becomes a valid 110-point combo. Active: reroll one selected die. Can be used every 5 player turns.",
  },
  {
    value: "rumbleball",
    label: "Rumble Ball",
    description:
      "Active: for this turn, if you bust, you keep 50% of your current bankable points. Can be used 3 times per game.",
  },
  {
    value: "cursemark",
    label: "Curse Mark",
    description:
      "Passive: slightly increases the chance to roll 6. Active: doubles your current bankable points and banks them immediately. Can be used once per game.",
  },
];

export function getStatueImage(statue: StatueType) {
  if (statue === "none") return null;
  return `/statues/${statue}.png`;
}

export function getStatueLabel(statue: StatueType) {
  switch (statue) {
    case "cola":
      return "Cola";
    case "gomgumfruit":
      return "Gom Gum Fruit";
    case "rumbleball":
      return "Rumble Ball";
    case "cursemark":
      return "Curse Mark";
    default:
      return "No Item";
  }
}