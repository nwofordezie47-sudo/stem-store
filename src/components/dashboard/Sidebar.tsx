"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/stems", label: "Browse Stems" },
    { href: "/favorites", label: "Favorites" },
    { href: "/my-purchases", label: "Purchases" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <aside className="fixed left-4 top-24 bottom-4 w-64 z-30 rounded-3xl border border-zinc-200/50 dark:border-white/5 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-lg p-6 flex flex-col justify-between transition-colors duration-300">
      <div>
        <div className="flex items-center gap-2 mb-8">
          <Link
            href="/"
            className="text-2xl font-bold text-green-600 dark:text-green-500 hover:opacity-85 heading-font"
          >
            StemVault
          </Link>
          <span className="text-xs px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-bold rounded-full">
            Portal
          </span>
        </div>

        <div className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-green-600 dark:bg-green-500 text-white dark:text-black shadow-md shadow-green-500/15"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-900/40 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="text-xs text-zinc-450 dark:text-zinc-550 border-t border-zinc-200/40 dark:border-zinc-800/40 pt-4 font-semibold">
        © {new Date().getFullYear()} StemVault
      </div>
    </aside>
  );
}