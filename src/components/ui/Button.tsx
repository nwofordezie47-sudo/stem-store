import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  className?: string;
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-2xl px-6 py-2.5 text-sm font-bold transition-all duration-300 transform active:scale-95 focus:outline-none cursor-pointer";

  const variantStyles =
    variant === "secondary"
      ? "bg-white/30 dark:bg-zinc-900/40 text-zinc-750 dark:text-zinc-300 border border-zinc-200/50 dark:border-white/5 hover:border-green-500/30 dark:hover:border-green-500/20"
      : "bg-green-600 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black shadow-md hover:shadow-green-500/10";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`.trim()}
      {...props}
    />
  );
}
