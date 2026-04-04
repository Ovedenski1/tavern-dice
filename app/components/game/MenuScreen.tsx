"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Bot,
  UserRound,
  Palette,
  ScrollText,
  Settings,
  BadgeInfo,
  X,
  Upload,
  ShoppingBag,
} from "lucide-react";
import MenuFooter from "./MenuFooter";

type Props = {
  onVsBots: () => void;
  onCustomize: () => void;
  onRules: () => void;
  onOpenSettings: () => void;
};

type MenuAction =
  | "player"
  | "bots"
  | "profile"
  | "customize"
  | "rules"
  | "shop"
  | "settings"
  | "credits";

type MenuItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: MenuAction;
  disabled?: boolean;
  badge?: string;
};

type Star = {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
};

const PROFILE_NAME_KEY = "franky-farkle-player-name";
const PROFILE_AVATAR_KEY = "franky-farkle-player-avatar";

function StarField() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    function buildStars() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const starCount = Math.max(110, Math.floor((width * height) / 18000));

      const generated = Array.from({ length: starCount }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() > 0.82 ? 3 : Math.random() > 0.4 ? 2 : 1.5,
        delay: `${Math.random() * 4}s`,
        duration: `${2.2 + Math.random() * 2.8}s`,
        opacity: 0.3 + Math.random() * 0.7,
      }));

      setStars(generated);
    }

    buildStars();
    window.addEventListener("resize", buildStars);

    return () => {
      window.removeEventListener("resize", buildStars);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <span
          key={star.id}
          className="menu-star absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration,
            boxShadow: "0 0 8px rgba(255,255,255,0.55)",
          }}
        />
      ))}
    </div>
  );
}

function CreditsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/55 px-4 backdrop-blur-[2px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-[460px] rounded-[1.4rem] border border-white/10 bg-[#1b2430]/95 p-6 shadow-2xl"
        style={{ imageRendering: "pixelated" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
          aria-label="Close credits"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pr-10">
          <h3
            className="text-3xl text-amber-200"
            style={{
              fontFamily: "var(--font-heading)",
              textShadow: "0 2px 0 rgba(0,0,0,0.35)",
            }}
          >
            Credits
          </h3>

          <p className="mt-4 text-stone-200/90">Franky Farkle</p>

          <div className="mt-4 space-y-2 text-sm text-stone-300">
            <p>Design, code, balancing, and polish by your tavern crew.</p>
            <p>You can replace this text with your real names and credits later.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 rounded-xl border border-amber-300/20 bg-amber-400/90 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-300"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ProfileModal({
  open,
  onClose,
  playerName,
  setPlayerName,
  playerAvatar,
  setPlayerAvatar,
}: {
  open: boolean;
  onClose: () => void;
  playerName: string;
  setPlayerName: React.Dispatch<React.SetStateAction<string>>;
  playerAvatar: string | null;
  setPlayerAvatar: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [draftName, setDraftName] = useState(playerName);
  const [draftAvatar, setDraftAvatar] = useState<string | null>(playerAvatar);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setDraftName(playerName);
    setDraftAvatar(playerAvatar);
  }, [open, playerName, playerAvatar]);

  if (!open) return null;

  function handlePickImage() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (result) {
        setDraftAvatar(result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    const trimmedName = draftName.trim() || "Player";
    setPlayerName(trimmedName);
    setPlayerAvatar(draftAvatar);

    localStorage.setItem(PROFILE_NAME_KEY, trimmedName);

    if (draftAvatar) {
      localStorage.setItem(PROFILE_AVATAR_KEY, draftAvatar);
    } else {
      localStorage.removeItem(PROFILE_AVATAR_KEY);
    }

    onClose();
  }

  function handleResetAvatar() {
    setDraftAvatar(null);
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/55 px-4 backdrop-blur-[2px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-[520px] rounded-[1.4rem] border border-white/10 bg-[#1b2430]/95 p-6 shadow-2xl"
        style={{ imageRendering: "pixelated" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
          aria-label="Close profile"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pr-10">
          <h3
            className="text-3xl text-amber-200"
            style={{
              fontFamily: "var(--font-heading)",
              textShadow: "0 2px 0 rgba(0,0,0,0.35)",
            }}
          >
            Profile
          </h3>

          <p className="mt-2 text-sm text-stone-300">
            Change your player name and profile picture.
          </p>

          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-amber-300/35 bg-black/20">
                {draftAvatar ? (
                  <img
                    src={draftAvatar}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-stone-200">
                    <UserRound className="h-12 w-12" />
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={handlePickImage}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-400/90 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-300"
              >
                <Upload className="h-4 w-4" />
                Upload Pic
              </button>

              <button
                type="button"
                onClick={handleResetAvatar}
                className="text-xs text-stone-300 underline decoration-white/30 underline-offset-4"
              >
                Remove picture
              </button>
            </div>

            <div className="w-full">
              <label className="mb-2 block text-sm text-stone-200">Player name</label>
              <input
                type="text"
                maxLength={20}
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none placeholder:text-stone-400"
                style={{ fontFamily: "var(--font-ui)" }}
              />

              <p className="mt-2 text-xs text-stone-400">
                Saved locally in your browser.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl border border-amber-300/20 bg-amber-400/90 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-300"
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MenuButton({
  label,
  icon: Icon,
  onClick,
  delay = 0,
  disabled = false,
  badge,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  delay?: number;
  disabled?: boolean;
  badge?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay }}
      whileHover={disabled ? undefined : { scale: 1.015 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      disabled={disabled}
      className={[
        "group relative flex w-full items-center justify-center overflow-hidden",
        "rounded-[1.2rem] border px-5 py-4 text-center transition",
        disabled
          ? "cursor-not-allowed border-[#6f6544] bg-[linear-gradient(to_bottom,#b9a76a_0%,#9c8750_52%,#7d6840_100%)] opacity-60"
          : "cursor-pointer border-[#5f4a1f] bg-[linear-gradient(to_bottom,#f8d35d_0%,#e7b93a_52%,#c8921b_100%)]",
        disabled
          ? "text-[#2b2114]"
          : "text-[#2a1905] shadow-[0_4px_0_rgba(80,50,8,0.9),0_10px_20px_rgba(0,0,0,0.22)]",
      ].join(" ")}
      style={{
        imageRendering: "pixelated",
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.12)_0px,rgba(255,255,255,0.12)_2px,rgba(0,0,0,0.04)_2px,rgba(0,0,0,0.04)_4px)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.32),rgba(255,255,255,0))]" />

      <div className="absolute left-5 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[0.8rem] border border-[#6b4b10] bg-[#fff2c2]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
        <Icon className="h-5 w-5" />
      </div>

      <span
        className="relative z-10 block w-full text-center text-[clamp(0.95rem,1.8vw,1.2rem)] uppercase tracking-[0.08em]"
        style={{
          fontFamily: "var(--font-heading)",
          textShadow: "0 1px 0 rgba(255,255,255,0.35)",
        }}
      >
        {label}
      </span>

      {badge ? (
        <span className="absolute right-5 top-1/2 z-10 -translate-y-1/2 rounded-full border border-black/10 bg-black/10 px-2 py-1 text-[0.62rem] uppercase tracking-[0.12em] text-[#4c3202]">
          {badge}
        </span>
      ) : null}
    </motion.button>
  );
}

export default function MenuScreen({
  onVsBots,
  onCustomize,
  onRules,
  onOpenSettings,
}: Props) {
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [playerName, setPlayerName] = useState("Player");
  const [playerAvatar, setPlayerAvatar] = useState<string | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem(PROFILE_NAME_KEY);
    const savedAvatar = localStorage.getItem(PROFILE_AVATAR_KEY);

    if (savedName) {
      setPlayerName(savedName);
    }

    if (savedAvatar) {
      setPlayerAvatar(savedAvatar);
    }
  }, []);

  const menuItems: MenuItem[] = [
    {
      label: "VS Player",
      icon: Users,
      action: "player",
      disabled: true,
      badge: "Soon",
    },
    {
      label: "VS Bots",
      icon: Bot,
      action: "bots",
    },
    {
      label: "Profile",
      icon: UserRound,
      action: "profile",
    },
    {
      label: "Customization",
      icon: Palette,
      action: "customize",
    },
    {
      label: "Rules",
      icon: ScrollText,
      action: "rules",
    },
    {
      label: "Shop",
      icon: ShoppingBag,
      action: "shop",
      disabled: true,
      badge: "Soon",
    },
    {
      label: "Settings",
      icon: Settings,
      action: "settings",
    },
    {
      label: "Credits",
      icon: BadgeInfo,
      action: "credits",
    },
  ];

  function handleAction(action: MenuAction) {
    if (action === "bots") {
      onVsBots();
      return;
    }

    if (action === "profile") {
      setProfileOpen(true);
      return;
    }

    if (action === "customize") {
      onCustomize();
      return;
    }

    if (action === "rules") {
      onRules();
      return;
    }

    if (action === "settings") {
      onOpenSettings();
      return;
    }

    if (action === "credits") {
      setCreditsOpen(true);
      return;
    }
  }

  return (
    <>
      <motion.div
        key="menu"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        className="relative min-h-[100dvh] overflow-hidden p-6 bg-[#4298CB]"
      >
        <StarField />
        <MenuFooter version="1.2" />

        <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-3xl items-start justify-center pt-28 pb-24">
          <div className="w-full">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-center text-5xl font-bold leading-none md:text-6xl"
              style={{
                fontFamily: "var(--font-heading)",
                textShadow: "0 4px 0 rgba(0,0,0,0.28)",
              }}
            >
              <span className="text-amber-200">Franky </span>
              <span className="text-red-500">Farkle</span>
            </motion.h2>

            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/10 px-4 py-2 text-stone-100">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-black/20">
                  {playerAvatar ? (
                    <img
                      src={playerAvatar}
                      alt="Player avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserRound className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div
                  className="text-sm uppercase tracking-[0.1em]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {playerName}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.14 }}
              className="mx-auto mt-10 max-w-[560px] rounded-[2rem] p-4 backdrop-blur-[2px]"
            >
              <div className="space-y-3">
                {menuItems.map((item, index) => (
                  <MenuButton
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    delay={0.08 + index * 0.05}
                    disabled={item.disabled}
                    badge={item.badge}
                    onClick={() => handleAction(item.action)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {creditsOpen ? (
          <CreditsModal open={creditsOpen} onClose={() => setCreditsOpen(false)} />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {profileOpen ? (
          <ProfileModal
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            playerName={playerName}
            setPlayerName={setPlayerName}
            playerAvatar={playerAvatar}
            setPlayerAvatar={setPlayerAvatar}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}