"use client";

type Props = {
  onClick: () => void;
  disabled: boolean;
};

export default function BankImageButton({ onClick, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label="Bank points"
      className={[
        "group relative flex min-w-[132px] items-center justify-center overflow-hidden rounded-[0.9rem] px-4 py-3 transition",
        "border",
        disabled
          ? "cursor-not-allowed border-white/15 bg-white/8"
          : "cursor-pointer border-emerald-300/30 bg-emerald-500/20 hover:bg-emerald-500/25 active:translate-y-[1px]",
      ].join(" ")}
      style={{
        imageRendering: "pixelated",
        boxShadow: disabled
          ? `
              inset 0 1px 0 rgba(255,255,255,0.08),
              inset 0 -1px 0 rgba(0,0,0,0.2),
              0 2px 8px rgba(0,0,0,0.12)
            `
          : `
              inset 0 1px 0 rgba(255,255,255,0.14),
              inset 0 -1px 0 rgba(0,0,0,0.18),
              0 2px 8px rgba(0,0,0,0.15)
            `,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)",
        }}
      />

      {!disabled && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[0.9rem]">
          <div className="bank-shine-line" />
        </div>
      )}

      <span
        className={[
          "relative z-10 uppercase tracking-[0.08em]",
          disabled ? "text-stone-100/80" : "text-emerald-100",
        ].join(" ")}
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "clamp(0.8rem,1.4vw,1rem)",
          lineHeight: 1,
          textShadow: disabled
            ? "0 2px 0 rgba(0,0,0,0.3)"
            : "0 2px 0 rgba(0,0,0,0.35)",
        }}
      >
        Bank Points
      </span>
    </button>
  );
}