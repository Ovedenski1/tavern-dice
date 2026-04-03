"use client";

import Image from "next/image";
import clsx from "clsx";
import { StatueType } from "../../types/game";
import { getStatueImage, getStatueLabel } from "../../lib/statues";

type Props = {
  statue: StatueType | undefined | null;
  used?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  align?: "left" | "right";
  hideLabel?: boolean;
};

export default function StatueSlot({
  statue,
  used = false,
  disabled = false,
  onClick,
  align = "left",
  hideLabel = false,
}: Props) {
  const isEmpty =
    !statue ||
    statue === "none" ||
    !["cola", "gomgumfruit", "rumbleball", "cursemark"].includes(statue);

  if (isEmpty) {
    return (
      <div
        className={clsx(
          "flex flex-col items-center gap-1",
          align === "right" ? "items-end" : "items-start"
        )}
      >
        <div className="h-[72px] w-[72px] rounded-2xl border border-white/10 bg-black/10 backdrop-blur-sm" />
      </div>
    );
  }

  const src = getStatueImage(statue);
  const label = getStatueLabel(statue);

  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-1",
        align === "right" ? "items-end" : "items-start"
      )}
    >
      <button
        type="button"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={clsx(
          "relative flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm transition",
          disabled ? "cursor-default" : "cursor-pointer hover:bg-black/30",
          used ? "grayscale opacity-55" : "opacity-100"
        )}
        aria-label={label}
        title={label}
      >
        {src ? (
          <Image
            src={src}
            alt={label}
            fill
            sizes="72px"
            className="object-contain p-2"
          />
        ) : null}
      </button>

      {!hideLabel && (
        <div className="text-center text-xs text-stone-300">
          {label}
        </div>
      )}
    </div>
  );
}