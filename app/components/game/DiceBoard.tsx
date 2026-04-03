"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Die, PlayerSide } from "../../types/game";
import DieFace from "./DieFace";
import RollButton from "../ui/RollButton";

type TvCutin =
  | {
      kind: "frankycola";
      imageSrc: string;
      duration: number;
    }
  | {
      kind: "chopperdoctor";
      imageSrc: string;
      duration: number;
    }
  | null;

type Props = {
  rolledDice: Die[];
  bankedDice: Die[];
  frozenPlayerRolledDice: Die[];
  frozenPlayerBankedDice: Die[];
  frozenBotRolledDice: Die[];
  frozenBotBankedDice: Die[];
  onSelectDie: (id: string) => void;
  onRoll: () => void;
  canSelect: boolean;
  rolling: boolean;
  isPlayerTurn: boolean;
  canRoll: boolean;
  selectedComboPlayable: boolean;
  tvMessage?: { text: string; color: string } | null;
  tvCutin?: TvCutin;
  starterPreviewVisible?: boolean;
  starterRandomizerRunning?: boolean;
  starterDisplayText?: string | null;
  playerStarterLabel?: string;
  gameEnded?: boolean;
  winner?: PlayerSide | null;
  onPlayAgain?: () => void;
  botPreviewSelectedIds?: string[];
};

function BankedDie({ die }: { die: Die }) {
  return (
    <div className="origin-center scale-[0.62] sm:scale-[0.82] md:scale-[0.9] lg:scale-100">
      <DieFace
        value={die.value}
        dieType={die.dieType}
        iceGhost={Boolean(die.iceGhost)}
        disabled
      />
    </div>
  );
}

