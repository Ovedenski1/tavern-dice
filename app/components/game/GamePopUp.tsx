"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
  imageSrc: string | null;
  alt?: string;
};

export default function GamePopup({ imageSrc, alt = "Game message" }: Props) {
  return (
    <AnimatePresence>
      {imageSrc && (
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -12 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
        >
          <img
            src={imageSrc}
            alt={alt}
            className="w-48 select-none object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.65)] sm:w-64 md:w-72"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}