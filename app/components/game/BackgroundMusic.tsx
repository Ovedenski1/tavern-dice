"use client";

import { useEffect, useMemo, useRef } from "react";

type Props = {
  muted: boolean;
  volume: number;
  selectedTrack: string;
};

const TRACK_PATHS: Record<string, string> = {
  "Song 1": "/sounds/song1.mp3",
  "Song 2": "/sounds/song2.mp3",
};

export default function BackgroundMusic({
  muted,
  volume,
  selectedTrack,
}: Props) {
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const resolvedSrc = useMemo(() => {
    return TRACK_PATHS[selectedTrack] ?? "/sounds/song1.mp3";
  }, [selectedTrack]);

  useEffect(() => {
    const audio = new Audio(resolvedSrc);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = muted ? 0 : volume / 100;
    musicRef.current = audio;

    const tryPlay = async () => {
      if (muted || volume <= 0) return;
      try {
        await audio.play();
      } catch {}
    };

    void tryPlay();

    return () => {
      audio.pause();
      audio.currentTime = 0;
      musicRef.current = null;
    };
  }, [resolvedSrc]);

  useEffect(() => {
    const audio = musicRef.current;
    if (!audio) return;

    audio.volume = muted ? 0 : volume / 100;

    if (muted || volume <= 0) {
      audio.pause();
      return;
    }

    const playMusic = async () => {
      try {
        await audio.play();
      } catch {}
    };

    void playMusic();
  }, [muted, volume]);

  return null;
}