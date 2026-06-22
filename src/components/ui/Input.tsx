import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export default function Input({
  className = "",
  ...props
}: Props) {
  return (
    <input
      className={`w-full rounded-xl border border-green-900 bg-black px-4 py-3 text-green-100 outline-none transition duration-200 placeholder:text-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 ${className}`.trim()}
      {...props}
    />
  );
}
