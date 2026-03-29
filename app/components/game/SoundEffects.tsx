"use client";

import { useEffect, useRef } from "react";

type Props = {
  muted: boolean;
  shakeTick: number;
  fallTick: number;
  clickTick: number;
  riskyTick: number;
  luckyTick: number;
  bustTick: number;
  bigLossTick: number;
};

type SoundMap = {
  shake: string;
  fall: string;
  click: string;
  risky: string;
  lucky: string;
  bust: string;
  bigLoss: string;
};

const SOUND_PATHS: SoundMap = {
  shake: "/sounds/diceshake.mp3",
  fall: "/sounds/dicefall.mp3",
  click: "/sounds/clickdie.wav",
  risky: "/sounds/risky.wav",
  lucky: "/sounds/lucky.wav",
  bust: "/sounds/bust.wav",
  bigLoss: "/sounds/bigloss.wav",
};

export default function SoundEffects({
  muted,
  shakeTick,
  fallTick,
  clickTick,
  riskyTick,
  luckyTick,
  bustTick,
  bigLossTick,
}: Props) {
  const templatesRef = useRef<Record<keyof SoundMap, HTMLAudioElement | null>>({
    shake: null,
    fall: null,
    click: null,
    risky: null,
    lucky: null,
    bust: null,
    bigLoss: null,
  });

  useEffect(() => {
    const entries = Object.entries(SOUND_PATHS) as Array<[keyof SoundMap, string]>;

    for (const [key, src] of entries) {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = key === "click" ? 0.85 : 0.9;
      templatesRef.current[key] = audio;
    }

    return () => {
      const keys = Object.keys(templatesRef.current) as Array<keyof SoundMap>;
      for (const key of keys) {
        templatesRef.current[key]?.pause();
        templatesRef.current[key] = null;
      }
    };
  }, []);

  function play(key: keyof SoundMap) {
    if (muted) return;

    const template = templatesRef.current[key];
    if (!template) return;

    try {
      const sound = template.cloneNode(true) as HTMLAudioElement;
      sound.volume = template.volume;
      void sound.play();
    } catch {}
  }

  useEffect(() => {
    if (shakeTick > 0) play("shake");
  }, [shakeTick]);

  useEffect(() => {
    if (fallTick > 0) play("fall");
  }, [fallTick]);

  useEffect(() => {
    if (clickTick > 0) play("click");
  }, [clickTick]);

  useEffect(() => {
    if (riskyTick > 0) play("risky");
  }, [riskyTick]);

  useEffect(() => {
    if (luckyTick > 0) play("lucky");
  }, [luckyTick]);

  useEffect(() => {
    if (bustTick > 0) play("bust");
  }, [bustTick]);

  useEffect(() => {
    if (bigLossTick > 0) play("bigLoss");
  }, [bigLossTick]);

  return null;
}