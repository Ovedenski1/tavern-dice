"use client";

import { motion } from "framer-motion";
import RulesModal from "./RulesModal";

type Props = {
  onBack: () => void;
};

export default function RulesScreen({ onBack }: Props) {
  return (
    <motion.div
      key="rules"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <RulesModal onBack={onBack} />
    </motion.div>
  );
}