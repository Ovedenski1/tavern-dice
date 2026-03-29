"use client";

import Image from "next/image";
import { ReactNode, useState } from "react";
import clsx from "clsx";

type Props = {
  playerScore: number;
  targetScore: number;
  turnPoints: number;
  selectedPoints: number;
  isPlayerTurn: boolean;
  bankButton?: ReactNode;
  className?: string;
};

export default function PlayerPanel({
  playerScore,
  targetScore,
  turnPoints,
  selectedPoints,
  isPlayerTurn,
  bankButton,
  className,
}: Props) {
  const [avatarFailed, setAvatarFailed] = useState(false);

  return (
    <div
      className={clsx(
        "grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 p-2 sm:gap-4 sm:p-5",
        className
      )}
    >
      <div className="relative h-14 w-14 overflow-hidden rounded-full border-4 border-sky-300/40 sm:h-18 sm:w-18">
        {!avatarFailed ? (
          <Image
            src="/player/player.png"
            alt="Player avatar"
            fill
            sizes="(max-width: 640px) 56px, 72px"
            className="object-cover"
            onError={() => setAvatarFailed(true)}
          />
        ) : null}
      </div>

      <div className="min-w-0 px-2 py-0.5 text-left sm:px-5 sm:py-0">
        <div className="truncate text-sm text-stone-300">Player</div>
        <div className="mt-0.5 text-2xl font-bold text-sky-300 sm:mt-1 sm:text-3xl">
          {playerScore}/{targetScore}
        </div>
      </div>

      <div>
        {bankButton}
      </div>

      <div className="min-w-[86px] text-center sm:min-w-[120px]">
        <div className="text-[10px] uppercase tracking-[0.2em] text-stone-300 sm:text-xs sm:tracking-[0.28em]">
          Selected
        </div>
        <div className="mt-0.5 text-2xl font-bold text-stone-100 sm:mt-2 sm:text-3xl">
          {isPlayerTurn ? selectedPoints : 0}
        </div>
      </div>

      <div className="min-w-[86px] text-center sm:min-w-[120px]">
        <div className="text-[10px] uppercase tracking-[0.2em] text-stone-300 sm:text-xs sm:tracking-[0.28em]">
          This Turn
        </div>
        <div className="mt-0.5 text-2xl font-bold text-stone-100 sm:mt-2 sm:text-3xl">
          {isPlayerTurn ? turnPoints : 0}
        </div>
      </div>
    </div>
  );
}