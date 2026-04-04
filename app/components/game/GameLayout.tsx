"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";

import BackgroundMusic from "./BackgroundMusic";
import SoundEffects from "./SoundEffects";
import BankImageButton from "./BankImageButton";

import MenuScreen from "./MenuScreen";
import ChooseOpponentScreen from "./ChooseOpponentScreen";
import CustomizeScreen from "./CustomizeScreen";
import RulesScreen from "./RulesScreen";
import PlayingScreen from "./PlayingScreen";
import SettingsModal from "./SettingsModal";

import { BOTS } from "../../lib/bots";
import {
  bestBotSelection,
  canUseDevilPower,
  getBotBustSpeech,
  getBotComboSpeech,
  getBotDisplayAvatar,
  hasAnyScoringDice,
  rollDice,
  scoreSelectedDice,
  shouldBotRollAgain,
  shouldBotUseStatue,
} from "../../lib/gameLogic";
import { wait } from "../../lib/utils";
import {
  createNormalDiceSet,
  customDieFromDie,
  rebuildHotDiceAvailable,
  finalizeRemainingDiceForNextRoll,
  resetBankedDieRuntimeState,
  resetTurnRuntimeState,
  isSpecialHolyFace,
  isSpecialDevilFace,
  isDevilSixCombo,
} from "../../lib/gameHelpers";
import {
  Bot,
  CustomDie,
  Die,
  Phase,
  PlayerSide,
  Scores,
  StatueType,
  TurnState,
} from "../../types/game";

type FrozenBoard = {
  rolledDice: Die[];
  bankedDice: Die[];
};

type DevilBonusTurns = {
  player: number;
  bot: number;
};

type TvMessage = {
  text: string;
  color: string;
};

type TvCutin =
  | {
      kind: "frankycola";
      imageSrc: string;
      duration: number;
    }
  | {
      kind: "chopperdoctor";
      imageSrc: string;
      duration: number;
    };

