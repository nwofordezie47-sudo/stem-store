import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: Props) {
  return (
    <div
      className={`liquid-glass p-6 bg-white/40 dark:bg-zinc-950/20 text-zinc-900 dark:text-white border-zinc-200/50 dark:border-white/5 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
