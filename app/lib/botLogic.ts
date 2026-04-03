import { Bot, Die } from "../types/game";
import { findAllScoringSelections } from "./scoring";
import {
  bestFrankySelection,
  shouldFrankyRollAgain,
  shouldFrankyUseStatue,
} from "./bots/frankyLogic";
import {
  bestChopperSelection,
  shouldChopperRollAgain,
  shouldChopperUseStatue,
} from "./bots/chopperLogic";

type BotStatueContext = {
  colaUsed: boolean;
  colaBuffTurns: number;
  rumbleBallUsesLeft: number;
  rumbleBallActiveThisTurn: boolean;
};

export function bestBotSelection(
  dice: Die[],
  bot: Bot,
  currentTurnPoints: number,
  botTotal: number,
  playerTotal: number
) {
  if (bot.id === "franky") {
    return bestFrankySelection(dice, currentTurnPoints, botTotal, playerTotal, bot.target);
  }

  if (bot.id === "chopper") {
    return bestChopperSelection(dice, currentTurnPoints, botTotal, playerTotal, bot.target);
  }

  const options = findAllScoringSelections(dice);
  if (!options.length) return null;

  const target = bot.target;
  const behind = playerTotal - botTotal > target * 0.15;

  const scored = options
    .map((opt) => {
      const remaining = dice.length - opt.ids.length;
      const hotDiceBonus = remaining === 0 ? 220 : 0;
      const safetyPenalty = remaining <= 1 ? 90 : remaining <= 2 ? 40 : 0;
      const catchupBonus = behind ? opt.score * 0.16 : 0;
      const greedBonus = opt.score * bot.greed;
      const projected = botTotal + currentTurnPoints + opt.score;
      const finishBonus = projected >= target ? 10000 : 0;

      const value =
        opt.score +
        hotDiceBonus +
        greedBonus +
        catchupBonus +
        finishBonus -
        safetyPenalty;

      return { ...opt, value };
    })
    .sort((a, b) => b.value - a.value);

  return scored[0];
}

export function shouldBotRollAgain(
  bot: Bot,
  turnPoints: number,
  remainingDice: number,
  botTotal: number,
  playerTotal: number
) {
  if (bot.id === "franky") {
    return shouldFrankyRollAgain(turnPoints, remainingDice, botTotal, playerTotal, bot.target);
  }

  if (bot.id === "chopper") {
    return shouldChopperRollAgain(turnPoints, remainingDice, botTotal, playerTotal, bot.target);
  }

  const target = bot.target;

  if (botTotal + turnPoints >= target) return false;
  if (remainingDice === 0) return true;

  const behind = playerTotal > botTotal;
  const progress = (botTotal + turnPoints) / target;

  let threshold = 250;
  if (target === 4000) threshold = 450;
  if (target === 8000) threshold = 700;

  if (behind) threshold += 100;
  if (progress > 0.75) threshold -= 120;
  if (remainingDice <= 2) threshold += 130;
  if (remainingDice >= 4) threshold -= 70;

  const randomBias = Math.floor((Math.random() - 0.5) * 180 * (1 + bot.risk));
  return turnPoints < threshold + randomBias;
}

export function shouldBotUseStatue(
  bot: Bot,
  currentTurnPoints: number,
  remainingDice: number,
  botTotal: number,
  playerTotal: number,
  context: BotStatueContext
) {
  if (bot.id === "franky" && bot.statue === "cola") {
    return shouldFrankyUseStatue(
      currentTurnPoints,
      remainingDice,
      botTotal,
      playerTotal,
      bot.target,
      context.colaUsed,
      context.colaBuffTurns
    );
  }

  if (bot.id === "chopper" && bot.statue === "rumbleball") {
    return shouldChopperUseStatue(
      currentTurnPoints,
      remainingDice,
      context.rumbleBallUsesLeft,
      context.rumbleBallActiveThisTurn
    );
  }

  return false;
}

export function getBotBustSpeech(bot: Bot | null) {
  if (!bot) return null;

  if (bot.id === "franky") return "Auu!";
  if (bot.id === "chopper") return "Doctorine :(";

  return null;
}

export function getBotComboSpeech(bot: Bot | null) {
  if (!bot) return null;

  if (bot.id === "franky") return "Suupeer!!!";
  if (bot.id === "chopper") return "He he dont flatter me idiot!";

  return null;
}

export function getBotDisplayAvatar(
  bot: Bot | null,
  botScore: number,
  playerScore: number
) {
  if (!bot) return "";

  const angryGap = bot.target / 2;
  const shouldBeAngry = playerScore - botScore >= angryGap;

  if (shouldBeAngry && bot.id === "franky") {
    return "/bots/frankyangry.png";
  }

  if (shouldBeAngry && bot.id === "chopper") {
    return "/bots/chopperangry.png";
  }

  return bot.avatar;
}