const PROFILE_NAME_KEY = "franky-farkle-player-name";
const PROFILE_AVATAR_KEY = "franky-farkle-player-avatar";
const MUSIC_VOLUME_KEY = "franky-farkle-music-volume";
const SOUNDS_VOLUME_KEY = "franky-farkle-sounds-volume";
const SELECTED_TRACK_KEY = "franky-farkle-selected-track";

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

  const [musicVolume, setMusicVolume] = useState(70);
  const [soundsVolume, setSoundsVolume] = useState(80);
  const [selectedTrack, setSelectedTrack] = useState("Song 1");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [tvMessage, setTvMessage] = useState<TvMessage | null>(null);
  const [tvCutin, setTvCutin] = useState<TvCutin | null>(null);

  const [starterPreviewVisible, setStarterPreviewVisible] = useState(false);
  const [starterRandomizerRunning, setStarterRandomizerRunning] = useState(false);
  const [starterDisplayText, setStarterDisplayText] = useState<string | null>(null);

  const [gameReady, setGameReady] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const [shakeTick, setShakeTick] = useState(0);
  const [fallTick, setFallTick] = useState(0);
  const [clickTick, setClickTick] = useState(0);
  const [riskyTick, setRiskyTick] = useState(0);
  const [luckyTick, setLuckyTick] = useState(0);
  const [bustTick, setBustTick] = useState(0);
  const [bigLossTick, setBigLossTick] = useState(0);
  const [devilTick, setDevilTick] = useState(0);
  const [holyTick, setHolyTick] = useState(0);
  const [monkTick, setMonkTick] = useState(0);
  const [jokerTick, setJokerTick] = useState(0);

  const [frankyColaTick, setFrankyColaTick] = useState(0);
  const [chopperDoctorTick, setChopperDoctorTick] = useState(0);

  const [pendingLucky, setPendingLucky] = useState(false);
  const [playerDevilCurseTurns, setPlayerDevilCurseTurns] = useState(0);
  const [devilBonusTurns, setDevilBonusTurns] = useState<DevilBonusTurns>({
    player: 0,
    bot: 0,
  });

  const [customDice, setCustomDice] = useState<CustomDie[]>(createNormalDiceSet());

  const [selectedStatue, setSelectedStatue] = useState<StatueType>("none");

  const [gomuCooldownTurns, setGomuCooldownTurns] = useState(0);
  const [curseMarkUsed, setCurseMarkUsed] = useState(false);
  const [colaBuffTurns, setColaBuffTurns] = useState(0);
  const [colaUsed, setColaUsed] = useState(false);
  const [rumbleBallUsesLeft, setRumbleBallUsesLeft] = useState(3);
  const [rumbleBallActiveThisTurn, setRumbleBallActiveThisTurn] = useState(false);

  const [playerScorePopup, setPlayerScorePopup] = useState<number | null>(null);
  const [botScorePopup, setBotScorePopup] = useState<number | null>(null);

  const [playerProfileName, setPlayerProfileName] = useState("Player");
  const [playerProfileAvatar, setPlayerProfileAvatar] = useState<string | null>(null);

  const [botSpeechBubble, setBotSpeechBubble] = useState<string | null>(null);
  const [botColaBuffTurns, setBotColaBuffTurns] = useState(0);
  const [botColaUsed, setBotColaUsed] = useState(false);
  const [botRumbleBallUsesLeft, setBotRumbleBallUsesLeft] = useState(3);
  const [botRumbleBallActiveThisTurn, setBotRumbleBallActiveThisTurn] = useState(false);

  const [botPreviewSelectedIds, setBotPreviewSelectedIds] = useState<string[]>([]);

  const botActionInFlight = useRef(false);
  const devilCurseInFlight = useRef(false);
  const prevScoresRef = useRef<Scores>({ player: 0, bot: 0 });
  const playerPopupTimeoutRef = useRef<number | null>(null);
  const botPopupTimeoutRef = useRef<number | null>(null);
  const tvMessageTimeoutRef = useRef<number | null>(null);
  const botSpeechTimeoutRef = useRef<number | null>(null);
  const tvCutinTimeoutRef = useRef<number | null>(null);

  const [frozenPlayerBoard, setFrozenPlayerBoard] = useState<FrozenBoard | null>(null);
  const [frozenBotBoard, setFrozenBotBoard] = useState<FrozenBoard | null>(null);

  const [turnState, setTurnState] = useState<TurnState>({
    rolledDice: [],
    bankedDice: [],
    availableDice: createNormalDiceSet(),
    unscoredTurnPoints: 0,
    canContinue: false,
    hotDice: false,
  });

  const target = selectedBot?.target ?? 2000;
  const botLabel = selectedBot?.name?.toUpperCase() ?? "BOT";
  const playerStarterLabel = playerProfileName.trim().toUpperCase() || "PLAYER";
  const botAvatarDisplayed = getBotDisplayAvatar(selectedBot, scores.bot, scores.player);

  const selectedDice = useMemo(
    () => turnState.rolledDice.filter((d) => d.selected),
    [turnState.rolledDice]
  );

  const selectedPreview = useMemo(() => {
    const devilPower = canUseDevilPower(turnState.rolledDice, selectedDice);

    if (devilPower) {
      return {
        score: 1000,
        valid: true,
        devilPower: true,
      };
    }

    const base = scoreSelectedDice(selectedDice, selectedStatue);
    return {
      ...base,
      devilPower: false,
    };
  }, [selectedDice, turnState.rolledDice, selectedStatue]);

  const statueAdjustedSelectedPoints =
    turn === "player" && selectedPreview.valid ? selectedPreview.score : 0;

  const selectedComboPlayable =
    turn === "player" &&
    selectedDice.length > 0 &&
    selectedPreview.valid;

  const remainingDiceCount = turnState.rolledDice.filter((d) => !d.selected).length;
  const isStartOfTurn = turnState.rolledDice.length === 0;
  const canAutoHoldSelected =
    selectedDice.length > 0 && selectedPreview.valid && !selectedPreview.devilPower;
  const canRollNow = isStartOfTurn || canAutoHoldSelected;

  const currentBankablePoints =
    turnState.unscoredTurnPoints + (selectedPreview.valid ? selectedPreview.score : 0);

  function cloneDice(dice: Die[]) {
    return dice.map((die) => ({ ...die }));
  }

  function cloneCustomDice(dice: CustomDie[]) {
    return dice.map((die) => ({ ...die }));
  }

  function fullDiceSetFor(side: PlayerSide) {
    if (side === "player") {
      return cloneCustomDice(customDice).map(resetTurnRuntimeState);
    }
    return createNormalDiceSet();
  }

  function bump(setter: React.Dispatch<React.SetStateAction<number>>) {
    setter((prev) => prev + 1);
  }

  function showTvMessage(text: string, color: string, duration = 1100) {
    if (gameEnded) return;

    setTvMessage({ text, color });

    if (tvMessageTimeoutRef.current) {
      window.clearTimeout(tvMessageTimeoutRef.current);
    }

    tvMessageTimeoutRef.current = window.setTimeout(() => {
      setTvMessage(null);
      tvMessageTimeoutRef.current = null;
    }, duration);
  }

  function showBotSpeech(text: string | null, duration = 1500) {
    if (!text) return;

    setBotSpeechBubble(text);

    if (botSpeechTimeoutRef.current) {
      window.clearTimeout(botSpeechTimeoutRef.current);
    }

    botSpeechTimeoutRef.current = window.setTimeout(() => {
      setBotSpeechBubble(null);
      botSpeechTimeoutRef.current = null;
    }, duration);
  }

  function showTvCutin(next: TvCutin) {
    setTvCutin(next);

    if (tvCutinTimeoutRef.current) {
      window.clearTimeout(tvCutinTimeoutRef.current);
    }

    tvCutinTimeoutRef.current = window.setTimeout(() => {
      setTvCutin(null);
      tvCutinTimeoutRef.current = null;
    }, next.duration);
  }

  function triggerLucky() {
    setPendingLucky(false);
    bump(setLuckyTick);
    showTvMessage("LUCKY!", "#facc15", 1000);
  }

  function activateDevilBonus(side: PlayerSide) {
    setDevilBonusTurns((prev) => ({
      ...prev,
      [side]: prev[side] + 6,
    }));
  }

  function buildFrozenBoardFromCurrentState(includeSelectedInBank: boolean): FrozenBoard {
    const selected = turnState.rolledDice
      .filter((die) => die.selected)
      .map((die) => resetBankedDieRuntimeState(die));

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
      .map((die) => resetBankedDieRuntimeState(die));

    const left = turnState.rolledDice
      .filter((die) => !pickIds.includes(die.id))
      .map((die) => ({ ...die, selected: false }));

    return {
      rolledDice: left,
      bankedDice: [...cloneDice(turnState.bankedDice), ...chosen],
    };
  }

  function clearTurnOnlyStatueFlags() {
    setPendingLucky(false);
  }

  function onPlayerTurnStarted() {
    setRumbleBallActiveThisTurn(false);

    if (gomuCooldownTurns > 0) {
      setGomuCooldownTurns((prev) => Math.max(0, prev - 1));
    }
  }

  function onPlayerTurnFinished() {
    clearTurnOnlyStatueFlags();
    setRumbleBallActiveThisTurn(false);

    if (colaBuffTurns > 0) {
      setColaBuffTurns((prev) => Math.max(0, prev - 1));
    }
  }

  function onBotTurnStarted() {
    setBotRumbleBallActiveThisTurn(false);
  }

  function onBotTurnFinished() {
    setBotRumbleBallActiveThisTurn(false);

    if (botColaBuffTurns > 0) {
      setBotColaBuffTurns((prev) => Math.max(0, prev - 1));
    }
  }

  function finishGame(winnerSide: PlayerSide) {
    setWinner(winnerSide);
    setGameEnded(true);
    setTvMessage(null);
    setTvCutin(null);
    setRolling(false);
  }

  function resetTurn(side: PlayerSide) {
    if (gameEnded) return;

    setBotSelectedPoints(0);
    setBotPreviewSelectedIds([]);

    if (turn === "player") {
      onPlayerTurnFinished();
    } else {
      clearTurnOnlyStatueFlags();
      onBotTurnFinished();
    }

    if (side === "player") {
      setFrozenPlayerBoard(null);
      onPlayerTurnStarted();
    } else {
      setFrozenBotBoard(null);
      onBotTurnStarted();
    }

    if (devilBonusTurns[side] > 0) {
      setDevilBonusTurns((prev) => ({
        ...prev,
        [side]: Math.max(0, prev[side] - 1),
      }));

      const newTotal = (side === "player" ? scores.player : scores.bot) + 500;

      setScores((prev) =>
        side === "player"
          ? { ...prev, player: prev.player + 500 }
          : { ...prev, bot: prev.bot + 500 }
      );

      if (newTotal >= target) {
        finishGame(side);
        return;
      }
    }

    setTurn(side);
    setTurnState({
      rolledDice: [],
      bankedDice: [],
      availableDice: fullDiceSetFor(side),
      unscoredTurnPoints: 0,
      canContinue: false,
      hotDice: false,
    });
  }

  async function runStarterRandomizer(botName: string, playerName: string) {
    const botStarterText = botName.toUpperCase();
    const playerStarterText = playerName.trim().toUpperCase() || "PLAYER";

    setGameReady(false);
    setStarterPreviewVisible(true);
    setStarterRandomizerRunning(true);
    setStarterDisplayText(botStarterText);

    const totalSwitches = Math.floor(Math.random() * 11) + 10;
    let current = botStarterText;

    for (let i = 0; i < totalSwitches; i += 1) {
      await wait(140);
      current = current === botStarterText ? playerStarterText : botStarterText;
      setStarterDisplayText(current);
    }

    await wait(180);

    const picked: PlayerSide = Math.random() > 0.5 ? "bot" : "player";
    setStarterDisplayText(picked === "player" ? playerStarterText : botStarterText);
    setTurn(picked);
    setStarterRandomizerRunning(false);

    await wait(300);
    setGameReady(true);
  }

  function startNewGame(bot: Bot) {
    setSelectedBot(bot);
    setScores({ player: 0, bot: 0 });
    prevScoresRef.current = { player: 0, bot: 0 };
    setPlayerScorePopup(null);
    setBotScorePopup(null);

    setWinner(null);
    setGameEnded(false);
    setBotSelectedPoints(0);
    setBotPreviewSelectedIds([]);
    setShowRulesOverlay(false);
    setSettingsOpen(false);
    setTvMessage(null);
    setTvCutin(null);
    setPendingLucky(false);
    setPlayerDevilCurseTurns(0);
    setDevilBonusTurns({ player: 0, bot: 0 });
    setFrozenPlayerBoard(null);
    setFrozenBotBoard(null);

    setGomuCooldownTurns(0);
    setCurseMarkUsed(false);
    setColaBuffTurns(0);
    setColaUsed(false);
    setRumbleBallUsesLeft(3);
    setRumbleBallActiveThisTurn(false);

    setBotSpeechBubble(null);
    setBotColaBuffTurns(0);
    setBotColaUsed(false);
    setBotRumbleBallUsesLeft(3);
    setBotRumbleBallActiveThisTurn(false);

    setMessage(`You are facing ${bot.name}. First to ${bot.target} wins.`);
    setPhase("playing");
    setTurnState({
      rolledDice: [],
      bankedDice: [],
      availableDice: fullDiceSetFor("player"),
      unscoredTurnPoints: 0,
      canContinue: false,
      hotDice: false,
    });

    void runStarterRandomizer(bot.name, playerProfileName);
  }

  const endTurnBust = useCallback(() => {
    setBotSelectedPoints(0);
    setBotPreviewSelectedIds([]);

    if (turn === "player") {
      resetTurn("bot");
    } else {
      clearTurnOnlyStatueFlags();
      resetTurn("player");
    }
  }, [turn, gameEnded]);

  const doRoll = useCallback(
    async (diceSet: CustomDie[], fromRisky = false) => {
      if (!gameReady || gameEnded) return;

      if (starterPreviewVisible && !starterRandomizerRunning) {
        setStarterPreviewVisible(false);
      }

      setRolling(true);
      setBotSelectedPoints(0);
      setBotPreviewSelectedIds([]);
      bump(setShakeTick);

      await wait(850);

      const activeStatue = turn === "player" ? selectedStatue : "none";
      const newDice = rollDice(diceSet, activeStatue);
      const scoring = hasAnyScoringDice(newDice, activeStatue);

      setTurnState((prev) => ({
        ...prev,
        rolledDice: newDice,
        availableDice: cloneCustomDice(diceSet),
        canContinue: scoring,
        hotDice: false,
      }));

      setRolling(false);
      bump(setFallTick);

      if (fromRisky && turn === "player") {
        setPendingLucky(scoring);
      }

      if (!scoring) {
        const lostPoints = turnState.unscoredTurnPoints;
        const isBigLoss = lostPoints > 1000;

        if (turn === "bot") {
          showBotSpeech(getBotBustSpeech(selectedBot));
        }

        if (newDice.length === 1 && isSpecialDevilFace(newDice[0])) {
          setScores((prev) =>
            turn === "player"
              ? { ...prev, player: prev.player - 1000 }
              : { ...prev, bot: prev.bot - 1000 }
          );

          showTvMessage("DEVIL!", "#ef4444", 1200);
          await wait(1400);
          endTurnBust();
          return;
        }

        if (turn === "player" && rumbleBallActiveThisTurn && currentBankablePoints > 0) {
          const savedPoints = Math.floor(currentBankablePoints * 0.5);
          const newTotal = scores.player + savedPoints;

          setScores((prev) => ({ ...prev, player: prev.player + savedPoints }));
          showTvMessage("DOCTOR CHOPPER!", "#ff7ac8", 1200);

          if (newTotal >= target) {
            finishGame("player");
            return;
          }

          await wait(1200);
          endTurnBust();
          return;
        }

        if (turn === "bot" && botRumbleBallActiveThisTurn && currentBankablePoints > 0) {
          const savedPoints = Math.floor(currentBankablePoints * 0.5);
          const newTotal = scores.bot + savedPoints;

          setScores((prev) => ({ ...prev, bot: prev.bot + savedPoints }));
          showTvMessage("DOCTOR CHOPPER!", "#ff7ac8", 1200);

          if (newTotal >= target) {
            finishGame("bot");
            return;
          }

          await wait(1200);
          endTurnBust();
          return;
        }

        const hasHoly = newDice.some((die) => isSpecialHolyFace(die));
        const onlyHolyLeft = newDice.length === 1 && isSpecialHolyFace(newDice[0]);

        if (hasHoly) {
          if (onlyHolyLeft) {
            const savedPoints = Math.floor(turnState.unscoredTurnPoints / 2);

            if (savedPoints > 0) {
              const newTotal =
                turn === "player" ? scores.player + savedPoints : scores.bot + savedPoints;

              setScores((prev) =>
                turn === "player"
                  ? { ...prev, player: prev.player + savedPoints }
                  : { ...prev, bot: prev.bot + savedPoints }
              );

              if (newTotal >= target) {
                finishGame(turn);
                return;
              }
            }

            showTvMessage("HOLY!", "#facc15", 1200);
          } else {
            const savedPoints = 50;
            const newTotal =
              turn === "player" ? scores.player + savedPoints : scores.bot + savedPoints;

            setScores((prev) =>
              turn === "player"
                ? { ...prev, player: prev.player + savedPoints }
                : { ...prev, bot: prev.bot + savedPoints }
            );

            if (newTotal >= target) {
              finishGame(turn);
              return;
            }

            showTvMessage("HOLY!", "#facc15", 1200);
          }

          bump(setHolyTick);
          await wait(1400);
          endTurnBust();
        } else {
          if (turn === "player" && colaBuffTurns > 0 && currentBankablePoints > 0) {
            const penalty = Math.floor(currentBankablePoints * 1.5);
            setScores((prev) => ({
              ...prev,
              player: Math.max(0, prev.player - penalty),
            }));
            showTvMessage("SUPER!", "#60a5fa", 1200);
            await wait(1400);
            endTurnBust();
            return;
          }

          if (turn === "bot" && botColaBuffTurns > 0 && currentBankablePoints > 0) {
            const penalty = Math.floor(currentBankablePoints * 1.5);
            setScores((prev) => ({
              ...prev,
              bot: Math.max(0, prev.bot - penalty),
            }));
            showTvMessage("SUPER!", "#60a5fa", 1200);
            await wait(1400);
            endTurnBust();
            return;
          }

          showTvMessage(isBigLoss ? "BIG LOSS!" : "BUST!", isBigLoss ? "#ef4444" : "#f87171", 1200);

          if (isBigLoss) {
            bump(setBigLossTick);
          } else {
            bump(setBustTick);
          }

          await wait(1400);
          endTurnBust();
        }
      } else {
        setMessage(
          turn === "player"
            ? "Choose scoring dice or bank your points."
            : `${selectedBot?.name} studies the roll.`
        );
      }
    },
    [
      endTurnBust,
      scores.bot,
      scores.player,
      selectedBot,
      selectedBot?.name,
      target,
      turn,
      turnState.unscoredTurnPoints,
      selectedStatue,
      rumbleBallActiveThisTurn,
      botRumbleBallActiveThisTurn,
      colaBuffTurns,
      botColaBuffTurns,
      currentBankablePoints,
      gameReady,
      gameEnded,
      starterPreviewVisible,
      starterRandomizerRunning,
    ]
  );

  const moveSelectedDiceToHeld = useCallback(() => {
    if (!selectedDice.length || !selectedPreview.valid) {
      return null;
    }

    const picked = turnState.rolledDice.filter((d) => d.selected);
    const left = turnState.rolledDice.filter((d) => !d.selected);
    const hotDice = left.length === 0;

    let nextAvailableDice: CustomDie[];
    let iceBonus = 0;

    if (hotDice) {
      nextAvailableDice = rebuildHotDiceAvailable([...picked, ...left], turn, customDice);
    } else {
      const finalized = finalizeRemainingDiceForNextRoll(left);
      nextAvailableDice = finalized.nextAvailableDice;
      iceBonus = finalized.iceBonus;
    }

    if (selectedPreview.devilPower) {
      setPlayerDevilCurseTurns(3);
    }

    if (isDevilSixCombo(picked)) {
      activateDevilBonus(turn);
    }

    const bankedPicked = picked.map((d) => resetBankedDieRuntimeState(d));

    setTurnState((prev) => ({
      ...prev,
      rolledDice: hotDice ? [] : left,
      bankedDice: hotDice ? [] : [...prev.bankedDice, ...bankedPicked],
      availableDice: nextAvailableDice,
      unscoredTurnPoints: prev.unscoredTurnPoints + selectedPreview.score + iceBonus,
      canContinue: true,
      hotDice,
    }));

    return {
      hotDice,
      nextAvailableDice,
      score: selectedPreview.score,
      devilPower: selectedPreview.devilPower,
      iceBonus,
    };
  }, [
    selectedDice.length,
    selectedPreview.valid,
    selectedPreview.score,
    selectedPreview.devilPower,
    turnState.rolledDice,
    turn,
    customDice,
  ]);

  function handleRoll() {
    if (!gameReady || gameEnded) return;
    if (rolling || turn !== "player" || showRulesOverlay) return;

    if (turnState.rolledDice.length === 0) {
      void doRoll(turnState.availableDice);
      return;
    }

    if (selectedDice.length > 0) {
      if (!selectedPreview.valid) return;
      if (selectedPreview.devilPower) return;

      const held = moveSelectedDiceToHeld();
      if (!held) return;

      if (pendingLucky) {
        triggerLucky();
      }

      if (held.iceBonus > 0) {
        showTvMessage(`+${held.iceBonus}`, "#93c5fd", 1000);
      }

      if (held.nextAvailableDice.length === 1) {
        bump(setRiskyTick);
        showTvMessage("RISKY...", "#f59e0b", 1000);
        void doRoll(held.nextAvailableDice, true);
        return;
      }

      void doRoll(held.nextAvailableDice);
      return;
    }

    if (remainingDiceCount <= 0) return;
    void doRoll(turnState.availableDice);
  }

  function toggleSelect(id: string) {
    if (!gameReady || gameEnded) return;
    if (turn !== "player" || rolling || showRulesOverlay) return;

    setTurnState((prev) => ({
      ...prev,
      rolledDice: prev.rolledDice.map((d) =>
        d.id === id ? { ...d, selected: !d.selected } : d
      ),
    }));

    bump(setClickTick);
  }

  function bankPoints() {
    if (!gameReady || gameEnded) return;
    if (turn !== "player" || showRulesOverlay) return;

    if (turnState.rolledDice.length > 0 && selectedDice.length === 0) return;
    if (selectedDice.length > 0 && !selectedPreview.valid) return;

    const selectedScore = selectedPreview.valid ? selectedPreview.score : 0;
    let pointsToBank = turnState.unscoredTurnPoints + selectedScore;

    if (pointsToBank <= 0) return;

    if (colaBuffTurns > 0) {
      pointsToBank = Math.floor(pointsToBank * 1.5);
      showTvMessage("SUPER!", "#60a5fa", 1200);
    }

    if (pendingLucky) {
      triggerLucky();
    }

    if (selectedPreview.devilPower) {
      setPlayerDevilCurseTurns(3);
      bump(setDevilTick);
      showTvMessage("DEVIL DEAL!", "#ef4444", 1200);
    }

    if (isDevilSixCombo(selectedDice)) {
      activateDevilBonus("player");
    }

    setFrozenPlayerBoard(buildFrozenBoardFromCurrentState(true));

    const newTotal = scores.player + pointsToBank;
    setScores((prev) => ({ ...prev, player: newTotal }));

    if (newTotal >= target) {
      finishGame("player");
      return;
    }

    resetTurn("bot");
  }

  function rerollOneSelectedDieWithGomu() {
    if (turnState.rolledDice.length === 0) return;
    if (selectedDice.length !== 1) return;
    if (gomuCooldownTurns > 0) return;

    const dieToReroll = selectedDice[0];
    const rerollInput = customDieFromDie(dieToReroll);
    const [rerolledDie] = rollDice([rerollInput], selectedStatue);

    setTurnState((prev) => ({
      ...prev,
      rolledDice: prev.rolledDice.map((die) =>
        die.id === dieToReroll.id
          ? {
              ...rerolledDie,
              slot: dieToReroll.slot,
              selected: false,
            }
          : die
      ),
    }));

    setGomuCooldownTurns(5);
    showTvMessage("REROLL...", "#4ade80", 1200);
    bump(setShakeTick);
    bump(setFallTick);
  }

  function activateColaBuff() {
    if (colaUsed) return;

    setColaBuffTurns((prev) => Math.max(prev, 3));
    setColaUsed(true);
    showTvCutin({
      kind: "frankycola",
      imageSrc: "/tv/frankycola.png",
      duration: 2000,
    });
    bump(setFrankyColaTick);
  }

  function activateRumbleBall() {
    if (rumbleBallUsesLeft <= 0) return;
    if (rumbleBallActiveThisTurn) return;

    setRumbleBallUsesLeft((prev) => Math.max(0, prev - 1));
    setRumbleBallActiveThisTurn(true);
    showTvCutin({
      kind: "chopperdoctor",
      imageSrc: "/tv/chopperdoctor.png",
      duration: 2000,
    });
    bump(setChopperDoctorTick);
  }

  function activateCursedMark() {
    if (curseMarkUsed) return;

    if (turnState.rolledDice.length > 0 && selectedDice.length > 0 && !selectedPreview.valid) {
      return;
    }

    const pointsToDouble =
      turnState.unscoredTurnPoints + (selectedPreview.valid ? selectedPreview.score : 0);

    if (pointsToDouble <= 0) return;

    setFrozenPlayerBoard(buildFrozenBoardFromCurrentState(true));
    setCurseMarkUsed(true);

    const doubledPoints = pointsToDouble * 2;
    const newTotal = scores.player + doubledPoints;

    showTvMessage("DOUBLE!", "#c084fc", 1200);
    setScores((prev) => ({ ...prev, player: newTotal }));

    if (newTotal >= target) {
      finishGame("player");
      return;
    }

    resetTurn("bot");
  }

  function handlePlayerStatueClick() {
    if (!gameReady || gameEnded) return;
    if (phase !== "playing") return;
    if (turn !== "player") return;
    if (rolling) return;
    if (selectedStatue === "none") return;
    if (showRulesOverlay) return;

    if (selectedStatue === "gomgumfruit") {
      rerollOneSelectedDieWithGomu();
      return;
    }

    if (selectedStatue === "cursemark") {
      activateCursedMark();
      return;
    }

    if (selectedStatue === "cola") {
      activateColaBuff();
      return;
    }

    if (selectedStatue === "rumbleball") {
      activateRumbleBall();
    }
  }

  function handlePlayAgain() {
    setPhase("choose");
    setGameEnded(false);
    setWinner(null);
    setTvMessage(null);
    setTvCutin(null);
    setStarterPreviewVisible(false);
    setStarterRandomizerRunning(false);
    setStarterDisplayText(null);
    setGameReady(false);
    setSettingsOpen(false);
  }

  useEffect(() => {
    try {
      const savedName = localStorage.getItem(PROFILE_NAME_KEY);
      const savedAvatar = localStorage.getItem(PROFILE_AVATAR_KEY);

      if (savedName && savedName.trim()) {
        setPlayerProfileName(savedName.trim());
      }

      if (savedAvatar) {
        setPlayerProfileAvatar(savedAvatar);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const savedMusicVolume = localStorage.getItem(MUSIC_VOLUME_KEY);
      const savedSoundsVolume = localStorage.getItem(SOUNDS_VOLUME_KEY);
      const savedSelectedTrack = localStorage.getItem(SELECTED_TRACK_KEY);

      if (savedMusicVolume !== null) {
        setMusicVolume(Number(savedMusicVolume));
      }

      if (savedSoundsVolume !== null) {
        setSoundsVolume(Number(savedSoundsVolume));
      }

      if (savedSelectedTrack) {
        setSelectedTrack(savedSelectedTrack);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(MUSIC_VOLUME_KEY, String(musicVolume));
      localStorage.setItem(SOUNDS_VOLUME_KEY, String(soundsVolume));
      localStorage.setItem(SELECTED_TRACK_KEY, selectedTrack);
    } catch {}
  }, [musicVolume, soundsVolume, selectedTrack]);

  useEffect(() => {
    if (phase !== "playing") return;

    const prev = prevScoresRef.current;

    if (scores.player > prev.player) {
      const gained = scores.player - prev.player;
      setPlayerScorePopup(gained);

      if (playerPopupTimeoutRef.current) {
        window.clearTimeout(playerPopupTimeoutRef.current);
      }

      playerPopupTimeoutRef.current = window.setTimeout(() => {
        setPlayerScorePopup(null);
        playerPopupTimeoutRef.current = null;
      }, 1200);
    }

    if (scores.bot > prev.bot) {
      const gained = scores.bot - prev.bot;
      setBotScorePopup(gained);

      if (botPopupTimeoutRef.current) {
        window.clearTimeout(botPopupTimeoutRef.current);
      }

      botPopupTimeoutRef.current = window.setTimeout(() => {
        setBotScorePopup(null);
        botPopupTimeoutRef.current = null;
      }, 1200);
    }

    prevScoresRef.current = scores;
  }, [scores, phase]);

  useEffect(() => {
    return () => {
      if (playerPopupTimeoutRef.current) window.clearTimeout(playerPopupTimeoutRef.current);
      if (botPopupTimeoutRef.current) window.clearTimeout(botPopupTimeoutRef.current);
      if (tvMessageTimeoutRef.current) window.clearTimeout(tvMessageTimeoutRef.current);
      if (botSpeechTimeoutRef.current) window.clearTimeout(botSpeechTimeoutRef.current);
      if (tvCutinTimeoutRef.current) window.clearTimeout(tvCutinTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    if (!gameReady) return;
    if (gameEnded) return;
    if (turn === "player") return;
    if (!selectedBot) return;
    if (rolling) return;
    if (showRulesOverlay) return;
    if (botActionInFlight.current) return;

    const bot = selectedBot;
    botActionInFlight.current = true;

    async function botPlay() {
      try {
        if (turnState.rolledDice.length === 0) {
          await doRoll(turnState.availableDice);
          return;
        }

        if (
          shouldBotUseStatue(
            bot,
            turnState.unscoredTurnPoints,
            turnState.rolledDice.length,
            scores.bot,
            scores.player,
            {
              colaUsed: botColaUsed,
              colaBuffTurns: botColaBuffTurns,
              rumbleBallUsesLeft: botRumbleBallUsesLeft,
              rumbleBallActiveThisTurn: botRumbleBallActiveThisTurn,
            }
          )
        ) {
          if (bot.statue === "cola") {
            setBotColaBuffTurns((prev) => Math.max(prev, 3));
            setBotColaUsed(true);
            showTvCutin({
              kind: "frankycola",
              imageSrc: "/tv/frankycola.png",
              duration: 2000,
            });
            bump(setFrankyColaTick);
            await wait(900);
          }

          if (bot.statue === "rumbleball") {
            setBotRumbleBallUsesLeft((prev) => Math.max(0, prev - 1));
            setBotRumbleBallActiveThisTurn(true);
            showTvCutin({
              kind: "chopperdoctor",
              imageSrc: "/tv/chopperdoctor.png",
              duration: 2000,
            });
            bump(setChopperDoctorTick);
            await wait(900);
          }
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
          setBotPreviewSelectedIds([]);

          if (turnState.unscoredTurnPoints > 0) {
            setFrozenBotBoard({
              rolledDice: cloneDice(turnState.rolledDice).map((d) => ({ ...d, selected: false })),
              bankedDice: cloneDice(turnState.bankedDice).map((d) => ({ ...d, selected: false })),
            });

            const bankedPoints =
              botColaBuffTurns > 0
                ? Math.floor(turnState.unscoredTurnPoints * 1.5)
                : turnState.unscoredTurnPoints;

            const newTotal = scores.bot + bankedPoints;
            setScores((prev) => ({ ...prev, bot: newTotal }));

            if (newTotal >= target) {
              finishGame("bot");
              return;
            }

            resetTurn("player");
          } else {
            endTurnBust();
          }
          return;
        }

        setBotSelectedPoints(pick.score);
        setBotPreviewSelectedIds(pick.ids);
        await wait(1200);

        const chosen = turnState.rolledDice.filter((d) => pick.ids.includes(d.id));

        if (chosen.length >= 3) {
          showBotSpeech(getBotComboSpeech(bot));
        }

        const left = turnState.rolledDice.filter((d) => !pick.ids.includes(d.id));
        const hotDice = left.length === 0;

        let nextAvailableDice: CustomDie[];
        let iceBonus = 0;

        if (hotDice) {
          nextAvailableDice = rebuildHotDiceAvailable([...chosen, ...left], "bot", customDice);
        } else {
          const finalized = finalizeRemainingDiceForNextRoll(left);
          nextAvailableDice = finalized.nextAvailableDice;
          iceBonus = finalized.iceBonus;
        }

        if (isDevilSixCombo(chosen)) {
          activateDevilBonus("bot");
        }

        setTurnState((prev) => ({
          ...prev,
          rolledDice: hotDice ? [] : left,
          bankedDice: hotDice
            ? []
            : [...prev.bankedDice, ...chosen.map((d) => resetBankedDieRuntimeState(d))],
          availableDice: nextAvailableDice,
          unscoredTurnPoints: prev.unscoredTurnPoints + pick.score + iceBonus,
          canContinue: true,
          hotDice,
        }));

        setBotSelectedPoints(0);
        setBotPreviewSelectedIds([]);

        const futureTurn = turnState.unscoredTurnPoints + pick.score + iceBonus;
        const nextRemaining = nextAvailableDice.length;
        const willRoll = shouldBotRollAgain(
          bot,
          futureTurn,
          nextRemaining,
          scores.bot,
          scores.player
        );

        await wait(1400);

        if (!willRoll) {
          setFrozenBotBoard(buildFrozenBoardForBotPick(pick.ids));

          const bankedPoints =
            botColaBuffTurns > 0 ? Math.floor(futureTurn * 1.5) : futureTurn;

          const newTotal = scores.bot + bankedPoints;
          setScores((prev) => ({ ...prev, bot: newTotal }));

          if (newTotal >= target) {
            finishGame("bot");
            return;
          }

          resetTurn("player");
        } else {
          await doRoll(nextAvailableDice);
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
    target,
    turn,
    turnState.rolledDice,
    turnState.unscoredTurnPoints,
    turnState.bankedDice,
    turnState.availableDice,
    customDice,
    gameReady,
    gameEnded,
    botColaUsed,
    botColaBuffTurns,
    botRumbleBallUsesLeft,
    botRumbleBallActiveThisTurn,
  ]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (!gameReady) return;
    if (gameEnded) return;
    if (turn !== "player") return;
    if (rolling) return;
    if (showRulesOverlay) return;
    if (turnState.rolledDice.length > 0) return;
    if (playerDevilCurseTurns <= 0) return;
    if (devilCurseInFlight.current) return;

    devilCurseInFlight.current = true;

    showTvMessage("DEVIL BUST!", "#ef4444", 1000);

    window.setTimeout(() => {
      setPlayerDevilCurseTurns((prev) => Math.max(0, prev - 1));
      devilCurseInFlight.current = false;
      resetTurn("bot");
    }, 1100);
  }, [
    phase,
    turn,
    rolling,
    showRulesOverlay,
    turnState.rolledDice.length,
    playerDevilCurseTurns,
    gameReady,
    gameEnded,
  ]);

  const playerStatueUsed =
    (selectedStatue === "gomgumfruit" && gomuCooldownTurns > 0) ||
    (selectedStatue === "cursemark" && curseMarkUsed) ||
    (selectedStatue === "cola" && colaUsed) ||
    (selectedStatue === "rumbleball" && (rumbleBallUsesLeft <= 0 || rumbleBallActiveThisTurn));

  const playerStatueDisabled =
    !gameReady ||
    gameEnded ||
    turn !== "player" ||
    rolling ||
    showRulesOverlay ||
    starterRandomizerRunning ||
    selectedStatue === "none" ||
    (selectedStatue === "gomgumfruit" &&
      (gomuCooldownTurns > 0 || selectedDice.length !== 1 || turnState.rolledDice.length === 0)) ||
    (selectedStatue === "cursemark" &&
      (curseMarkUsed ||
        currentBankablePoints <= 0 ||
        (selectedDice.length > 0 && !selectedPreview.valid))) ||
    (selectedStatue === "cola" && colaUsed) ||
    (selectedStatue === "rumbleball" &&
      (rumbleBallUsesLeft <= 0 || rumbleBallActiveThisTurn));

  return (
    <div
      className={[
        "relative text-stone-100 bg-[#4298CB]",
        phase === "playing"
          ? "h-[100dvh] overflow-hidden"
          : phase === "choose" || phase === "rules" || phase === "customize"
            ? "h-[100dvh] overflow-x-hidden overflow-y-auto"
            : "h-[100dvh] overflow-hidden",
      ].join(" ")}
    >
      {phase === "playing" && (
        <BackgroundMusic
          muted={musicMuted}
          volume={musicVolume}
          selectedTrack={selectedTrack}
        />
      )}

      <SoundEffects
        muted={soundsMuted}
        volume={soundsVolume}
        shakeTick={shakeTick}
        fallTick={fallTick}
        clickTick={clickTick}
        riskyTick={riskyTick}
        luckyTick={luckyTick}
        bustTick={bustTick}
        bigLossTick={bigLossTick}
        devilTick={devilTick}
        holyTick={holyTick}
        monkTick={monkTick}
        jokerTick={jokerTick}
        frankyColaTick={frankyColaTick}
        chopperDoctorTick={chopperDoctorTick}
      />

      <div
        className={
          phase === "playing"
            ? "relative z-10 mx-auto h-full w-full max-w-7xl px-2 py-2 sm:px-3 sm:py-3"
            : "relative z-10 w-full"
        }
      >
        <AnimatePresence mode="wait">
          {phase === "menu" && (
            <MenuScreen
              onVsBots={() => setPhase("choose")}
              onCustomize={() => setPhase("customize")}
              onRules={() => setPhase("rules")}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          )}

          {phase === "customize" && (
            <CustomizeScreen
              dice={customDice}
              setDice={setCustomDice}
              selectedStatue={selectedStatue}
              setSelectedStatue={setSelectedStatue}
              onBack={() => setPhase("menu")}
            />
          )}

          {phase === "rules" && <RulesScreen onBack={() => setPhase("menu")} />}

          {phase === "choose" && (
            <ChooseOpponentScreen
              bots={BOTS}
              onBack={() => setPhase("menu")}
              onSelect={startNewGame}
            />
          )}

          {phase === "playing" && selectedBot && (
            <PlayingScreen
              selectedBot={selectedBot}
              scores={scores}
              target={target}
              turn={turn}
              rolling={rolling}
              tvMessage={tvMessage}
              tvCutin={tvCutin}
              turnPoints={turnState.unscoredTurnPoints}
              botSelectedPoints={botSelectedPoints}
              playerScorePopup={playerScorePopup}
              botScorePopup={botScorePopup}
              rolledDice={turnState.rolledDice}
              bankedDice={turnState.bankedDice}
              frozenPlayerRolledDice={frozenPlayerBoard?.rolledDice ?? []}
              frozenPlayerBankedDice={frozenPlayerBoard?.bankedDice ?? []}
              frozenBotRolledDice={frozenBotBoard?.rolledDice ?? []}
              frozenBotBankedDice={frozenBotBoard?.bankedDice ?? []}
              onSelectDie={toggleSelect}
              onRoll={handleRoll}
              canRoll={canRollNow}
              selectedComboPlayable={selectedComboPlayable}
              statueAdjustedSelectedPoints={statueAdjustedSelectedPoints}
              playerStatue={selectedStatue}
              playerStatueUsed={playerStatueUsed}
              playerStatueDisabled={playerStatueDisabled}
              onPlayerStatueClick={handlePlayerStatueClick}
              bankButton={
                <BankImageButton
                  onClick={bankPoints}
                  disabled={
                    !gameReady ||
                    gameEnded ||
                    turn !== "player" ||
                    rolling ||
                    starterRandomizerRunning ||
                    (turnState.rolledDice.length > 0 && selectedDice.length === 0) ||
                    (selectedDice.length > 0 && !selectedPreview.valid) ||
                    (turnState.unscoredTurnPoints +
                      (selectedPreview.valid ? selectedPreview.score : 0) <= 0)
                  }
                />
              }
              showRulesOverlay={showRulesOverlay}
              setShowRulesOverlay={setShowRulesOverlay}
              musicMuted={musicMuted}
              soundsMuted={soundsMuted}
              setMusicMuted={setMusicMuted}
              setSoundsMuted={setSoundsMuted}
              starterPreviewVisible={starterPreviewVisible}
              starterRandomizerRunning={starterRandomizerRunning}
              starterDisplayText={
                starterDisplayText ?? (turn === "player" ? playerStarterLabel : botLabel)
              }
              playerStarterLabel={playerStarterLabel}
              gameEnded={gameEnded}
              winner={winner}
              onPlayAgain={handlePlayAgain}
              settingsOpen={settingsOpen}
              setSettingsOpen={setSettingsOpen}
              musicVolume={musicVolume}
              setMusicVolume={setMusicVolume}
              soundsVolume={soundsVolume}
              setSoundsVolume={setSoundsVolume}
              selectedTrack={selectedTrack}
              setSelectedTrack={setSelectedTrack}
              playerName={playerProfileName}
              playerAvatar={playerProfileAvatar}
              botAvatarDisplayed={botAvatarDisplayed}
              botSpeechBubble={botSpeechBubble}
              botStatueUsed={botColaUsed || botRumbleBallUsesLeft < 3}
              botPreviewSelectedIds={botPreviewSelectedIds}
            />
          )}
        </AnimatePresence>
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        musicVolume={musicVolume}
        setMusicVolume={setMusicVolume}
        soundsVolume={soundsVolume}
        setSoundsVolume={setSoundsVolume}
        selectedTrack={selectedTrack}
        setSelectedTrack={setSelectedTrack}
      />
    </div>
  );
}