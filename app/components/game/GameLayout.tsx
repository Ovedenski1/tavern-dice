"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, Play, ScrollText } from "lucide-react";

import Button from "../ui/Button";
import Panel from "../ui/Panel";
import Cup from "./Cup";
import BotCard from "./BotCard";
import DiceBoard from "./DiceBoard";
import PlayerPanel from "./PlayerPanel";
import RulesModal from "./RulesModal";
import ScorePanel from "./ScorePanel";
import SoundEffects from "./SoundEffects";
import BackgroundMusic from "./BackgroundMusic";
import SoundControls from "./SoundControls";
import GamePopup from "./GamePopUp";

import { BOTS } from "../../lib/bots";
import {
  bestBotSelection,
  hasAnyScoringDice,
  rollDice,
  scoreSelectedDice,
  shouldBotRollAgain,
} from "../../lib/gameLogic";
import { wait } from "../../lib/utils";
import { Bot, Die, Phase, PlayerSide, Scores, TurnState } from "../../types/game";

type FrozenBoard = {
  rolledDice: Die[];
  bankedDice: Die[];
};

type BankImageButtonProps = {
  onClick: () => void;
  disabled: boolean;
};

function BankImageButton({
  onClick,
  disabled,
}: BankImageButtonProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label="Bank points"
      className={[
        "relative h-[clamp(3.2rem,8vw,4.6rem)] w-[clamp(4.4rem,10vw,6.4rem)] transition",
        disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer",
      ].join(" ")}
    >
      <Image
        src="/bank/bank.png"
        alt="Bank"
        fill
        sizes="(max-width: 640px) 72px, (max-width: 1024px) 88px, 102px"
        className="object-contain"
        priority
      />
    </button>
  );
}

