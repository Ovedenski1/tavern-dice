"use client";

import { motion } from "framer-motion";

import Button from "../ui/Button";
import BotCard from "./BotCard";
import { Bot } from "../../types/game";

type Props = {
  bots: Bot[];
  onBack: () => void;
  onSelect: (bot: Bot) => void;
};

export default function ChooseOpponentScreen({
  bots,
  onBack,
  onSelect,
}: Props) {
  return (
    <motion.div
      key="choose"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-amber-200">Choose your opponent</h2>
        <Button onClick={onBack}>Back</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {bots.map((bot) => (
          <BotCard key={bot.id} bot={bot} onSelect={onSelect} />
        ))}
      </div>
    </motion.div>
  );
}