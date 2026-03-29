"use client";

import { Music2, Volume2, VolumeX } from "lucide-react";

type Props = {
  musicMuted: boolean;
  soundsMuted: boolean;
  onToggleMusic: () => void;
  onToggleSounds: () => void;
};

function MusicMuteIcon({ muted }: { muted: boolean }) {
  return (
    <span className="relative inline-flex h-5 w-5 items-center justify-center">
      <Music2 className="h-5 w-5" />
      {muted && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-[2px] w-6 rotate-[-35deg] rounded-full bg-current" />
        </span>
      )}
    </span>
  );
}

export default function SoundControls({
  musicMuted,
  soundsMuted,
  onToggleMusic,
  onToggleSounds,
}: Props) {
  const buttonClass =
    "flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-black/20 text-stone-100 backdrop-blur-sm transition hover:bg-black/30";

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={onToggleMusic}
        aria-label={musicMuted ? "Unmute music" : "Mute music"}
        className={buttonClass}
      >
        <MusicMuteIcon muted={musicMuted} />
      </button>

      <button
        type="button"
        onClick={onToggleSounds}
        aria-label={soundsMuted ? "Unmute sounds" : "Mute sounds"}
        className={buttonClass}
      >
        {soundsMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </div>
  );
}