"use client";

import DiceBoard from "./DiceBoard";
import PlayerPanel from "./PlayerPanel";
import ScorePanel from "./ScorePanel";
import RulesOverlay from "./RulesOverlay";
import SettingsModal from "./SettingsModal";
import { Bot, Die, PlayerSide, StatueType } from "../../types/game";

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
    }
  | null;

type Props = {
  selectedBot: Bot;
  scores: { player: number; bot: number };
  target: number;
  turn: "player" | "bot";
  rolling: boolean;
  tvMessage: { text: string; color: string } | null;
  tvCutin: TvCutin;
  turnPoints: number;
  botSelectedPoints: number;
  playerScorePopup: number | null;
  botScorePopup: number | null;
  rolledDice: Die[];
  bankedDice: Die[];
  frozenPlayerRolledDice: Die[];
  frozenPlayerBankedDice: Die[];
  frozenBotRolledDice: Die[];
  frozenBotBankedDice: Die[];
  onSelectDie: (id: string) => void;
  onRoll: () => void;
  canRoll: boolean;
  selectedComboPlayable: boolean;
  statueAdjustedSelectedPoints: number;
  playerStatue: StatueType;
  playerStatueUsed: boolean;
  playerStatueDisabled: boolean;
  onPlayerStatueClick: () => void;
  bankButton: React.ReactNode;
  showRulesOverlay: boolean;
  setShowRulesOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  musicMuted: boolean;
  soundsMuted: boolean;
  setMusicMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setSoundsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  starterPreviewVisible: boolean;
  starterRandomizerRunning: boolean;
  starterDisplayText: string | null;
  playerStarterLabel: string;
  gameEnded: boolean;
  winner: PlayerSide | null;
  onPlayAgain: () => void;
  settingsOpen: boolean;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  musicVolume: number;
  setMusicVolume: React.Dispatch<React.SetStateAction<number>>;
  soundsVolume: number;
  setSoundsVolume: React.Dispatch<React.SetStateAction<number>>;
  selectedTrack: string;
  setSelectedTrack: React.Dispatch<React.SetStateAction<string>>;
  playerName: string;
  playerAvatar: string | null;
  botAvatarDisplayed: string;
  botSpeechBubble?: string | null;
  botStatueUsed?: boolean;
  botPreviewSelectedIds: string[];
  lostVisualState: {
    playerMissing: boolean;
    botHasExtra: boolean;
  };
  germaDestroyedFlash: number;
};

