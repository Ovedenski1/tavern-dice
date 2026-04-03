"use client";

import Button from "../ui/Button";
import Panel from "../ui/Panel";
import DieFace from "./DieFace";
import { CustomDie, DieType, Face, StatueType } from "../../types/game";
import { STATUE_OPTIONS } from "../../lib/statues";

type Props = {
  dice: CustomDie[];
  setDice: React.Dispatch<React.SetStateAction<CustomDie[]>>;
  selectedStatue: StatueType;
  setSelectedStatue: React.Dispatch<React.SetStateAction<StatueType>>;
  onBack: () => void;
};

const OPTIONS: { value: DieType; label: string }[] = [
  { value: "normal", label: "Normal Die" },
  { value: "lucky", label: "Lucky Die" },
  { value: "wooden", label: "Wooden Die" },
  { value: "joker", label: "Joker Die" },
  { value: "unlucky", label: "Unlucky Die" },
  { value: "unbalanced", label: "Unbalanced Die" },
  { value: "odd", label: "Odd Die" },
  { value: "misfortune", label: "Misfortune Die" },
  { value: "devil", label: "Devil Die" },
  { value: "holy", label: "Holy Die" },
  { value: "gambler", label: "Gambler Die" },
  { value: "void", label: "Void Die" },
  { value: "memory", label: "Memory Die" },
  { value: "ice", label: "Ice Cube Die" },
  { value: "block", label: "Block Die" },
  { value: "middle", label: "Middle Die" },
];

function previewValue(type: DieType): Face {
  if (type === "wooden") return 3;
  if (type === "lucky") return 5;
  if (type === "joker") return 1;
  if (type === "unlucky") return 2;
  if (type === "unbalanced") return 2;
  if (type === "odd") return 5;
  if (type === "misfortune") return 4;
  if (type === "devil") return 1;
  if (type === "holy") return 1;
  if (type === "gambler") return 5;
  if (type === "void") return 6;
  if (type === "memory") return 4;
  if (type === "ice") return 2;
  if (type === "block") return 4;
  if (type === "middle") return 4;
  return 1;
}

export default function DiceCustomizer({
  dice,
  setDice,
  selectedStatue,
  setSelectedStatue,
  onBack,
}: Props) {
  function takenByOther(index: number, type: DieType) {
    if (type === "normal") return false;
    return dice.some((die, i) => i !== index && die.type === type);
  }

  function updateDie(index: number, type: DieType) {
    if (takenByOther(index, type)) return;

    setDice((prev) =>
      prev.map((die, i) =>
        i === index
          ? {
              ...die,
              type,
              memoryStoredValue: null,
              gamblerChain: 0,
              iceFrozenValue: null,
              iceConsecutiveKeeps: 0,
              iceGhost: false,
              blockBlockedValue: null,
            }
          : die
      )
    );
  }

  return (
    <Panel className="p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-amber-200">Customize Dice</h2>
          <p className="mt-2 text-stone-300">
            You have 6 dice. Each special die can be used only once.
          </p>
        </div>

        <Button onClick={onBack}>Back</Button>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-2 text-lg font-semibold text-amber-200">Statue</div>
        <select
          value={selectedStatue}
          onChange={(e) => setSelectedStatue(e.target.value as StatueType)}
          className="w-full max-w-sm rounded-xl border border-white/10 bg-stone-900 px-3 py-2 text-sm text-stone-100 outline-none"
        >
          {STATUE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="mt-3 text-sm text-stone-400">
          {STATUE_OPTIONS.find((option) => option.value === selectedStatue)?.description}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3 xl:grid-cols-6">
        {dice.map((die, index) => (
          <div
            key={die.slot}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="mb-4 flex justify-center">
              <DieFace
                value={previewValue(die.type)}
                dieType={die.type}
                disabled
              />
            </div>

            <div className="mb-2 text-center text-sm font-medium text-stone-200">
              Die {index + 1}
            </div>

            <select
              value={die.type}
              onChange={(e) => updateDie(index, e.target.value as DieType)}
              className="w-full rounded-xl border border-white/10 bg-stone-900 px-3 py-2 text-sm text-stone-100 outline-none"
            >
              {OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={takenByOther(index, option.value)}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <div className="mt-3 text-center text-xs text-stone-400">
              {die.type === "normal" && "Standard random die."}
              {die.type === "lucky" && "1 and 5 are most common, but all faces can appear."}
              {die.type === "wooden" && "Mostly rolls 3, then 1 and 2, with low chances for the rest."}
              {die.type === "joker" && "Only the 1 face is Joker. Joker face scores nothing alone but helps combos."}
              {die.type === "unlucky" && "A rougher die, but less extreme than before."}
              {die.type === "unbalanced" && "Weighted toward 1 and 2."}
              {die.type === "odd" && "Higher chance to roll odd values."}
              {die.type === "misfortune" && "Leans toward 2, 3, 4, and 6."}
              {die.type === "devil" && "Only the 1 face is Devil. Other faces act normally."}
              {die.type === "holy" && "Only the 1 face is Holy. Other faces act normally."}
              {die.type === "gambler" && "Risky last-die multiplier chain."}
              {die.type === "void" && "Becomes a random die each roll."}
              {die.type === "memory" && "Tries to remember its last value."}
              {die.type === "ice" && "Can freeze, then break for bonus points."}
              {die.type === "block" && "Blocks its rolled value for the next roll."}
              {die.type === "middle" && "Mostly rolls 2, 3, 4, 5, but 1 and 6 can still happen rarely."}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}