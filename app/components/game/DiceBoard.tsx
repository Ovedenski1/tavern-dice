"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Die, PlayerSide } from "../../types/game";
import DieFace from "./DieFace";
import RollButton from "../ui/RollButton";

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
  tvCutin?:
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
  starterPreviewVisible?: boolean;
  starterRandomizerRunning?: boolean;
  starterDisplayText?: string | null;
  playerStarterLabel?: string;
  gameEnded?: boolean;
  winner?: PlayerSide | null;
  onPlayAgain?: () => void;
  botPreviewSelectedIds?: string[];
  lostVisualState: {
    playerMissing: boolean;
    botHasExtra: boolean;
  };
  germaDestroyedFlash: number;
};

function isSpecialDevilFace(die: Die) {
  return die.dieType === "devil" && die.value === 1;
}

function isSpecialHolyFace(die: Die) {
  return die.dieType === "holy" && die.value === 1;
}

function isSpecialGermaFace(die: Die) {
  return die.dieType === "germa" && die.value === 6;
}

function isSpecialLostDie(die: Die) {
  return die.dieType === "lost";
}

function isSpecialMerryFace(die: Die) {
  return die.dieType === "merry" && die.value === 1;
}

function isSpecialSunnyFace(die: Die) {
  return die.dieType === "sunny" && die.value === 1;
}

function isSpecialSunFace(die: Die) {
  return die.dieType === "sun" && die.value === 1;
}

function isSpecialScarFace(die: Die) {
  return die.dieType === "scar" && die.value === 3;
}

function BankedDie({ die }: { die: Die }) {
  const borrowed = Boolean(die.lostBorrowedThisTurn);

  return (
    <div className="origin-center scale-[0.62] sm:scale-[0.82] md:scale-[0.9] lg:scale-100">
      <div className="relative">
        {borrowed ? (
          <div className="pointer-events-none absolute inset-[-4px] rounded-xl border border-emerald-300/60 shadow-[0_0_16px_rgba(52,211,153,0.35)]" />
        ) : null}

        <DieFace
          value={die.value}
          dieType={die.dieType}
          iceGhost={Boolean(die.iceGhost)}
          disabled
        />
      </div>
    </div>
  );
}

function MissingDieSlot({
  side,
  visible,
}: {
  side: "player" | "bot";
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: side === "player" ? 12 : -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="pointer-events-none flex items-center justify-center"
        >
          <div
            className="flex h-[clamp(2.3rem,6vw,4.4rem)] w-[clamp(2.3rem,6vw,4.4rem)] items-center justify-center rounded-[0.18rem] border-[3px] border-emerald-300/45 bg-emerald-400/10 text-emerald-100 sm:rounded-[0.22rem]"
            style={{
              imageRendering: "pixelated",
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 20px rgba(52,211,153,0.15)",
            }}
          >
            <div className="text-center leading-none">
              <div
                className="text-[0.62rem] sm:text-[0.78rem]"
                style={{
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.08em",
                  textShadow: "1px 1px 0 rgba(0,0,0,0.35)",
                }}
              >
                LOST
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BorrowedBadge({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6 }}
          className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2"
        >
          <div
            className="rounded-full border border-emerald-300/40 bg-emerald-400/15 px-3 py-1 text-[0.58rem] text-emerald-100 sm:text-[0.68rem]"
            style={{
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.12em",
              imageRendering: "pixelated",
              textShadow: "1px 1px 0 rgba(0,0,0,0.35)",
              boxShadow: "0 0 16px rgba(52,211,153,0.18)",
            }}
          >
            + EXTRA DIE
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DestroyFlash({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.75, 0.15, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65 }}
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            background:
              "radial-gradient(circle at center, rgba(251,191,36,0.55) 0%, rgba(239,68,68,0.28) 35%, transparent 70%)",
          }}
        />
      )}
    </AnimatePresence>
  );
}

