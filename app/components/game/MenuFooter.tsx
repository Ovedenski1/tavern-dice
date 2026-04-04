"use client";

import Image from "next/image";

type Props = {
  version?: string;
};

export default function MenuFooter({ version = "1.2" }: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-6 pb-14 sm:px-8 sm:pb-16">
      <div className="pointer-events-auto">
        <div className="relative h-[72px] w-[190px] sm:h-[88px] sm:w-[240px]">
          <Image
            src="/company/company.png"
            alt="Company logo"
            fill
            className="object-contain object-left-bottom"
            unoptimized
            priority
          />
        </div>
      </div>

      <div
        className="pointer-events-auto rounded-lg bg-black/10 px-3 py-2 text-right text-stone-100/95"
        style={{
          fontFamily: "var(--font-heading)",
          imageRendering: "pixelated",
          fontSize: "clamp(0.8rem,1vw,1rem)",
          letterSpacing: "0.12em",
          textShadow: "2px 2px 0 rgba(0,0,0,0.35)",
        }}
      >
        VERSION {version}
      </div>
    </div>
  );
}