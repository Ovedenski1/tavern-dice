"use client";

import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

const MOBILE_MAX = 639;
const BASE_WIDTH = 1600;
const BASE_HEIGHT = 900;
const DESKTOP_PADDING = 24;

export default function GameScaler({ children }: Props) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      const mobile = window.innerWidth <= MOBILE_MAX;
      setIsMobile(mobile);

      if (mobile) {
        setScale(1);
        return;
      }

      const usableWidth = Math.max(0, window.innerWidth - DESKTOP_PADDING * 2);
      const usableHeight = Math.max(0, window.innerHeight - DESKTOP_PADDING * 2);

      const scaleX = usableWidth / BASE_WIDTH;
      const scaleY = usableHeight / BASE_HEIGHT;
      setScale(Math.min(scaleX, scaleY));
    }

    setMounted(true);
    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!mounted) {
    return <div className="min-h-[100dvh] w-full bg-[#4298CB]" />;
  }

  if (isMobile) {
    return <div className="min-h-[100dvh] w-full bg-[#4298CB]">{children}</div>;
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#4298CB]">
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div
          className="relative overflow-hidden rounded-[28px]"
          style={{
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}