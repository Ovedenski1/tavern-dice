import Image from "next/image";
import clsx from "clsx";

type Props = {
  botScore: number;
  botName: string;
  botAvatar: string;
  targetScore: number;
  turnPoints: number;
  selectedPoints: number;
  isPlayerTurn: boolean;
  className?: string;
};

export default function ScorePanel({
  botScore,
  botName,
  botAvatar,
  targetScore,
  turnPoints,
  selectedPoints,
  isPlayerTurn,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        "grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 px-1 py-1 sm:gap-3 sm:px-2 sm:py-2 md:gap-4 md:px-3",
        className
      )}
    >
      <div className="relative h-[clamp(2.8rem,8vw,4.8rem)] w-[clamp(2.8rem,8vw,4.8rem)] overflow-hidden rounded-full border-[3px] border-amber-300/45 sm:border-4">
        <Image
          src={botAvatar}
          alt={botName}
          fill
          sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 76px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 px-1 text-left sm:px-2 md:px-3">
        <div className="truncate text-[clamp(0.8rem,1.7vw,1.1rem)] text-stone-200">{botName}</div>
        <div className="mt-0.5 text-[clamp(1.25rem,3.5vw,2.4rem)] font-bold leading-none text-rose-300">
          {botScore}/{targetScore}
        </div>
      </div>

      <div className="min-w-[72px] text-center sm:min-w-[96px] md:min-w-[132px]">
        <div className="text-[clamp(0.55rem,1.2vw,0.8rem)] uppercase tracking-[0.22em] text-stone-200 sm:tracking-[0.28em]">
          Selected
        </div>
        <div className="mt-0.5 text-[clamp(1.1rem,3vw,2.2rem)] font-bold leading-none text-stone-50">
          {isPlayerTurn ? 0 : selectedPoints}
        </div>
      </div>

      <div className="min-w-[72px] text-center sm:min-w-[96px] md:min-w-[132px]">
        <div className="text-[clamp(0.55rem,1.2vw,0.8rem)] uppercase tracking-[0.22em] text-stone-200 sm:tracking-[0.28em]">
          This Turn
        </div>
        <div className="mt-0.5 text-[clamp(1.1rem,3vw,2.2rem)] font-bold leading-none text-stone-50">
          {isPlayerTurn ? 0 : turnPoints}
        </div>
      </div>
    </div>
  );
}