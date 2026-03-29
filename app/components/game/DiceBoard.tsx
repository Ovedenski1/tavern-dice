"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Die } from "../../types/game";
import Cup from "./Cup";
import DieFace from "./DieFace";

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
  resultImageSrc?: string | null;
};

function BankedDie({ value }: { value: Die["value"] }) {
  return (
    <div className="origin-center scale-[0.72] sm:scale-[0.82] md:scale-[0.9] lg:scale-100">
      <DieFace value={value} disabled />
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
  resultImageSrc = null,
}: Props) {
  const activeSide = isPlayerTurn ? "player" : "bot";

  function renderTurnSide(side: "bot" | "player") {
    const isActive = activeSide === side;
    const isPlayerSide = side === "player";
    const isBotSide = side === "bot";

    const visibleBankedDice = isActive
      ? bankedDice
      : isPlayerSide
        ? frozenPlayerBankedDice
        : frozenBotBankedDice;

    const visibleRolledDice = isActive
      ? rolledDice
      : isPlayerSide
        ? frozenPlayerRolledDice
        : frozenBotRolledDice;

    const cupNode = isActive ? (
      <Cup
        rolling={rolling}
        onClick={isPlayerSide && canSelect && canRoll ? onRoll : undefined}
        disabled={!isPlayerSide || !canSelect || !canRoll || rolling}
        showIdleImage={isPlayerSide}
        flipped={isBotSide}
      />
    ) : (
      <div className="h-[clamp(5.8rem,14vw,9rem)] w-[clamp(5.8rem,14vw,9rem)]" />
    );

    const diceNode = (
      <div className="relative w-full" style={{ perspective: "900px" }}>
        <div className="flex min-h-[52px] w-full flex-wrap items-center justify-center gap-1.5 px-0 py-1 sm:min-h-[140px] sm:gap-4 sm:px-4 sm:py-6">
          <AnimatePresence>
            {visibleRolledDice.map((die, i) => (
              <motion.div
                key={die.id}
                initial={{
                  opacity: 0,
                  y: isPlayerSide ? 80 : -80,
                  scale: 0.4,
                  rotate: -20 + i * 5,
                }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{
                  opacity: 0,
                  y: isPlayerSide ? 50 : -50,
                  scale: 0.6,
                }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <DieFace
                  value={die.value}
                  selected={isActive ? die.selected : false}
                  onClick={isActive ? () => onSelectDie(die.id) : undefined}
                  disabled={!isActive || !canSelect || rolling}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isActive && resultImageSrc && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <img
                src={resultImageSrc}
                alt="Turn result"
                className="w-36 select-none object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] sm:w-52 md:w-60"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );

    return (
      <div className="grid h-full min-h-0 grid-cols-[72px_1fr_72px] gap-2 rounded-[1.5rem] px-1 py-2 sm:min-h-[280px] sm:grid-cols-[110px_1fr_110px] sm:gap-6 sm:rounded-[2.5rem] sm:px-4 sm:py-5">
        <div className="flex items-center justify-center">
          {isPlayerSide ? (
            <div className="flex h-full w-full items-end justify-start">
              <div className="flex flex-col-reverse items-start justify-end gap-0.5 sm:gap-1 md:gap-2">
                <AnimatePresence>
                  {visibleBankedDice.map((die) => (
                    <motion.div
                      key={die.id}
                      layout
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <BankedDie value={die.value} />
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
            isPlayerSide ? "justify-end pb-3" : "justify-start pt-3",
          ].join(" ")}
        >
          {isBotSide ? (
            <>
              <div className="order-1 w-full">{diceNode}</div>
              <div className="order-2 flex w-full justify-center">{cupNode}</div>
            </>
          ) : (
            <>
              <div className="order-1 flex w-full justify-center">{cupNode}</div>
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
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <BankedDie value={die.value} />
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
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.5rem] p-1 sm:rounded-[2.75rem] sm:p-5">
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <img
          src="/logo/logo.png"
          alt="Board logo"
          className="w-48 opacity-60 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] sm:w-64 md:w-80"
        />
      </div>

      <div className="relative z-10 grid h-full min-h-0 grid-rows-2 gap-1 sm:gap-4">
        {renderTurnSide("bot")}
        {renderTurnSide("player")}
      </div>
    </div>
  );
}