function HudStrip({
  children,
  side,
}: {
  children: React.ReactNode;
  side: "top" | "bottom";
}) {
  return (
    <div
      className={[
        "relative rounded-[1rem] sm:rounded-[1.75rem]",
        "border border-white/10",
        "bg-[rgba(43,117,160,0.34)]",
        "backdrop-blur-[1px]",
        side === "top"
          ? "shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]"
          : "shadow-[inset_0_2px_0_rgba(255,255,255,0.08)]",
      ].join(" ")}
      style={{
        imageRendering: "pixelated",
        backgroundImage: `
          linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.01)),
          repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.025) 0px,
            rgba(255,255,255,0.025) 2px,
            rgba(0,0,0,0.02) 2px,
            rgba(0,0,0,0.02) 4px
          )
        `,
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-white/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-black/10" />
      {children}
    </div>
  );
}

function PixelTextAction({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-transparent px-0 py-0 text-white/90 transition hover:text-white"
      style={{
        fontFamily: "var(--font-heading)",
        imageRendering: "pixelated",
        fontSize: "clamp(0.85rem, 1vw, 1rem)",
        letterSpacing: "0.12em",
        textShadow: "2px 2px 0 rgba(0,0,0,0.28)",
      }}
    >
      {label.toUpperCase()}
    </button>
  );
}

function BotSpeechBubble({ text }: { text: string }) {
  return (
    <div
      className="pointer-events-none absolute left-3 top-full z-30 mt-2 sm:left-6"
      style={{ imageRendering: "pixelated" }}
    >
      <div className="relative max-w-[220px] rounded-[1rem] border border-black/20 bg-[#fff3cf] px-4 py-3 text-[#3b2a10] shadow-[0_6px_0_rgba(0,0,0,0.18),0_10px_24px_rgba(0,0,0,0.18)]">
        <div
          className="text-[0.8rem] sm:text-[0.95rem]"
          style={{
            fontFamily: "var(--font-heading)",
            letterSpacing: "0.04em",
            lineHeight: 1.2,
            textShadow: "1px 1px 0 rgba(255,255,255,0.35)",
          }}
        >
          {text}
        </div>

        <div className="absolute left-8 top-[-10px] h-4 w-4 rotate-45 border-l border-t border-black/20 bg-[#fff3cf]" />
      </div>
    </div>
  );
}

export default function PlayingScreen({
  selectedBot,
  scores,
  target,
  turn,
  rolling,
  tvMessage,
  tvCutin,
  turnPoints,
  botSelectedPoints,
  playerScorePopup,
  botScorePopup,
  rolledDice,
  bankedDice,
  frozenPlayerRolledDice,
  frozenPlayerBankedDice,
  frozenBotRolledDice,
  frozenBotBankedDice,
  onSelectDie,
  onRoll,
  canRoll,
  selectedComboPlayable,
  statueAdjustedSelectedPoints,
  playerStatue,
  playerStatueUsed,
  playerStatueDisabled,
  onPlayerStatueClick,
  bankButton,
  showRulesOverlay,
  setShowRulesOverlay,
  musicMuted,
  soundsMuted,
  setMusicMuted,
  setSoundsMuted,
  starterPreviewVisible,
  starterRandomizerRunning,
  starterDisplayText,
  playerStarterLabel,
  gameEnded,
  winner,
  onPlayAgain,
  settingsOpen,
  setSettingsOpen,
  musicVolume,
  setMusicVolume,
  soundsVolume,
  setSoundsVolume,
  selectedTrack,
  setSelectedTrack,
  playerName,
  playerAvatar,
  botAvatarDisplayed,
  botSpeechBubble = null,
  botStatueUsed = false,
  botPreviewSelectedIds,
  lostVisualState,
  germaDestroyedFlash,
}: Props) {
  return (
    <div className="relative grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-2 sm:gap-3">
      <div className="relative">
        <HudStrip side="top">
          <ScorePanel
            botScore={scores.bot}
            botName={selectedBot.name}
            botAvatar={botAvatarDisplayed}
            botStatue={selectedBot.statue}
            botStatueUsed={botStatueUsed}
            targetScore={target}
            turnPoints={turnPoints}
            selectedPoints={botSelectedPoints}
            scorePopup={botScorePopup}
            isPlayerTurn={turn === "player"}
            className="bg-transparent"
          />
        </HudStrip>

        {botSpeechBubble ? <BotSpeechBubble text={botSpeechBubble} /> : null}
      </div>

      <div className="min-h-0 rounded-[1rem] sm:rounded-[1.75rem]">
        <DiceBoard
          rolledDice={rolledDice}
          bankedDice={bankedDice}
          frozenPlayerRolledDice={frozenPlayerRolledDice}
          frozenPlayerBankedDice={frozenPlayerBankedDice}
          frozenBotRolledDice={frozenBotRolledDice}
          frozenBotBankedDice={frozenBotBankedDice}
          onSelectDie={onSelectDie}
          onRoll={onRoll}
          canSelect={turn === "player" && !starterRandomizerRunning && !gameEnded}
          rolling={rolling}
          isPlayerTurn={turn === "player"}
          canRoll={canRoll && !starterRandomizerRunning && !gameEnded}
          selectedComboPlayable={selectedComboPlayable}
          tvMessage={tvMessage}
          tvCutin={tvCutin}
          starterPreviewVisible={starterPreviewVisible}
          starterRandomizerRunning={starterRandomizerRunning}
          starterDisplayText={starterDisplayText}
          playerStarterLabel={playerStarterLabel}
          gameEnded={gameEnded}
          winner={winner}
          onPlayAgain={onPlayAgain}
          botPreviewSelectedIds={botPreviewSelectedIds}
          lostVisualState={lostVisualState}
          germaDestroyedFlash={germaDestroyedFlash}
        />
      </div>

      <div className="relative min-h-0">
        <HudStrip side="bottom">
          <PlayerPanel
            playerScore={scores.player}
            targetScore={target}
            turnPoints={turnPoints}
            selectedPoints={statueAdjustedSelectedPoints}
            scorePopup={playerScorePopup}
            isPlayerTurn={turn === "player"}
            playerStatue={playerStatue}
            playerStatueUsed={playerStatueUsed}
            playerStatueDisabled={playerStatueDisabled || starterRandomizerRunning || gameEnded}
            onPlayerStatueClick={onPlayerStatueClick}
            bankButton={bankButton}
            className="bg-transparent"
            playerName={playerName}
            playerAvatar={playerAvatar}
          />
        </HudStrip>

        {!gameEnded && (
          <div className="absolute bottom-full right-0 z-20 mb-3 flex flex-col items-end gap-2 sm:mb-4">
            <PixelTextAction label="Settings" onClick={() => setSettingsOpen(true)} />
            <PixelTextAction label="Rules" onClick={() => setShowRulesOverlay(true)} />
          </div>
        )}
      </div>

      <RulesOverlay
        open={showRulesOverlay}
        onClose={() => setShowRulesOverlay(false)}
      />

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