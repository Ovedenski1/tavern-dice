import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "gold" | "ghost" | "green";
};

export default function Button({
  children,
  className,
  variant = "ghost",
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        "rounded-2xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "gold" && "bg-amber-400 text-stone-950 hover:bg-amber-300",
        variant === "ghost" &&
          "border border-white/15 bg-white/5 text-stone-100 hover:bg-white/10",
        variant === "green" &&
          "border border-emerald-300/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}