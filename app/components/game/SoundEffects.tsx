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
  devilTick: number;
  holyTick: number;
  monkTick: number;
  jokerTick: number;
  frankyColaTick: number;
  chopperDoctorTick: number;
};

type SoundMap = {
  shake: string;
  fall: string;
  click: string;
  risky: string;
  lucky: string;
  bust: string;
  bigLoss: string;
  devil: string;
  holy: string;
  monk: string;
  joker: string;
  frankyCola: string;
  chopperDoctor: string;
};

const SOUND_PATHS: SoundMap = {
  shake: "/sounds/diceshake.mp3",
  fall: "/sounds/dicefall.mp3",
  click: "/sounds/clickdie.wav",
  risky: "/sounds/risky.wav",
  lucky: "/sounds/lucky.wav",
  bust: "/sounds/bust.wav",
  bigLoss: "/sounds/bigloss.wav",
  devil: "/sounds/devil.mp3",
  holy: "/sounds/holy.mp3",
  monk: "/sounds/monk.mp3",
  joker: "/sounds/joker.wav",
  frankyCola: "/sounds/frankycola.wav",
  chopperDoctor: "/sounds/chopperdoctor.wav",
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
  devilTick,
  holyTick,
  monkTick,
  jokerTick,
  frankyColaTick,
  chopperDoctorTick,
}: Props) {
  const templatesRef = useRef<Record<keyof SoundMap, HTMLAudioElement | null>>({
    shake: null,
    fall: null,
    click: null,
    risky: null,
    lucky: null,
    bust: null,
    bigLoss: null,
    devil: null,
    holy: null,
    monk: null,
    joker: null,
    frankyCola: null,
    chopperDoctor: null,
  });

  useEffect(() => {
    const entries = Object.entries(SOUND_PATHS) as Array<[keyof SoundMap, string]>;

    for (const [key, src] of entries) {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume =
        key === "click" ? 0.85 : key === "frankyCola" || key === "chopperDoctor" ? 1 : 0.9;
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

  useEffect(() => {
    if (devilTick > 0) play("devil");
  }, [devilTick]);

  useEffect(() => {
    if (holyTick > 0) play("holy");
  }, [holyTick]);

  useEffect(() => {
    if (monkTick > 0) play("monk");
  }, [monkTick]);

  useEffect(() => {
    if (jokerTick > 0) play("joker");
  }, [jokerTick]);

  useEffect(() => {
    if (frankyColaTick > 0) play("frankyCola");
  }, [frankyColaTick]);

  useEffect(() => {
    if (chopperDoctorTick > 0) play("chopperDoctor");
  }, [chopperDoctorTick]);

  return null;
}