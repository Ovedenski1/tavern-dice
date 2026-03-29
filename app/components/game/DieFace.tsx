"use client";

import { motion } from "framer-motion";
import { Face } from "../../types/game";
import { DIE_PIPS } from "../../lib/constants";

type Props = {
  value: Face;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

export default function DieFace({
  value,
  selected,
  onClick,
  disabled = false,
}: Props) {
  const pips = DIE_PIPS[value];

  return (
    <motion.div
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      style={{ transformStyle: "preserve-3d" }}
      className="relative"
    >
      <button
        type="button"
        onClick={disabled ? undefined : onClick}
        className={[
          "relative grid h-[clamp(2.3rem,6vw,4.4rem)] w-[clamp(2.3rem,6vw,4.4rem)] grid-cols-3 grid-rows-3 rounded-[0.7rem] border transition sm:rounded-[1rem]",
          selected
            ? "border-amber-300 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),_inset_0_-6px_10px_rgba(0,0,0,0.25),_0_10px_18px_rgba(0,0,0,0.4)] ring-2 ring-amber-400/30 sm:ring-4"
            : "border-white/20 bg-gradient-to-br from-white via-stone-100 to-stone-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),_inset_0_-6px_10px_rgba(0,0,0,0.25),_0_10px_18px_rgba(0,0,0,0.4)]",
          disabled ? "cursor-default" : "cursor-pointer",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[0.7rem] bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50 sm:rounded-[1rem]" />

        {Array.from({ length: 9 }).map((_, i) => {
          const idx = i + 1;
          const filled = pips.includes(idx);

          return (
            <div key={idx} className="flex items-center justify-center">
              {filled ? (
                <span className="h-[clamp(0.32rem,0.8vw,0.72rem)] w-[clamp(0.32rem,0.8vw,0.72rem)] rounded-full bg-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]" />
              ) : null}
            </div>
          );
        })}

        {selected && (
          <div className="absolute inset-0 rounded-[0.7rem] border-2 border-amber-500 sm:rounded-[1rem]" />
        )}
      </button>

      <div className="pointer-events-none absolute -bottom-1 left-1/2 h-[clamp(0.24rem,0.7vw,0.6rem)] w-[clamp(1.5rem,4vw,3rem)] -translate-x-1/2 rounded-full bg-black/40 blur-sm" />
    </motion.div>
  );
}