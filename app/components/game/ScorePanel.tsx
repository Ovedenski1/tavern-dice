"use client";

import Image from "next/image";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { StatueType } from "../../types/game";
import StatueSlot from "./StatueSlot";

type Props = {
  botScore: number;
  botName: string;
  botAvatar: string;
  botStatue: StatueType;
  botStatueUsed?: boolean;
  targetScore: number;
  turnPoints: number;
  selectedPoints: number;
  scorePopup?: number | null;
  isPlayerTurn: boolean;
  className?: string;
};

function GainPopup({ value }: { value: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: -10, scale: 1 }}
        exit={{ opacity: 0, y: -24, scale: 1.04 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="pointer-events-none absolute left-0 top-[-0.35rem] z-30 whitespace-nowrap"
        style={{
          fontFamily: "var(--font-heading)",
          imageRendering: "pixelated",
          color: "#86efac",
          textShadow:
            "0 2px 0 rgba(0,0,0,0.6), 2px 2px 0 rgba(18,88,34,0.95), 0 0 10px rgba(134,239,172,0.22)",
          lineHeight: 1,
        }}
      >
        <span className="text-[clamp(1rem,2.2vw,1.8rem)]">+{value}</span>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ScorePanel({
  botScore,
  botName,
  botAvatar,
  botStatue,
  botStatueUsed = false,
  targetScore,
  turnPoints,
  selectedPoints,
  scorePopup = null,
  isPlayerTurn,
  className,
}: Props) {
  return (
    <div className={clsx("relative", className)}>
      <div className="pointer-events-none absolute inset-y-0 right-[210px] z-20 hidden items-center sm:flex sm:right-[250px]">
        <div className="pointer-events-auto flex items-center justify-center">
          <div className="origin-center scale-[0.82]">
            <StatueSlot
              statue={botStatue}
              used={botStatueUsed}
              disabled
              hideLabel
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[56px_1fr_46px_42px_46px] items-center gap-1 px-2 py-2 sm:hidden">
        <div className="relative h-[clamp(3rem,8vw,5rem)] w-[clamp(3rem,8vw,5rem)] overflow-hidden rounded-full border-[3px] border-amber-300/45">
          <Image
            src={botAvatar}
            alt={botName}
            fill
            sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 76px"
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="min-w-0 px-1 text-left">
          <div
            className="truncate text-[0.9rem] text-stone-200"
            style={{
              fontFamily: "var(--font-heading)",
              imageRendering: "pixelated",
            }}
          >
            {botName}
          </div>

          <div
            className="mt-1 text-[0.95rem] leading-none text-stone-100/85"
            style={{
              fontFamily: "var(--font-ui)",
              imageRendering: "pixelated",
            }}
          >
            {targetScore}
          </div>

          <div className="relative mt-1 inline-block">
            {scorePopup ? <GainPopup value={scorePopup} /> : null}

            <div
              className="text-[1.7rem] leading-none text-rose-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]"
              style={{
                fontFamily: "var(--font-heading)",
                imageRendering: "pixelated",
              }}
            >
              {botScore}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="origin-center scale-[0.42]">
            <StatueSlot
              statue={botStatue}
              used={botStatueUsed}
              disabled
              hideLabel
            />
          </div>
        </div>

        <div className="text-center">
          <div
            className="text-[0.55rem] uppercase tracking-[0.08em] text-stone-200"
            style={{
              fontFamily: "var(--font-ui)",
              imageRendering: "pixelated",
            }}
          >
            Selected
          </div>

          <div
            className="mt-1 text-[1.2rem] leading-none text-stone-50"
            style={{
              fontFamily: "var(--font-heading)",
              imageRendering: "pixelated",
              textShadow: "0 2px 0 rgba(0,0,0,0.45)",
            }}
          >
            {isPlayerTurn ? 0 : selectedPoints}
          </div>
        </div>

        <div className="text-center">
          <div
            className="text-[0.55rem] uppercase tracking-[0.08em] text-stone-200"
            style={{
              fontFamily: "var(--font-ui)",
              imageRendering: "pixelated",
            }}
          >
            This Turn
          </div>

          <div
            className="mt-1 text-[1.2rem] leading-none text-stone-50"
            style={{
              fontFamily: "var(--font-heading)",
              imageRendering: "pixelated",
              textShadow: "0 2px 0 rgba(0,0,0,0.45)",
            }}
          >
            {isPlayerTurn ? 0 : turnPoints}
          </div>
        </div>
      </div>

      <div className="hidden grid-cols-[auto_1fr_auto_auto] items-center gap-2 px-2 py-2 sm:grid sm:gap-3 sm:px-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border-[3px] border-amber-300/45 sm:h-[clamp(3rem,8vw,5rem)] sm:w-[clamp(3rem,8vw,5rem)] sm:border-4">
          <Image
            src={botAvatar}
            alt={botName}
            fill
            sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 76px"
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="min-w-0 px-1 text-left sm:px-2 md:px-3">
          <div
            className="truncate text-[0.9rem] text-stone-200 sm:text-[clamp(1rem,2vw,1.4rem)]"
            style={{
              fontFamily: "var(--font-heading)",
              imageRendering: "pixelated",
            }}
          >
            {botName}
          </div>

          <div className="relative mt-0.5 inline-block">
            {scorePopup ? <GainPopup value={scorePopup} /> : null}

            <div
              className="text-[clamp(1.6rem,4vw,2.8rem)] leading-none text-rose-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]"
              style={{
                fontFamily: "var(--font-heading)",
                imageRendering: "pixelated",
              }}
            >
              {botScore}/{targetScore}
            </div>
          </div>
        </div>

        <div className="min-w-[68px] text-center sm:min-w-[120px]">
          <div
            className="text-[0.55rem] uppercase tracking-[0.08em] text-stone-200 sm:text-[clamp(0.7rem,1.5vw,1rem)] sm:tracking-[0.1em]"
            style={{
              fontFamily: "var(--font-ui)",
              imageRendering: "pixelated",
            }}
          >
            Selected
          </div>

          <div
            className="mt-1 text-[1.2rem] leading-none text-stone-50 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] sm:mt-0.5 sm:text-[clamp(1.4rem,3.2vw,2.6rem)]"
            style={{
              fontFamily: "var(--font-heading)",
              imageRendering: "pixelated",
            }}
          >
            {isPlayerTurn ? 0 : selectedPoints}
          </div>
        </div>

        <div className="min-w-[68px] text-center sm:min-w-[120px]">
          <div
            className="text-[0.55rem] uppercase tracking-[0.08em] text-stone-200 sm:text-[clamp(0.7rem,1.5vw,1rem)] sm:tracking-[0.1em]"
            style={{
              fontFamily: "var(--font-ui)",
              imageRendering: "pixelated",
            }}
          >
            This Turn
          </div>

          <div
            className="mt-1 text-[1.2rem] leading-none text-stone-50 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] sm:mt-0.5 sm:text-[clamp(1.4rem,3.2vw,2.6rem)]"
            style={{
              fontFamily: "var(--font-heading)",
              imageRendering: "pixelated",
            }}
          >
            {isPlayerTurn ? 0 : turnPoints}
          </div>
        </div>
      </div>
    </div>
  );
}