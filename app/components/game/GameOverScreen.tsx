"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";

import Button from "../ui/Button";
import Panel from "../ui/Panel";
import { Bot, PlayerSide, Scores } from "../../types/game";

type Props = {
  winner: PlayerSide | null;
  message: string;
  scores: Scores;
  selectedBot: Bot;
  onPlayAgain: () => void;
  onMainMenu: () => void;
};

export default function GameOverScreen({
  winner,
  message,
  scores,
  selectedBot,
  onPlayAgain,
  onMainMenu,
}: Props) {
  return (
    <motion.div
      key="gameover"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-3xl"
    >
      <Panel className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-300/15 text-amber-300">
          <Crown className="h-10 w-10" />
        </div>

        <h2 className="text-4xl font-bold text-amber-200">
          {winner === "player" ? "Victory" : "Defeat"}
        </h2>

        <p className="mt-3 text-lg text-stone-300">{message}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-5">
            <div className="text-sm text-stone-400">Your score</div>
            <div className="text-4xl font-bold text-stone-100">{scores.player}</div>
          </div>

          <div className="rounded-2xl bg-white/5 p-5">
            <div className="text-sm text-stone-400">{selectedBot.name}</div>
            <div className="text-4xl font-bold text-stone-100">{scores.bot}</div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="gold" onClick={onPlayAgain}>
            Play Again
          </Button>
          <Button onClick={onMainMenu}>Main Menu</Button>
        </div>
      </Panel>
    </motion.div>
  );
}