export default function GameLayout() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [scores, setScores] = useState<Scores>({ player: 0, bot: 0 });
  const [turn, setTurn] = useState<PlayerSide>("player");
  const [rolling, setRolling] = useState(false);
  const [message, setMessage] = useState("Welcome to the tavern.");
  const [winner, setWinner] = useState<PlayerSide | null>(null);
  const [botSelectedPoints, setBotSelectedPoints] = useState(0);
  const [showRulesOverlay, setShowRulesOverlay] = useState(false);

  const [soundsMuted, setSoundsMuted] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);

  const [boardResultImage, setBoardResultImage] = useState<string | null>(null);
  const [centerPopupImage, setCenterPopupImage] = useState<string | null>(null);

  const [shakeTick, setShakeTick] = useState(0);
  const [fallTick, setFallTick] = useState(0);
  const [clickTick, setClickTick] = useState(0);
  const [riskyTick, setRiskyTick] = useState(0);
  const [luckyTick, setLuckyTick] = useState(0);
  const [bustTick, setBustTick] = useState(0);
  const [bigLossTick, setBigLossTick] = useState(0);

  const [pendingLucky, setPendingLucky] = useState(false);

  const botActionInFlight = useRef(false);

  const [frozenPlayerBoard, setFrozenPlayerBoard] = useState<FrozenBoard | null>(null);
  const [frozenBotBoard, setFrozenBotBoard] = useState<FrozenBoard | null>(null);

  const [turnState, setTurnState] = useState<TurnState>({
    rolledDice: [],
    bankedDice: [],
    unscoredTurnPoints: 0,
    canContinue: false,
    hotDice: false,
  });

  const target = selectedBot?.target ?? 2000;

  const selectedDice = useMemo(
    () => turnState.rolledDice.filter((d) => d.selected),
    [turnState.rolledDice]
  );

  const selectedPreview = useMemo(
    () => scoreSelectedDice(selectedDice.map((d) => d.value)),
    [selectedDice]
  );

  const playerSelectedPoints =
    turn === "player" && selectedPreview.valid ? selectedPreview.score : 0;

  const remainingDiceCount = turnState.rolledDice.filter((d) => !d.selected).length;
  const isStartOfTurn = turnState.rolledDice.length === 0;
  const canAutoHoldSelected = selectedDice.length > 0 && selectedPreview.valid;
  const canRollNow = isStartOfTurn || canAutoHoldSelected;

  const showBoardResult = boardResultImage !== null;

  function cloneDice(dice: Die[]) {
    return dice.map((die) => ({ ...die }));
  }

  function bump(setter: React.Dispatch<React.SetStateAction<number>>) {
    setter((prev) => prev + 1);
  }

  function showCenterPopup(imageSrc: string, duration = 1100) {
    setCenterPopupImage(imageSrc);
    window.setTimeout(() => {
      setCenterPopupImage((current) => (current === imageSrc ? null : current));
    }, duration);
  }

  function triggerLucky() {
    setPendingLucky(false);
    bump(setLuckyTick);
    showCenterPopup("/messages/lucky.png", 1000);
  }

  function buildFrozenBoardFromCurrentState(includeSelectedInBank: boolean): FrozenBoard {
    const selected = turnState.rolledDice
      .filter((die) => die.selected)
      .map((die) => ({ ...die, selected: false }));

    const unselected = turnState.rolledDice
      .filter((die) => !die.selected)
      .map((die) => ({ ...die, selected: false }));

    return {
      rolledDice: includeSelectedInBank
        ? unselected
        : cloneDice(turnState.rolledDice).map((d) => ({ ...d, selected: false })),
      bankedDice: includeSelectedInBank
        ? [...cloneDice(turnState.bankedDice), ...selected]
        : cloneDice(turnState.bankedDice),
    };
  }

  function buildFrozenBoardForBotPick(pickIds: string[]): FrozenBoard {
    const chosen = turnState.rolledDice
      .filter((die) => pickIds.includes(die.id))
      .map((die) => ({ ...die, selected: false }));

    const left = turnState.rolledDice
      .filter((die) => !pickIds.includes(die.id))
      .map((die) => ({ ...die, selected: false }));

    return {
      rolledDice: left,
      bankedDice: [...cloneDice(turnState.bankedDice), ...chosen],
    };
  }

  function resetTurn(side: PlayerSide) {
    setBotSelectedPoints(0);
    setBoardResultImage(null);
    setPendingLucky(false);

    if (side === "player") {
      setFrozenPlayerBoard(null);
    } else {
      setFrozenBotBoard(null);
    }

    setTurn(side);
    setTurnState({
      rolledDice: [],
      bankedDice: [],
      unscoredTurnPoints: 0,
      canContinue: false,
      hotDice: false,
    });
  }

  function startNewGame(bot: Bot) {
    setSelectedBot(bot);
    setScores({ player: 0, bot: 0 });
    setWinner(null);
    setBotSelectedPoints(0);
    setShowRulesOverlay(false);
    setBoardResultImage(null);
    setCenterPopupImage(null);
    setPendingLucky(false);
    setFrozenPlayerBoard(null);
    setFrozenBotBoard(null);
    setMessage(`You are facing ${bot.name}. First to ${bot.target} wins.`);
    resetTurn("player");
    setPhase("playing");
  }

  const endTurnBust = useCallback(() => {
    setBotSelectedPoints(0);
    setBoardResultImage(null);
    setPendingLucky(false);

    if (turn === "player") {
      resetTurn("bot");
    } else {
      resetTurn("player");
    }
  }, [turn]);

  const doRoll = useCallback(
    async (diceCount: number, fromRisky = false) => {
      setRolling(true);
      setBotSelectedPoints(0);
      setBoardResultImage(null);
      bump(setShakeTick);

      await wait(850);

      const newDice = rollDice(diceCount);
      const scoring = hasAnyScoringDice(newDice);

      setTurnState((prev) => ({
        ...prev,
        rolledDice: newDice,
        canContinue: scoring,
        hotDice: false,
      }));

      setRolling(false);
      bump(setFallTick);

      if (fromRisky && turn === "player") {
        if (scoring) {
          setPendingLucky(true);
        } else {
          setPendingLucky(false);
        }
      }

      if (!scoring) {
        const lostPoints = turnState.unscoredTurnPoints;
        const isBigLoss = lostPoints > 1000;

        setMessage(`${turn === "player" ? "You" : selectedBot?.name} busted and lost the turn points.`);
        setBoardResultImage(isBigLoss ? "/messages/bigloss.png" : "/messages/bust.png");

        if (isBigLoss) {
          bump(setBigLossTick);
        } else {
          bump(setBustTick);
        }

        await wait(1500);
        setBoardResultImage(null);
        endTurnBust();
      } else {
        setMessage(
          turn === "player"
            ? "Choose scoring dice or bank your points."
            : `${selectedBot?.name} studies the roll.`
        );
      }
    },
    [endTurnBust, selectedBot?.name, turn, turnState.unscoredTurnPoints]
  );

  const moveSelectedDiceToHeld = useCallback(() => {
    if (!selectedDice.length || !selectedPreview.valid) {
      return null;
    }

    const hotDice = remainingDiceCount === 0;

    setTurnState((prev) => {
      const picked = prev.rolledDice.filter((d) => d.selected);
      const left = prev.rolledDice.filter((d) => !d.selected);

      return {
        rolledDice: hotDice ? [] : left,
        bankedDice: hotDice
          ? []
          : [...prev.bankedDice, ...picked.map((d) => ({ ...d, selected: false }))],
        unscoredTurnPoints: prev.unscoredTurnPoints + selectedPreview.score,
        canContinue: true,
        hotDice,
      };
    });

    return {
      hotDice,
      nextDiceToRoll: hotDice ? 6 : remainingDiceCount,
      score: selectedPreview.score,
    };
  }, [remainingDiceCount, selectedDice.length, selectedPreview.score, selectedPreview.valid]);

  function handleRoll() {
    if (rolling || turn !== "player" || showRulesOverlay || showBoardResult) return;

    if (turnState.rolledDice.length === 0) {
      void doRoll(6);
      return;
    }

    if (selectedDice.length > 0) {
      if (!selectedPreview.valid) {
        setMessage("Choose a valid scoring set before rolling.");
        return;
      }

      const held = moveSelectedDiceToHeld();
      if (!held) return;

      if (pendingLucky) {
        triggerLucky();
      }

      if (held.nextDiceToRoll === 1) {
        bump(setRiskyTick);
        showCenterPopup("/messages/risky.png", 1000);
        setMessage("Risky...");
        void doRoll(held.nextDiceToRoll, true);
        return;
      }

      setMessage(
        held.hotDice
          ? "Hot dice! All six return to the cup."
          : `You held ${held.score} points and rolled again.`
      );
      void doRoll(held.nextDiceToRoll);
      return;
    }

    if (remainingDiceCount <= 0) return;
    void doRoll(remainingDiceCount);
  }

  function toggleSelect(id: string) {
    if (turn !== "player" || rolling || showRulesOverlay || showBoardResult) return;

    setTurnState((prev) => ({
      ...prev,
      rolledDice: prev.rolledDice.map((d) =>
        d.id === id ? { ...d, selected: !d.selected } : d
      ),
    }));

    bump(setClickTick);
  }

  function bankPoints() {
    if (turn !== "player" || showRulesOverlay || showBoardResult) return;

    if (turnState.rolledDice.length > 0 && selectedDice.length === 0) {
      setMessage("Select scoring dice before banking.");
      return;
    }

    if (selectedDice.length > 0 && !selectedPreview.valid) {
      setMessage("Choose a valid scoring set before banking.");
      return;
    }

    const selectedScore = selectedPreview.valid ? selectedPreview.score : 0;
    const pointsToBank = turnState.unscoredTurnPoints + selectedScore;

    if (pointsToBank <= 0) {
      setMessage("You need points before banking.");
      return;
    }

    if (pendingLucky) {
      triggerLucky();
    }

    setFrozenPlayerBoard(buildFrozenBoardFromCurrentState(true));

    const newTotal = scores.player + pointsToBank;
    setScores((prev) => ({ ...prev, player: newTotal }));

    if (newTotal >= target) {
      setWinner("player");
      setPhase("gameover");
      setMessage("You won the match!");
      return;
    }

    setMessage(`You banked ${pointsToBank} points.`);
    resetTurn("bot");
  }

  useEffect(() => {
    if (phase !== "playing") return;
    if (turn === "player") return;
    if (!selectedBot) return;
    if (rolling) return;
    if (showRulesOverlay) return;
    if (showBoardResult) return;
    if (botActionInFlight.current) return;

    const bot = selectedBot;
    botActionInFlight.current = true;

    async function botPlay() {
      try {
        if (turnState.rolledDice.length === 0) {
          setMessage(`${bot.name} shakes the cup...`);
          await doRoll(6);
          return;
        }

        const pick = bestBotSelection(
          turnState.rolledDice,
          bot,
          turnState.unscoredTurnPoints,
          scores.bot,
          scores.player
        );

        if (!pick) {
          setBotSelectedPoints(0);

          if (turnState.unscoredTurnPoints > 0) {
            setFrozenBotBoard({
              rolledDice: cloneDice(turnState.rolledDice).map((d) => ({ ...d, selected: false })),
              bankedDice: cloneDice(turnState.bankedDice).map((d) => ({ ...d, selected: false })),
            });

            const newTotal = scores.bot + turnState.unscoredTurnPoints;
            setScores((prev) => ({ ...prev, bot: newTotal }));

            if (newTotal >= target) {
              setWinner("bot");
              setPhase("gameover");
              setMessage(`${bot.name} wins the match.`);
              return;
            }

            setMessage(`${bot.name} banks ${turnState.unscoredTurnPoints} points.`);
            resetTurn("player");
          } else {
            endTurnBust();
          }
          return;
        }

        setBotSelectedPoints(pick.score);
        await wait(700);

        setTurnState((prev) => {
          const chosen = prev.rolledDice.filter((d) => pick.ids.includes(d.id));
          const left = prev.rolledDice.filter((d) => !pick.ids.includes(d.id));
          const hotDice = left.length === 0;

          return {
            rolledDice: hotDice ? [] : left,
            bankedDice: hotDice
              ? []
              : [...prev.bankedDice, ...chosen.map((d) => ({ ...d, selected: false }))],
            unscoredTurnPoints: prev.unscoredTurnPoints + pick.score,
            canContinue: true,
            hotDice,
          };
        });

        setBotSelectedPoints(0);
        setMessage(`${bot.name} holds ${pick.score} points.`);

        const futureTurn = turnState.unscoredTurnPoints + pick.score;
        const nextRemaining = turnState.rolledDice.length - pick.ids.length;
        const willRoll = shouldBotRollAgain(
          bot,
          futureTurn,
          nextRemaining,
          scores.bot,
          scores.player
        );

        await wait(950);

        if (!willRoll) {
          setFrozenBotBoard(buildFrozenBoardForBotPick(pick.ids));

          const newTotal = scores.bot + futureTurn;
          setScores((prev) => ({ ...prev, bot: newTotal }));

          if (newTotal >= target) {
            setWinner("bot");
            setPhase("gameover");
            setMessage(`${bot.name} wins the match.`);
            return;
          }

          setMessage(`${bot.name} banks ${futureTurn} points.`);
          resetTurn("player");
        } else {
          const toRoll = nextRemaining === 0 ? 6 : nextRemaining;
          setMessage(`${bot.name} rolls again.`);
          await doRoll(toRoll);
        }
      } finally {
        botActionInFlight.current = false;
      }
    }

    void botPlay();
  }, [
    phase,
    doRoll,
    endTurnBust,
    rolling,
    scores.bot,
    scores.player,
    selectedBot,
    showRulesOverlay,
    showBoardResult,
    target,
    turn,
    turnState.rolledDice,
    turnState.unscoredTurnPoints,
    turnState.bankedDice,
  ]);

  return (
    <div
      className={[
        "relative text-stone-100",
        phase === "playing"
          ? "h-[100dvh] overflow-hidden"
          : "min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#3a1d0f,_#120c09_45%,_#070606_100%)] px-2 py-2 sm:px-4 sm:py-8",
      ].join(" ")}
    >
      <BackgroundMusic muted={musicMuted} />
      <SoundEffects
        muted={soundsMuted}
        shakeTick={shakeTick}
        fallTick={fallTick}
        clickTick={clickTick}
        riskyTick={riskyTick}
        luckyTick={luckyTick}
        bustTick={bustTick}
        bigLossTick={bigLossTick}
      />

      {phase === "playing" && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-[150dvw] w-[150dvh] -translate-x-1/2 -translate-y-1/2 rotate-90 bg-[url('/board/board1.png')] bg-cover bg-center md:h-[135dvw] md:w-[135dvh]" />
        </div>
      )}

      <div
        className={
          phase === "playing"
            ? "relative z-10 mx-auto h-full w-full max-w-7xl px-2 py-2 sm:px-3 sm:py-3"
            : "relative z-10 mx-auto max-w-7xl"
        }
      >
        {phase !== "playing" && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-amber-200 md:text-5xl">
                Tavern Dice Duel
              </h1>
              <p className="mt-2 text-stone-300">
                Medieval dice game with animated rolls and AI opponents.
              </p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {phase === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]"
            >
              <Panel className="p-8">
                <h2 className="max-w-xl text-5xl font-bold leading-tight text-stone-50">
                  Start the duel.
                </h2>

                <p className="mt-5 max-w-2xl text-lg text-stone-300">
                  Choose an opponent, shake the cup, roll the dice, hold scoring dice
                  to the side, and race to the score goal.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Button variant="gold" onClick={() => setPhase("choose")}>
                    <span className="inline-flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Start Game
                    </span>
                  </Button>

                  <Button onClick={() => setPhase("rules")}>
                    <span className="inline-flex items-center gap-2">
                      <ScrollText className="h-5 w-5" />
                      Rules
                    </span>
                  </Button>
                </div>
              </Panel>

              <Panel className="p-8">
                <Cup rolling={true} />
              </Panel>
            </motion.div>
          )}

          {phase === "rules" && (
            <motion.div
              key="rules"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RulesModal onBack={() => setPhase("menu")} />
            </motion.div>
          )}

          {phase === "choose" && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-amber-200">Choose your opponent</h2>
                <Button onClick={() => setPhase("menu")}>Back</Button>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {BOTS.map((bot) => (
                  <BotCard key={bot.id} bot={bot} onSelect={startNewGame} />
                ))}
              </div>
            </motion.div>
          )}

          {phase === "playing" && selectedBot && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-2 md:gap-3"
            >
              <GamePopup imageSrc={centerPopupImage} />

              <div className="min-h-0">
                <ScorePanel
                  botScore={scores.bot}
                  botName={selectedBot.name}
                  botAvatar={selectedBot.avatar}
                  targetScore={target}
                  turnPoints={turnState.unscoredTurnPoints}
                  selectedPoints={botSelectedPoints}
                  isPlayerTurn={turn === "player"}
                  className="bg-transparent"
                />
              </div>

              <div className="min-h-0">
                <DiceBoard
                  rolledDice={turnState.rolledDice}
                  bankedDice={turnState.bankedDice}
                  frozenPlayerRolledDice={frozenPlayerBoard?.rolledDice ?? []}
                  frozenPlayerBankedDice={frozenPlayerBoard?.bankedDice ?? []}
                  frozenBotRolledDice={frozenBotBoard?.rolledDice ?? []}
                  frozenBotBankedDice={frozenBotBoard?.bankedDice ?? []}
                  onSelectDie={toggleSelect}
                  onRoll={handleRoll}
                  canSelect={turn === "player"}
                  rolling={rolling}
                  isPlayerTurn={turn === "player"}
                  canRoll={canRollNow}
                  resultImageSrc={boardResultImage}
                />
              </div>

              <div className="relative min-h-0">
                <PlayerPanel
                  playerScore={scores.player}
                  targetScore={target}
                  turnPoints={turnState.unscoredTurnPoints}
                  selectedPoints={playerSelectedPoints}
                  isPlayerTurn={turn === "player"}
                  bankButton={
                    <BankImageButton
                      onClick={bankPoints}
                      disabled={
                        turn !== "player" ||
                        rolling ||
                        (turnState.rolledDice.length > 0 && selectedDice.length === 0) ||
                        (selectedDice.length > 0 && !selectedPreview.valid) ||
                        (turnState.unscoredTurnPoints + (selectedPreview.valid ? selectedPreview.score : 0) <= 0)
                      }
                    />
                  }
                  className="bg-transparent"
                />

                <div className="absolute bottom-full right-0 z-20 mb-2 flex flex-col items-end gap-2">
                  <SoundControls
                    musicMuted={musicMuted}
                    soundsMuted={soundsMuted}
                    onToggleMusic={() => setMusicMuted((prev) => !prev)}
                    onToggleSounds={() => setSoundsMuted((prev) => !prev)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowRulesOverlay(true)}
                    className="rounded-2xl border border-white/20 bg-black/20 px-4 py-2 text-sm font-medium text-stone-100 backdrop-blur-sm transition hover:bg-black/30"
                  >
                    Rules
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showRulesOverlay && (
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
                      <RulesModal onBack={() => setShowRulesOverlay(false)} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {phase === "gameover" && selectedBot && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-3xl"
            >
              <Panel className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-300/15 text-amber-300">
                  <Crown className="h-10 w-10" />
                </div>

                <h2 className="text-4xl font-bold text-amber-200">
                  {winner === "player" ? "Victory" : "Defeat"}
                </h2>

                <p className="mt-3 text-lg text-stone-300">{message}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-5">
                    <div className="text-sm text-stone-400">Your score</div>
                    <div className="text-4xl font-bold text-stone-100">{scores.player}</div>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-5">
                    <div className="text-sm text-stone-400">{selectedBot.name}</div>
                    <div className="text-4xl font-bold text-stone-100">{scores.bot}</div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Button variant="gold" onClick={() => setPhase("choose")}>
                    Play Again
                  </Button>
                  <Button onClick={() => setPhase("menu")}>Main Menu</Button>
                </div>
              </Panel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}