import { Bot } from "../types/game";

export const BOTS: Bot[] = [
  {
    id: "tavern-rat",
    name: "Tavern Rat",
    avatar: "/bots/bot-2000.png",
    target: 2000,
    greed: 0.28,
    risk: 0.2,
  },
  {
    id: "guild-shark",
    name: "Guild Shark",
    avatar: "/bots/bot-4000.png",
    target: 4000,
    greed: 0.46,
    risk: 0.42,
  },
  {
    id: "royal-hustler",
    name: "Royal Hustler",
    avatar: "/bots/bot-8000.png",
    target: 8000,
    greed: 0.68,
    risk: 0.68,
  },
];