function dieVisualPriority(die: Die) {
  if (isSpecialHolyFace(die)) return 6;
  if (isSpecialDevilFace(die)) return 5;
  if (isSpecialGermaFace(die)) return 4;
  if (isSpecialSunFace(die) || isSpecialSunnyFace(die) || isSpecialMerryFace(die)) return 3;
  if (isSpecialScarFace(die)) return 2;
  if (isSpecialLostDie(die)) return 1;
  return 0;
}

function dieAnimateProps(
  die: Die,
  i: number,
  isPlayerSide: boolean,
  isShownSelected: boolean
) {
  const specialPriority = dieVisualPriority(die);
  const borrowed = Boolean(die.lostBorrowedThisTurn);
  const splity = specialPriority >= 4;

  return {
    initial: {
      opacity: 0,
      y: isPlayerSide ? 50 : -50,
      scale: borrowed ? 0.35 : 0.45,
      rotate: splity ? -24 + i * 8 : -16 + i * 4,
      filter: borrowed ? "brightness(1.25)" : "brightness(1)",
    },
    animate: {
      opacity: 1,
      y: isShownSelected ? -10 : 0,
      scale: borrowed ? (isShownSelected ? 1.12 : 1.06) : isShownSelected ? 1.04 : 1,
      rotate: 0,
      filter: borrowed ? "brightness(1.15)" : "brightness(1)",
    },
    exit: {
      opacity: 0,
      scale: specialPriority >= 4 ? 1.18 : 0.65,
      rotate: specialPriority >= 4 ? 16 : 0,
      filter: specialPriority >= 4 ? "brightness(1.4)" : "brightness(1)",
    },
  };
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
  lostVisualState,
  germaDestroyedFlash,
}: Props) {
  const activeSide = isPlayerTurn ? "player" : "bot";
  const [dotCount, setDotCount] = useState(0);
  const [showDestroyFlash, setShowDestroyFlash] = useState(false);

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

  useEffect(() => {
    if (!germaDestroyedFlash) return;

    setShowDestroyFlash(true);
    const timeout = window.setTimeout(() => {
      setShowDestroyFlash(false);
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [germaDestroyedFlash]);

  const starterColor =
    starterDisplayText?.trim().toUpperCase() === playerStarterLabel.trim().toUpperCase()
      ? "#38bdf8"
      : "#ef4444";

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

    const activeBorrowedCount = visibleRolledDice.filter((d) => d.lostBorrowedThisTurn).length;

    const showMissingDieHint =
      isActive &&
      ((isPlayerSide && lostVisualState.playerMissing) ||
        (!isPlayerSide && visibleRolledDice.length === 5 && activeBorrowedCount === 0));

    const showBorrowedHint =
      isActive &&
      ((isBotSide && lostVisualState.botHasExtra) || activeBorrowedCount > 0);

    const rollDisabled =
      !isPlayerSide || !isActive || !canSelect || !canRoll || rolling || gameEnded;

    const rollButtonNode = isPlayerSide ? (
      <div className={`mt-[-12px] sm:mt-0 ${!isActive ? "opacity-60" : ""}`}>
        <RollButton
          onClick={!rollDisabled ? onRoll : undefined}
          disabled={rollDisabled}
          pressed={isPlayerSide && isActive && rolling}
        />
      </div>
    ) : (
      <div className="h-[82px] w-[170px] sm:h-[96px] sm:w-[210px]" />
    );

    const diceNode = (
      <div className="relative w-full" style={{ perspective: "900px" }}>
        <BorrowedBadge visible={showBorrowedHint} />

        <div className="flex min-h-[44px] w-full items-center justify-center py-1 sm:min-h-[140px] sm:py-6">
          <div className="inline-flex max-w-full flex-nowrap items-center justify-center gap-1 sm:gap-4">
            <MissingDieSlot side={side} visible={showMissingDieHint} />

            <AnimatePresence mode="popLayout">
              {visibleRolledDice.map((die, i) => {
                const isBotPreviewed = isBotSide && botPreviewSelectedIds.includes(die.id);
                const isShownSelected = isActive ? die.selected || isBotPreviewed : false;
                const isShownPlayable = isActive
                  ? isPlayerSide
                    ? die.selected && selectedComboPlayable
                    : isBotPreviewed
                  : false;

                const borrowed = Boolean(die.lostBorrowedThisTurn);
                const special =
                  isSpecialHolyFace(die) ||
                  isSpecialDevilFace(die) ||
                  isSpecialGermaFace(die) ||
                  isSpecialSunFace(die) ||
                  isSpecialSunnyFace(die) ||
                  isSpecialMerryFace(die) ||
                  isSpecialScarFace(die);

                const anim = dieAnimateProps(die, i, isPlayerSide, isShownSelected);

                return (
                  <motion.div
                    key={die.id}
                    layout="position"
                    initial={anim.initial}
                    animate={anim.animate}
                    exit={anim.exit}
                    transition={{
                      y: { type: "spring", stiffness: 320, damping: 22, delay: i * 0.04 },
                      scale: { type: "spring", stiffness: 320, damping: 22, delay: i * 0.04 },
                      rotate: { duration: special ? 0.36 : 0.28, delay: i * 0.04 },
                      opacity: { duration: 0.18, delay: i * 0.04 },
                      filter: { duration: 0.22, delay: i * 0.04 },
                      layout: { type: "spring", stiffness: 500, damping: 34 },
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        className="pointer-events-none absolute bottom-[-7px] h-[10px] w-[60%] rounded-full bg-black/35 blur-[2px]"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{
                          opacity: isShownSelected ? 0.42 : borrowed ? 0.35 : 0.22,
                          scale: isShownSelected ? 1 : borrowed ? 0.96 : 0.82,
                        }}
                        transition={{ duration: 0.2 }}
                      />

                      {borrowed ? (
                        <div className="pointer-events-none absolute inset-[-5px] rounded-xl border border-emerald-300/65 shadow-[0_0_20px_rgba(52,211,153,0.35)]" />
                      ) : null}

                      {special ? (
                        <div className="pointer-events-none absolute inset-[-4px] rounded-xl bg-white/0 shadow-[0_0_18px_rgba(255,255,255,0.06)]" />
                      ) : null}

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
              <div className="order-1 flex w-full justify-center -translate-y-3 sm:translate-y-0">
                {rollButtonNode}
              </div>
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

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1rem] p-1 sm:rounded-[2.75rem] sm:p-5">
      <DestroyFlash visible={showDestroyFlash} />

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
              {tvCutin ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <img
                      src={tvCutin.imageSrc}
                      alt={tvCutin.kind}
                      className="h-full w-full object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_1px,rgba(0,0,0,0.08)_2px,rgba(0,0,0,0.08)_4px)]" />
                  <div className="tv-static absolute inset-[-8%] opacity-35 mix-blend-overlay" />
                  <div className="tv-flicker absolute inset-0 bg-white/5" />
                  <div className="tv-wave absolute inset-0 pointer-events-none" />
                  <div className="absolute inset-0 shadow-[inset_0_0_28px_rgba(0,0,0,0.4)]" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.025)_22%,rgba(0,0,0,0.82)_100%)]" />
                  <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_1px,rgba(0,0,0,0.08)_2px,rgba(0,0,0,0.08)_4px)]" />
                  <div className="tv-static absolute inset-[-8%] opacity-35 mix-blend-overlay" />
                  <div className="tv-flicker absolute inset-0 bg-white/5" />

                  <div className="absolute inset-0 tv-content-warp">
                    {gameEnded ? (
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

                  <div className="tv-wave absolute inset-0 pointer-events-none" />
                  <div className="absolute inset-0 shadow-[inset_0_0_28px_rgba(0,0,0,0.4)]" />
                </>
              )}
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