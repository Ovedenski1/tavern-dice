"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  rolling: boolean;
  onClick?: () => void;
  disabled?: boolean;
  showIdleImage?: boolean;
  flipped?: boolean;
};

export default function Cup({
  rolling,
  onClick,
  disabled = false,
  showIdleImage = true,
  flipped = false,
}: Props) {
  return (
    <div className="relative mx-auto">
      <button
        type="button"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        aria-label="Roll dice cup"
        className={[
          "relative flex items-center justify-center",
          "h-[clamp(5.8rem,14vw,9rem)] w-[clamp(5.8rem,14vw,9rem)]",
          disabled ? "cursor-default" : "cursor-pointer",
        ].join(" ")}
      >
        <div className="absolute bottom-2 h-[clamp(0.7rem,1.8vw,1rem)] w-[clamp(3.8rem,9vw,5.8rem)] rounded-full bg-black/25 blur-md" />

        <div className="relative h-full w-full">
          <AnimatePresence mode="wait" initial={false}>
            {rolling ? (
              <motion.div
                key="cup"
                animate={{ rotate: [0, -8, 8, -6, 6, -3, 3, 0], y: [0, -4, 0] }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0"
                style={{ scaleY: flipped ? -1 : 1 }}
              >
                <Image
                  src="/cup/cup1.png"
                  alt="Rolling dice cup"
                  fill
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 140px, 180px"
                  className="object-contain"
                  priority
                />
              </motion.div>
            ) : showIdleImage ? (
              <div key="roll" className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-full w-full scale-[1.15]">
                  <Image
                    src="/cup/roll.png"
                    alt="Roll dice"
                    fill
                    sizes="(max-width: 640px) 96px, (max-width: 1024px) 140px, 180px"
                    className={[
                      "object-contain transition",
                      disabled ? "opacity-40 grayscale" : "opacity-100",
                    ].join(" ")}
                    priority
                  />
                </div>
              </div>
            ) : (
              <div key="hidden" className="absolute inset-0" />
            )}
          </AnimatePresence>
        </div>
      </button>
    </div>
  );
}