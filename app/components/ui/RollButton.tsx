"use client";

import React from "react";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  pressed?: boolean;
  className?: string;
};

export default function RollButton({
  onClick,
  disabled = false,
  pressed = false,
  className = "",
}: Props) {
  const inactive = disabled && !pressed;

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className={[
        "group relative border-0 bg-transparent p-0 outline-offset-4",
        "min-w-[170px] sm:min-w-[210px]",
        "h-[82px] sm:h-[96px]",
        disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
        className,
      ].join(" ")}
      style={{ imageRendering: "pixelated" }}
    >
      {/* bottom shadow */}
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          transform: pressed ? "translateY(2px)" : "translateY(6px)",
          transition: pressed
            ? "transform 34ms"
            : "transform 250ms cubic-bezier(.3,.7,.4,1)",
          background: inactive ? "#2f6f25" : "#245a1d",
          clipPath:
            "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
        }}
      />

      {/* edge */}
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: inactive
            ? "linear-gradient(to left, #4b8e36 0%, #5fae46 8%, #5fae46 92%, #4b8e36 100%)"
            : "linear-gradient(to left, #3e7d2c 0%, #55a43b 8%, #55a43b 92%, #3e7d2c 100%)",
          transform: pressed ? "translateY(1px)" : "translateY(4px)",
          transition: pressed
            ? "transform 34ms"
            : "transform 250ms cubic-bezier(.3,.7,.4,1)",
          clipPath:
            "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
        }}
      />

      {/* front */}
      <span
        className="relative block h-full w-full text-white"
        style={{
          background: inactive ? "#8ccc5b" : "#8fda59",
          transform: pressed ? "translateY(2px)" : "translateY(-2px)",
          transition: pressed
            ? "transform 34ms"
            : "transform 600ms cubic-bezier(.3,.7,.4,1)",
          boxShadow:
            "inset 0 -4px 0 rgba(86,184,68,1), inset 0 4px 0 rgba(220,255,140,0.35)",
          clipPath:
            "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
          imageRendering: "pixelated",
        }}
      >
        {/* top shine */}
        <span
          className="absolute inset-x-[12px] top-[8px] h-[6px]"
          style={{ background: "rgba(220,255,140,0.45)" }}
        />

        {/* bottom shine */}
        <span
          className="absolute bottom-[6px] left-[10px] right-[10px] h-[4px]"
          style={{ background: "rgba(255,255,255,0.14)" }}
        />

        {/* TEXT */}
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontFamily: "var(--font-heading), monospace",
            fontSize: "clamp(2rem, 3vw, 3.2rem)",
            lineHeight: 1,
            letterSpacing: "0.08em",
            fontWeight: 900,
            textShadow: "2px 2px 0 rgba(0,0,0,0.22)",
          }}
        >
          ROLL
        </span>
      </span>

      <style jsx>{`
        button:focus:not(:focus-visible) {
          outline: none;
        }

        /* ✅ FIX: NO movement on hover */
        button:hover span:last-child {
          filter: brightness(1.05) saturate(1.05);
          transition: filter 180ms ease;
        }

        /* press still works */
        button:active span:last-child {
          transform: translateY(2px);
          transition: transform 34ms;
        }

        button:disabled span:last-child {
          transform: ${pressed ? "translateY(2px)" : "translateY(-2px)"};
          filter: none;
        }
      `}</style>
    </button>
  );
}