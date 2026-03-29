import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Panel({ children, className }: Props) {
  return (
    <div
      className={clsx(
        "rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}