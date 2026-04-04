"use client";

type Props = {
  version?: string;
};

export default function MenuFooter({ version }: Props) {
  return (
    <div className="pointer-events-none absolute bottom-2 left-0 right-0 z-10 flex items-end justify-between px-4 sm:bottom-4 sm:px-6">
      
      {/* LOGO */}
      <div className="flex items-end gap-2">
        <img
          src="/images/noyko-dog.png" // adjust path if needed
          alt="Noyko"
          className="h-14 w-auto sm:h-20"
          style={{ imageRendering: "pixelated" }}
        />

        <span
          className="mb-1 text-lg sm:text-xl"
          style={{
            fontFamily: "var(--font-heading)",
            color: "#2d2df5",
          }}
        >
          noyko
        </span>
      </div>

      {/* VERSION */}
      {version ? (
        <div className="mb-1 rounded-lg bg-black/20 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
          VERSION {version}
        </div>
      ) : null}
    </div>
  );
}