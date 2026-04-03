"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  musicVolume: number;
  setMusicVolume: React.Dispatch<React.SetStateAction<number>>;
  soundsVolume: number;
  setSoundsVolume: React.Dispatch<React.SetStateAction<number>>;
  selectedTrack: string;
  setSelectedTrack: React.Dispatch<React.SetStateAction<string>>;
};

const TRACKS = [
  "Tavern Loop",
  "Dice Night",
  "Midnight Ale",
  "Boss Duel",
];

export default function SettingsModal({
  open,
  onClose,
  musicVolume,
  setMusicVolume,
  soundsVolume,
  setSoundsVolume,
  selectedTrack,
  setSelectedTrack,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]">
      <div
        className="relative w-full max-w-[420px] border-[4px] border-[#6a7288] bg-[#d8d9e3] p-[10px] shadow-[0_0_0_4px_#8ba0bf,8px_8px_0_rgba(0,0,0,0.24)]"
        style={{ imageRendering: "pixelated" }}
      >
        <div className="border-[4px] border-[#8f95a8] bg-[#ebecf2] p-5 shadow-[inset_2px_2px_0_rgba(255,255,255,0.85),inset_-2px_-2px_0_rgba(120,120,140,0.45)]">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-[-10px] top-[-10px] flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[#d94d68] bg-[#ff5d7c] text-white shadow-[0_0_0_3px_#f7c0cb]"
            style={{
              fontFamily: "var(--font-heading)",
              imageRendering: "pixelated",
              textShadow: "1px 1px 0 rgba(0,0,0,0.35)",
            }}
            aria-label="Close settings"
          >
            ✕
          </button>

          <div className="space-y-5">
            <div>
              <div
                className="mb-3 text-[1.05rem] text-[#5e6170]"
                style={{ fontFamily: "var(--font-heading)", imageRendering: "pixelated" }}
              >
                SETTINGS
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm text-[#5e6170]"
                style={{ fontFamily: "var(--font-ui)", imageRendering: "pixelated" }}
              >
                Music selection
              </label>
              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="w-full border-[3px] border-[#b8bcc9] bg-white px-4 py-3 text-[#616473] shadow-[inset_2px_2px_0_rgba(255,255,255,0.8),inset_-2px_-2px_0_rgba(0,0,0,0.08)] outline-none"
                style={{ fontFamily: "var(--font-ui)", imageRendering: "pixelated" }}
              >
                {TRACKS.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div
                className="text-sm text-[#5e6170]"
                style={{ fontFamily: "var(--font-ui)", imageRendering: "pixelated" }}
              >
                Music volume
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="w-8 text-xs text-[#666a78]"
                  style={{ fontFamily: "var(--font-ui)", imageRendering: "pixelated" }}
                >
                  0
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(Number(e.target.value))}
                  className="h-3 w-full accent-sky-500"
                />
                <span
                  className="w-10 text-right text-xs text-[#666a78]"
                  style={{ fontFamily: "var(--font-ui)", imageRendering: "pixelated" }}
                >
                  {musicVolume}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div
                className="text-sm text-[#5e6170]"
                style={{ fontFamily: "var(--font-ui)", imageRendering: "pixelated" }}
              >
                Sounds volume
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="w-8 text-xs text-[#666a78]"
                  style={{ fontFamily: "var(--font-ui)", imageRendering: "pixelated" }}
                >
                  0
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={soundsVolume}
                  onChange={(e) => setSoundsVolume(Number(e.target.value))}
                  className="h-3 w-full accent-sky-500"
                />
                <span
                  className="w-10 text-right text-xs text-[#666a78]"
                  style={{ fontFamily: "var(--font-ui)", imageRendering: "pixelated" }}
                >
                  {soundsVolume}
                </span>
              </div>
            </div>

            <div className="border-t-[3px] border-[#c6c8d3] pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full border-[3px] border-[#17b66b] bg-white px-4 py-3 text-[#5e6170] shadow-[0_0_0_3px_#91f0bc]"
                style={{ fontFamily: "var(--font-heading)", imageRendering: "pixelated" }}
              >
                ACCEPT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}