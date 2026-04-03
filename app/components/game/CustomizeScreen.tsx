"use client";

import { motion } from "framer-motion";

import DiceCustomizer from "./DiceCustomizer";
import { CustomDie, StatueType } from "../../types/game";

type Props = {
  dice: CustomDie[];
  setDice: React.Dispatch<React.SetStateAction<CustomDie[]>>;
  selectedStatue: StatueType;
  setSelectedStatue: React.Dispatch<React.SetStateAction<StatueType>>;
  onBack: () => void;
};

export default function CustomizeScreen({
  dice,
  setDice,
  selectedStatue,
  setSelectedStatue,
  onBack,
}: Props) {
  return (
    <motion.div
      key="customize"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <DiceCustomizer
        dice={dice}
        setDice={setDice}
        selectedStatue={selectedStatue}
        setSelectedStatue={setSelectedStatue}
        onBack={onBack}
      />
    </motion.div>
  );
}