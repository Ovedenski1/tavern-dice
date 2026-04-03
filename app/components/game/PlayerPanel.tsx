"use client";

import { ReactNode, useState } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { UserRound } from "lucide-react";
import { StatueType } from "../../types/game";
import StatueSlot from "./StatueSlot";

type Props = {
  playerScore: number;
  targetScore: number;
  turnPoints: number;
  selectedPoints: number;
  scorePopup?: number | null;
  isPlayerTurn: boolean;
  bankButton?: ReactNode;
  className?: string;
  playerStatue: StatueType;
  playerStatueUsed: boolean;
  onPlayerStatueClick?: () => void;
  playerStatueDisabled?: boolean;
  playerName: string;
  playerAvatar: string | null;
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

function AvatarCircle({
  playerAvatar,
  onError,
}: {
  playerAvatar: string | null;
  onError: () => void;
}) {
  if (playerAvatar) {
    return (
      <img
        src={playerAvatar}
        alt="Player avatar"
        className="h-full w-full object-cover"
        onError={onError}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center text-stone-100">
      <UserRound className="h-[46%] w-[46%]" />
    </div>
  );
}

export default function PlayerPanel({
  playerScore,
  targetScore,
  turnPoints,
  selectedPoints,
  scorePopup = null,
  isPlayerTurn,
  bankButton,
  className,
  playerStatue,
  playerStatueUsed,
  onPlayerStatueClick,
  playerStatueDisabled = false,
  playerName,
  playerAvatar,
}: Props) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const safePlayerName = playerName?.trim() || "Player";
  const resolvedAvatar = avatarFailed ? null : playerAvatar;

  return (
    <div className={clsx("relative", className)}>
      {/* desktop floating controls */}
      <div className="pointer-events-none absolute inset-y-0 right-[210px] z-20 hidden items-center gap-3 sm:flex sm:right-[250px]">
        <div className="pointer-events-auto flex items-center justify-center">
          <div className="origin-center scale-[0.82]">
            <StatueSlot
              statue={playerStatue}
              used={playerStatueUsed}
              disabled={playerStatue === "none" || playerStatueDisabled}
              onClick={onPlayerStatueClick}
              hideLabel
            />
          </div>
        </div>

        {bankButton ? (
          <div className="pointer-events-auto origin-center">
            {bankButton}
          </div>
        ) : null}
      </div>

      {/* MOBILE - one line */}
      <div className="grid grid-cols-[56px_1fr_42px_108px_46px_46px] items-center gap-1 px-2 py-2 sm:hidden">
        <div className="relative h-[clamp(3rem,8vw,5rem)] w-[clamp(3rem,8vw,5rem)] overflow-hidden rounded-full border-[3px] border-sky-300/45 bg-black/10">
          <AvatarCircle
            playerAvatar={resolvedAvatar}
            onError={() => setAvatarFailed(true)}
          />
        </div>

        <div className="min-w-0 pl-1">
          <div
            className="truncate text-[0.9rem] text-stone-200"
            style={{
              fontFamily: "var(--font-heading)",
              imageRendering: "pixelated",
            }}
          >
            {safePlayerName}
          </div>

          <div
            className="mt-1 text-[0.95rem] leading-none text-stone-50"
            style={{
              fontFamily: "var(--font-heading)",
              imageRendering: "pixelated",
              textShadow: "0 2px 0 rgba(0,0,0,0.45)",
            }}
          >
            {targetScore}
          </div>

          <div className="relative mt-1 inline-block">
            {scorePopup ? <GainPopup value={scorePopup} /> : null}

            <div
              className="text-[1.7rem] leading-none text-sky-300"
              style={{
                fontFamily: "var(--font-heading)",
                imageRendering: "pixelated",
                textShadow: "0 2px 0 rgba(0,0,0,0.45)",
              }}
            >
              {playerScore}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="origin-center scale-[0.42]">
            <StatueSlot
              statue={playerStatue}
              used={playerStatueUsed}
              disabled={playerStatue === "none" || playerStatueDisabled}
              onClick={onPlayerStatueClick}
              hideLabel
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          {bankButton ? (
            <div className="origin-center scale-[0.56]">
              {bankButton}
            </div>
          ) : null}
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
            {isPlayerTurn ? selectedPoints : 0}
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
            {isPlayerTurn ? turnPoints : 0}
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden grid-cols-[auto_1fr_auto_auto] items-center gap-2 px-2 py-2 sm:grid sm:gap-3 sm:px-3">
        <div className="relative h-[clamp(3rem,8vw,5rem)] w-[clamp(3rem,8vw,5rem)] overflow-hidden rounded-full border-[3px] border-sky-300/45 bg-black/10 sm:border-4">
          <AvatarCircle
            playerAvatar={resolvedAvatar}
            onError={() => setAvatarFailed(true)}
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
            {safePlayerName}
          </div>

          <div className="relative mt-0.5 inline-block">
            {scorePopup ? <GainPopup value={scorePopup} /> : null}

            <div
              className="text-[clamp(1.6rem,4vw,2.8rem)] leading-none text-sky-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]"
              style={{
                fontFamily: "var(--font-heading)",
                imageRendering: "pixelated",
              }}
            >
              {playerScore}/{targetScore}
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
            {isPlayerTurn ? selectedPoints : 0}
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
            {isPlayerTurn ? turnPoints : 0}
          </div>
        </div>
      </div>
    </div>
  );
}