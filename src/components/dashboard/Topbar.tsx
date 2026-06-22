"use client";

import useAuth from "@/hooks/useAuth";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-center mb-8 bg-white/40 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-white/5 p-6 rounded-3xl backdrop-blur-xl shadow-lg transition-colors duration-300">
      <div>
        <h1 className="text-3xl md:text-4xl font-normal text-zinc-900 dark:text-white heading-font leading-none">
          Dashboard
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-bold text-sm">
          Welcome back, {user?.fullName || "Creator"} 👋
        </p>
      </div>

      <div className="h-12 w-12 rounded-2xl bg-green-500/10 border border-green-500/25 flex items-center justify-center text-green-600 dark:text-green-400 font-bold uppercase tracking-wider text-lg shadow-sm">
        {user?.fullName?.slice(0, 2) || "SV"}
      </div>
    </div>
  );
}