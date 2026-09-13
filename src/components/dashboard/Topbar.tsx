"use client";

import useAuth from "@/hooks/useAuth";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-center mb-8 bg-white/40 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-white/5 p-5 sm:p-6 rounded-3xl backdrop-blur-xl shadow-lg transition-colors duration-300">
      <div className="min-w-0 pr-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal text-zinc-900 dark:text-white heading-font leading-none truncate">
          Dashboard
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1.5 sm:mt-2 font-bold text-xs sm:text-sm truncate">
          Welcome back, {user?.fullName || "Creator"} 👋
        </p>
      </div>

      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-green-500/10 border border-green-500/25 flex-shrink-0 flex items-center justify-center text-green-600 dark:text-green-400 font-bold uppercase tracking-wider text-sm sm:text-lg shadow-sm">
        {user?.fullName?.slice(0, 2) || "SV"}
      </div>
    </div>
  );
}