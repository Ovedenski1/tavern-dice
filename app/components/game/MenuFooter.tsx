"use client";

type Props = {
  version?: string;
};

export default function MenuFooter({ version }: Props) {
  return (
    <div className="pointer-events-none absolute bottom-2 left-0 right-0 z-10 flex items-end justify-between px-4 sm:bottom-4 sm:px-6">
      <div className="rounded-[0.9rem] bg-black/20 px-2 py-1.5 backdrop-blur-[1px] sm:rounded-[1rem] sm:px-3 sm:py-2">
        <img
          src="/company/company.png"
          alt="Company logo"
          className="h-7 w-auto object-contain sm:h-8 md:h-10 lg:h-12"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {version ? (
        <div className="mb-1 rounded-lg bg-black/20 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
          VERSION {version}
        </div>
      ) : null}
    </div>
  );
}
