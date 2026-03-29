"use client";

import { motion } from "framer-motion";
import { Bot } from "../../types/game";

type Props = {
  bot: Bot;
  onSelect: (bot: Bot) => void;
};

export default function BotCard({ bot, onSelect }: Props) {
  return (
    <motion.button
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(bot)}
      className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 text-left shadow-2xl"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-amber-300/15 to-stone-950/40 p-4">
        <img
          src={bot.avatar}
          alt={bot.name}
          className="h-full w-full rounded-[1.5rem] object-cover"
        />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-stone-100">{bot.name}</h3>
          <span className="rounded-full bg-amber-300/15 px-3 py-1 text-sm text-amber-200">
            {bot.target}
          </span>
        </div>

        <p className="mt-3 text-stone-300">
          {bot.target === 2000 && "Forgiving and ideal for testing the flow."}
          {bot.target === 4000 && "Balanced and more willing to push risky rolls."}
          {bot.target === 8000 && "Aggressive and built for longer, tense matches."}
        </p>
      </div>
    </motion.button>
  );
}