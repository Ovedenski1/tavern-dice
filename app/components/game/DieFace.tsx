"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Face, DieType } from "../../types/game";
import { DIE_PIPS } from "../../lib/constants";

type Props = {
  value: Face;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  dieType?: DieType;
  iceGhost?: boolean;
  playable?: boolean;
};

function SelectionCorners({ playable = false }: { playable?: boolean }) {
  const color = playable ? "#FACC15" : "#FFFFFF";

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div
        className="absolute left-[-8px] top-[-8px] h-[12px] w-[12px] border-l-[4px] border-t-[4px] lg:left-[-5px] lg:top-[-5px] lg:h-[8px] lg:w-[8px] lg:border-l-[3px] lg:border-t-[3px]"
        style={{ borderColor: color }}
      />
      <div
        className="absolute right-[-8px] top-[-8px] h-[12px] w-[12px] border-r-[4px] border-t-[4px] lg:right-[-5px] lg:top-[-5px] lg:h-[8px] lg:w-[8px] lg:border-r-[3px] lg:border-t-[3px]"
        style={{ borderColor: color }}
      />
      <div
        className="absolute bottom-[-8px] left-[-8px] h-[12px] w-[12px] border-b-[4px] border-l-[4px] lg:bottom-[-5px] lg:left-[-5px] lg:h-[8px] lg:w-[8px] lg:border-b-[3px] lg:border-l-[3px]"
        style={{ borderColor: color }}
      />
      <div
        className="absolute bottom-[-8px] right-[-8px] h-[12px] w-[12px] border-b-[4px] border-r-[4px] lg:bottom-[-5px] lg:right-[-5px] lg:h-[8px] lg:w-[8px] lg:border-b-[3px] lg:border-r-[3px]"
        style={{ borderColor: color }}
      />
    </div>
  );
}

function ReversiPentagram() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className="h-[70%] w-[70%]"
        style={{ imageRendering: "pixelated" }}
        aria-hidden="true"
      >
        <polygon
          points="50,10 61,39 92,39 67,57 76,88 50,69 24,88 33,57 8,39 39,39"
          fill="none"
          stroke="#000000"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="50" r="31" fill="none" stroke="#000000" strokeWidth="4" />
      </svg>
    </div>
  );
}

function ChopperX() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
      <div className="relative h-[70%] w-[70%]">
        <div className="absolute left-1/2 top-1/2 h-[8px] w-full -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-white" />
        <div className="absolute left-1/2 top-1/2 h-[8px] w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-white" />
      </div>
    </div>
  );
}

