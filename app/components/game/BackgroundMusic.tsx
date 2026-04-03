"use client";

import { useEffect, useRef } from "react";

type Props = {
  muted: boolean;
  src?: string;
};

export default function BackgroundMusic({
  muted,
  src = "/sounds/backgroundmusic.mp3",
}: Props) {
  const musicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.45;
    musicRef.current = audio;

    const tryPlay = async () => {
      if (muted) return;
      try {
        await audio.play();
      } catch {}
    };

    void tryPlay();

    return () => {
      audio.pause();
      musicRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    const audio = musicRef.current;
    if (!audio) return;

    if (muted) {
      audio.pause();
      return;
    }

    const playMusic = async () => {
      try {
        await audio.play();
      } catch {}
    };

    void playMusic();
  }, [muted]);

  return null;
}