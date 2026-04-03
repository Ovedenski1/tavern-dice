"use client";

import { AnimatePresence, motion } from "framer-motion";
import RulesModal from "./RulesModal";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function RulesOverlay({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto"
          >
            <RulesModal onBack={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}