function DieFaceComponent({
  value,
  selected = false,
  onClick,
  disabled = false,
  dieType = "normal",
  iceGhost = false,
  playable = false,
}: Props) {
  const pips = DIE_PIPS[value];

  const showPips =
    (dieType !== "joker" || value !== 1) &&
    (dieType !== "devil" || value !== 1) &&
    (dieType !== "holy" || value !== 1) &&
    (dieType !== "merry" || value !== 1) &&
    (dieType !== "sun" || value !== 1) &&
    (dieType !== "sunny" || value !== 1) &&
    (dieType !== "scar" || value !== 3) &&
    (dieType !== "germa" || value !== 6) &&
    (dieType !== "chopper" || value !== 5) &&
    !(dieType === "lucky" && value === 4);

  const finalShowPips = showPips && dieType !== "void";

  const baseStyle =
    dieType === "lucky"
      ? "bg-[#FFD700] border-[#B78C00]"
      : dieType === "wooden"
        ? "bg-[#D9B38C] border-[#8B5A2B]"
        : dieType === "unlucky"
          ? "bg-[#4CAF50] border-[#2E7D32]"
          : dieType === "unbalanced"
            ? "bg-[#A7A7A7] border-[#6B6B6B]"
            : dieType === "odd"
              ? "bg-[#D8C3A5] border-[#A1887F]"
              : dieType === "misfortune"
                ? "bg-[#8E44AD] border-[#5E3370]"
                : dieType === "joker"
                  ? "bg-[#F2F2F2] border-[#B86ACF]"
                  : dieType === "devil"
                    ? "bg-[#2B1240] border-[#13071E]"
                    : dieType === "holy"
                      ? "bg-[#F7F0C6] border-[#D1BC57]"
                      : dieType === "gambler"
                        ? "bg-[#F2F2F2] border-[#2E9F6B]"
                        : dieType === "void"
                          ? "bg-[#0D0A1A] border-[#5F4B8B]"
                          : dieType === "memory"
                            ? "bg-[#F4A6D7] border-[#D66BA0]"
                            : dieType === "ice"
                              ? iceGhost
                                ? "bg-[rgba(210,245,255,0.22)] border-[rgba(190,236,250,0.55)]"
                                : "bg-[#AEE9FF] border-[#61B7DA]"
                              : dieType === "block"
                                ? "bg-[#F2F2F2] border-[#444444]"
                                : dieType === "middle"
                                  ? "bg-[#B8BCC2] border-[#7B7F86]"
                                  : dieType === "lost"
                                    ? "bg-[#426133] border-[#213219]"
                                    : dieType === "merry"
                                      ? "bg-[#F2F0E6] border-[#6E695C]"
                                      : dieType === "sun"
                                        ? "bg-[#95D2FA] border-[#4C94BC]"
                                        : dieType === "scar"
                                          ? "bg-[#AC243B] border-[#65111F]"
                                          : dieType === "germa"
                                            ? "bg-[#12161B] border-[#2A323B]"
                                            : dieType === "sunny"
                                              ? "bg-[#F2F0E6] border-[#6E695C]"
                                              : dieType === "chopper"
                                                ? "bg-[#FF89C8] border-[#C84E93]"
                                                : "bg-[#F2F0E6] border-[#6E695C]";

  const pipColor =
    dieType === "germa"
      ? "bg-[#FDDA00]"
      : dieType === "unbalanced"
        ? "bg-[#3F3F3F]"
        : dieType === "ice"
          ? iceGhost
            ? "bg-[rgba(235,252,255,0.55)]"
            : "bg-[#EAFBFF]"
          : dieType === "middle"
            ? "bg-[#4A4F57]"
            : "bg-black";

  const pipSize =
    dieType === "odd" || dieType === "misfortune"
      ? "h-[clamp(0.22rem,0.60vw,0.50rem)] w-[clamp(0.22rem,0.60vw,0.50rem)] lg:h-[0.18rem] lg:w-[0.18rem]"
      : "h-[clamp(0.30rem,0.78vw,0.68rem)] w-[clamp(0.30rem,0.78vw,0.68rem)] lg:h-[0.24rem] lg:w-[0.24rem]";

  const customSurfaceStyle =
    dieType === "wooden"
      ? {
          backgroundColor: "#D9B38C",
          backgroundImage: `
            linear-gradient(to bottom, rgba(255,255,255,0.08) 0 0),
            repeating-linear-gradient(
              0deg,
              rgba(139,90,43,0.08) 0px,
              rgba(139,90,43,0.08) 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )
          `,
        }
      : dieType === "void"
        ? {
            backgroundColor: "#0D0A1A",
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(139,92,246,0.28) 0 8%, transparent 9% 100%),
              radial-gradient(circle at 70% 35%, rgba(59,130,246,0.22) 0 6%, transparent 7% 100%),
              radial-gradient(circle at 55% 72%, rgba(236,72,153,0.18) 0 5%, transparent 6% 100%)
            `,
          }
        : dieType === "devil"
          ? {
              backgroundColor: "#2B1240",
              backgroundImage: `
                linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(0,0,0,0.08)),
                repeating-linear-gradient(
                  0deg,
                  rgba(255,255,255,0.025) 0px,
                  rgba(255,255,255,0.025) 2px,
                  rgba(0,0,0,0.045) 2px,
                  rgba(0,0,0,0.045) 4px
                )
              `,
            }
          : dieType === "ice" && iceGhost
            ? { backgroundColor: "rgba(210,245,255,0.22)" }
            : undefined;

  const buttonStyle = {
    ...customSurfaceStyle,
    boxShadow: `
      inset 0 0 0 1px rgba(255,255,255,0.15),
      -2px -2px 0 rgba(255,255,255,0.22),
      2px 2px 0 rgba(0,0,0,0.32)
    `,
  } as const;

  return (
    <motion.div
      className="relative"
      style={{ imageRendering: "pixelated" }}
      animate={selected && playable ? { y: [0, -4, 0] } : { y: 0 }}
      transition={
        selected && playable
          ? { duration: 1.15, repeat: Infinity, ease: "easeInOut" }
          : { type: "spring", stiffness: 260, damping: 18 }
      }
    >
      <button
        type="button"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        style={buttonStyle}
        className={[
          "relative grid h-[clamp(2.3rem,6vw,4.4rem)] w-[clamp(2.3rem,6vw,4.4rem)] grid-cols-3 grid-rows-3 border-[3px] transition lg:h-[2.2rem] lg:w-[2.2rem] lg:border-[2px]",
          "rounded-[0.18rem] sm:rounded-[0.22rem]",
          baseStyle,
          disabled ? "cursor-default" : "cursor-pointer",
          dieType === "ice" && iceGhost ? "opacity-80" : "",
        ].join(" ")}
      >
        {dieType === "lucky" && value === 4 && (
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
            <img
              src="/die/clover.png"
              alt="Lucky clover"
              className="h-[58%] w-[58%] object-contain opacity-90 [image-rendering:pixelated]"
            />
          </div>
        )}

        {dieType === "joker" && value === 1 && (
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
            <img
              src="/die/joker.png"
              alt="Joker die"
              className="h-[72%] w-[72%] object-contain opacity-95 [image-rendering:pixelated]"
            />
          </div>
        )}

        {dieType === "devil" && value === 1 && <ReversiPentagram />}

        {dieType === "holy" && value === 1 && (
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
            <img
              src="/die/nikadance.png"
              alt="Nika dice"
              className="h-[72%] w-[72%] object-contain opacity-95 [image-rendering:pixelated]"
            />
          </div>
        )}

        {dieType === "merry" && value === 1 && (
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
            <img src="/die/merry.png" alt="Going Merry" className="h-[72%] w-[72%] object-contain [image-rendering:pixelated]" />
          </div>
        )}

        {dieType === "sun" && value === 1 && (
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
            <img src="/die/sun.png" alt="Sun die" className="h-[72%] w-[72%] object-contain [image-rendering:pixelated]" />
          </div>
        )}

        {dieType === "scar" && value === 3 && (
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
            <img src="/die/scar.png" alt="Scar die" className="h-[72%] w-[72%] object-contain [image-rendering:pixelated]" />
          </div>
        )}

        {dieType === "germa" && value === 6 && (
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
            <img src="/die/66.png" alt="Germa 66" className="h-[72%] w-[72%] object-contain [image-rendering:pixelated]" />
          </div>
        )}

        {dieType === "sunny" && value === 1 && (
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
            <img src="/die/sunny.png" alt="Sunny die" className="h-[72%] w-[72%] object-contain [image-rendering:pixelated]" />
          </div>
        )}

        {dieType === "chopper" && value === 5 && <ChopperX />}

        {dieType === "void" && (
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
            <img
              src="/die/void.png"
              alt="Void die"
              className="h-[72%] w-[72%] object-contain opacity-95 [image-rendering:pixelated]"
            />
          </div>
        )}

        {dieType === "block" && (
          <div className="pointer-events-none absolute inset-0 z-[20] flex items-center justify-center">
            <div className="relative h-[72%] w-[72%]">
              <div className="absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 border-[3px] border-[#444444]" />
              <div className="absolute left-1/2 top-1/2 h-[3px] w-[92%] -translate-x-1/2 -translate-y-1/2 rotate-[-35deg] bg-[#444444]" />
            </div>
          </div>
        )}

        {finalShowPips &&
          Array.from({ length: 9 }).map((_, i) => {
            const idx = i + 1;
            const filled = pips.includes(idx);

            return (
              <div key={idx} className="relative z-10 flex items-center justify-center">
                {filled ? (
                  <span
                    className={[pipSize, pipColor, "block"].join(" ")}
                    style={{
                      borderRadius: "1px",
                      boxShadow:
                        "1px 1px 0 rgba(0,0,0,0.45), inset 1px 1px 0 rgba(255,255,255,0.12)",
                    }}
                  />
                ) : null}
              </div>
            );
          })}

        {selected && <SelectionCorners playable={playable} />}
      </button>
    </motion.div>
  );
}

export default memo(DieFaceComponent);