export default function DiceBoard({
  rolledDice,
  bankedDice,
  frozenPlayerRolledDice,
  frozenPlayerBankedDice,
  frozenBotRolledDice,
  frozenBotBankedDice,
  onSelectDie,
  onRoll,
  canSelect,
  rolling,
  isPlayerTurn,
  canRoll,
  selectedComboPlayable,
  tvMessage = null,
  tvCutin = null,
  starterPreviewVisible = false,
  starterRandomizerRunning = false,
  starterDisplayText = null,
  playerStarterLabel = "PLAYER",
  gameEnded = false,
  winner = null,
  onPlayAgain,
  botPreviewSelectedIds = [],
}: Props) {
  const activeSide = isPlayerTurn ? "player" : "bot";
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (!rolling) {
      setDotCount(0);
      return;
    }

    const interval = window.setInterval(() => {
      setDotCount((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 260);

    return () => window.clearInterval(interval);
  }, [rolling]);

  function renderTurnSide(side: "bot" | "player") {
    const isActive = activeSide === side;
    const isPlayerSide = side === "player";
    const isBotSide = side === "bot";

    const visibleBankedDice = isActive
      ? bankedDice
      : isPlayerSide
        ? frozenPlayerBankedDice
        : frozenBotBankedDice;

    const baseRolledDice = isActive
      ? rolledDice
      : isPlayerSide
        ? frozenPlayerRolledDice
        : frozenBotRolledDice;

    const visibleRolledDice = isActive && rolling ? [] : baseRolledDice;

    const rollButtonNode =
      isActive && isPlayerSide && !gameEnded ? (
        <RollButton
          onClick={canSelect && canRoll && !rolling ? onRoll : undefined}
          disabled={!canSelect || !canRoll || rolling}
          pressed={rolling}
        />
      ) : (
        <div className="h-[82px] w-[170px] sm:h-[96px] sm:w-[210px]" />
      );

    const diceNode = (
      <div className="relative w-full" style={{ perspective: "900px" }}>
        <div className="flex min-h-[44px] w-full items-center justify-center py-1 sm:min-h-[140px] sm:py-6">
          <div className="inline-flex max-w-full flex-nowrap items-center justify-center gap-1 sm:gap-4">
            <AnimatePresence mode="popLayout">
              {visibleRolledDice.map((die, i) => {
                const isBotPreviewed = isBotSide && botPreviewSelectedIds.includes(die.id);
                const isShownSelected = isActive ? die.selected || isBotPreviewed : false;
                const isShownPlayable = isActive
                  ? isPlayerSide
                    ? die.selected && selectedComboPlayable
                    : isBotPreviewed
                  : false;

                return (
                  <motion.div
                    key={die.id}
                    layout="position"
                    initial={{
                      opacity: 0,
                      y: isPlayerSide ? 50 : -50,
                      scale: 0.45,
                      rotate: -16 + i * 4,
                    }}
                    animate={{
                      opacity: 1,
                      y: isShownSelected ? -10 : 0,
                      scale: isShownSelected ? 1.04 : 1,
                      rotate: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.65,
                    }}
                    transition={{
                      y: { type: "spring", stiffness: 320, damping: 22, delay: i * 0.04 },
                      scale: { type: "spring", stiffness: 320, damping: 22, delay: i * 0.04 },
                      rotate: { duration: 0.28, delay: i * 0.04 },
                      opacity: { duration: 0.18, delay: i * 0.04 },
                      layout: { type: "spring", stiffness: 500, damping: 34 },
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        className="pointer-events-none absolute bottom-[-7px] h-[10px] w-[60%] rounded-full bg-black/35 blur-[2px]"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{
                          opacity: isShownSelected ? 0.42 : 0.22,
                          scale: isShownSelected ? 1 : 0.82,
                        }}
                        transition={{ duration: 0.2 }}
                      />

                      <DieFace
                        value={die.value}
                        dieType={die.dieType}
                        iceGhost={Boolean(die.iceGhost)}
                        selected={isShownSelected}
                        playable={isShownPlayable}
                        onClick={
                          isPlayerSide && isActive && !gameEnded
                            ? () => onSelectDie(die.id)
                            : undefined
                        }
                        disabled={
                          isPlayerSide
                            ? !isActive || !canSelect || rolling || gameEnded
                            : true
                        }
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );

    return (
      <div className="grid h-full min-h-0 grid-cols-[52px_1fr_52px] gap-1 rounded-[1rem] px-1 py-1 sm:min-h-[280px] sm:grid-cols-[110px_1fr_110px] sm:gap-6 sm:rounded-[2.5rem] sm:px-4 sm:py-5">
        <div className="flex items-center justify-center">
          {isPlayerSide ? (
            <div className="flex h-full w-full items-end justify-start">
              <div className="flex flex-col-reverse items-start justify-end gap-0.5 sm:gap-1 md:gap-2">
                <AnimatePresence>
                  {visibleBankedDice.map((die) => (
                    <motion.div
                      key={die.id}
                      layout
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <BankedDie die={die} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : null}
        </div>

        <div
          className={[
            "flex min-h-0 flex-1 flex-col items-center",
            isPlayerSide ? "justify-end pb-2 sm:pb-3" : "justify-start pt-2 sm:pt-3",
          ].join(" ")}
        >
          {isBotSide ? (
            <>
              <div className="order-1 w-full">{diceNode}</div>
              <div className="order-2 flex w-full justify-center">{rollButtonNode}</div>
            </>
          ) : (
            <>
              <div className="order-1 flex w-full justify-center">{rollButtonNode}</div>
              <div className="order-2 w-full">{diceNode}</div>
            </>
          )}
        </div>

        <div className="flex items-center justify-center">
          {!isPlayerSide ? (
            <div className="flex h-full w-full items-start justify-end">
              <div className="flex flex-col items-end justify-start gap-0.5 sm:gap-1 md:gap-2">
                <AnimatePresence>
                  {visibleBankedDice.map((die) => (
                    <motion.div
                      key={die.id}
                      layout
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <BankedDie die={die} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  const starterColor =
    starterDisplayText?.trim().toUpperCase() === playerStarterLabel.trim().toUpperCase()
      ? "#38bdf8"
      : "#ef4444";

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1rem] p-1 sm:rounded-[2.75rem] sm:p-5">
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div
          className="relative h-[28%] w-[54%] min-w-[280px] max-w-[760px]"
          style={{
            imageRendering: "pixelated",
            background: "#000000",
            boxShadow:
              "0 0 0 4px #000000, 8px 8px 0 rgba(0,0,0,0.34), 0 14px 28px rgba(0,0,0,0.34)",
          }}
        >
          <div
            className="absolute inset-[6px]"
            style={{
              background: "#000000",
              boxShadow:
                "inset 0 2px 0 rgba(255,255,255,0.03), inset -2px -2px 0 rgba(0,0,0,0.7)",
            }}
          >
            <div
              className="absolute inset-[6px] overflow-hidden"
              style={{
                background: "#14191e",
                boxShadow:
                  "inset 0 0 0 2px rgba(0,0,0,0.9), inset 0 0 18px rgba(0,0,0,0.45)",
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.025)_22%,rgba(0,0,0,0.82)_100%)]" />
              <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_1px,rgba(0,0,0,0.08)_2px,rgba(0,0,0,0.08)_4px)]" />

              <div className="absolute inset-0 tv-content-warp">
                {tvCutin ? (
                  <div className="absolute inset-0 flex items-center justify-center px-4">
                    <div className="relative h-[88%] w-[88%]">
                      <Image
                        src={tvCutin.imageSrc}
                        alt="TV cutin"
                        fill
                        sizes="(max-width: 768px) 80vw, 700px"
                        className="object-contain"
                        priority
                        unoptimized
                      />
                    </div>
                  </div>
                ) : gameEnded ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                    <div
                      className="font-heading text-[clamp(2.8rem,8vw,6.2rem)] tracking-[0.16em]"
                      style={{
                        imageRendering: "pixelated",
                        color: winner === "player" ? "#4ade80" : "#f87171",
                        textShadow:
                          winner === "player"
                            ? "2px 2px 0 rgba(0,40,0,0.9), 0 0 16px rgba(74,222,128,0.4)"
                            : "2px 2px 0 rgba(60,0,0,0.9), 0 0 16px rgba(248,113,113,0.4)",
                      }}
                    >
                      {winner === "player" ? "VICTORY" : "DEFEAT"}
                    </div>

                    {onPlayAgain ? (
                      <button
                        type="button"
                        onClick={onPlayAgain}
                        className="pointer-events-auto mt-5 border-2 border-white/15 bg-black/30 px-5 py-3 font-ui text-xs tracking-[0.18em] text-white/85 backdrop-blur-sm transition hover:bg-black/40 sm:text-sm"
                        style={{
                          imageRendering: "pixelated",
                          boxShadow: "2px 2px 0 rgba(0,0,0,0.28)",
                        }}
                      >
                        PLAY AGAIN
                      </button>
                    ) : null}
                  </div>
                ) : tvMessage ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                    <motion.div
                      key={`${tvMessage.text}-${tvMessage.color}`}
                      initial={{ scale: 0.94, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.04, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-heading text-[clamp(2.2rem,7vw,5.8rem)] leading-none tracking-[0.12em]"
                      style={{
                        imageRendering: "pixelated",
                        color: tvMessage.color,
                        textShadow: `2px 2px 0 rgba(0,0,0,0.85), 0 0 14px ${tvMessage.color}`,
                      }}
                    >
                      {tvMessage.text}
                    </motion.div>
                  </div>
                ) : rolling ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                    <div
                      className="font-heading text-[clamp(2.8rem,8.8vw,7.2rem)] tracking-[0.18em] text-[#4ade80]"
                      style={{
                        imageRendering: "pixelated",
                        textShadow:
                          "3px 3px 0 rgba(0,40,0,0.9), 0 0 18px rgba(74,222,128,0.35)",
                      }}
                    >
                      <span>ROLLING</span>
                      <span className="inline-block text-left" style={{ width: "3ch" }}>
                        {".".repeat(dotCount)}
                      </span>
                    </div>
                  </div>
                ) : starterPreviewVisible ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                    <div className="font-ui mb-3 text-[clamp(0.7rem,1.25vw,0.95rem)] tracking-[0.22em] text-white/45 [text-shadow:1px_1px_0_rgba(0,0,0,0.5)]">
                      WHO GOES FIRST
                    </div>

                    <motion.div
                      key={starterDisplayText}
                      initial={{ opacity: 0.5, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.08 }}
                      className="font-heading text-[clamp(2.2rem,6.8vw,5.4rem)] leading-none tracking-[0.12em]"
                      style={{
                        imageRendering: "pixelated",
                        color: starterColor,
                        textShadow: `2px 2px 0 rgba(0,0,0,0.9), 0 0 10px ${starterColor}`,
                      }}
                    >
                      {starterDisplayText}
                    </motion.div>

                    <div className="font-ui mt-4 text-[clamp(0.55rem,1vw,0.78rem)] tracking-[0.2em] text-white/35 [text-shadow:1px_1px_0_rgba(0,0,0,0.5)]">
                      {starterRandomizerRunning ? "RANDOMIZING..." : "STARTER CHOSEN"}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="tv-static absolute inset-[-8%] opacity-35 mix-blend-overlay" />
              <div className="tv-flicker absolute inset-0 bg-white/5" />
              <div className="tv-wave absolute inset-0 pointer-events-none" />
              <div className="absolute inset-0 shadow-[inset_0_0_28px_rgba(0,0,0,0.4)]" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid h-full min-h-0 grid-rows-2 gap-1 sm:gap-4">
        {renderTurnSide("bot")}
        {renderTurnSide("player")}
      </div>
    </div>
  );
}