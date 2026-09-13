"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      href: "/stems",
      label: "Browse Stems",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 0L5.25 18.75m14.25-12.75v12.75M5.25 18.75v-12.75M5.25 18.75h14.25" />
        </svg>
      ),
    },
    {
      href: "/favorites",
      label: "Favorites",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      ),
    },
    {
      href: "/my-purchases",
      label: "Purchases",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
    },
    {
      href: "/profile",
      label: "Profile",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex fixed left-4 top-24 bottom-4 w-64 z-30 rounded-3xl border border-zinc-200/50 dark:border-white/5 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-lg p-6 flex-col justify-between transition-colors duration-300">
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-green-600 dark:bg-green-500 text-white dark:text-black shadow-md shadow-green-500/15"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-900/40 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-zinc-450 dark:text-zinc-550 border-t border-zinc-200/40 dark:border-zinc-800/40 pt-4 font-semibold">
          © {new Date().getFullYear()} StemVault
        </div>
      </aside>

      {/* Mobile Floating Menu Button (Screen < lg) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-green-600 dark:bg-green-500 hover:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold shadow-2xl transition-all duration-300 transform active:scale-95 cursor-pointer"
          aria-label="Open Dashboard Navigation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <span className="text-xs font-extrabold uppercase tracking-wider">Portal Menu</span>
        </button>
      </div>

      {/* Mobile Slide-Over Drawer Modal */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs h-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border-r border-zinc-200/60 dark:border-white/10 shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200/50 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Link
                    href="/"
                    className="text-2xl font-bold text-green-600 dark:text-green-500 heading-font"
                    onClick={() => setMobileOpen(false)}
                  >
                    StemVault
                  </Link>
                  <span className="text-[10px] px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-bold rounded-full">
                    Portal
                  </span>
                </div>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  aria-label="Close navigation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-green-600 dark:bg-green-500 text-white dark:text-black shadow-md shadow-green-500/15"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-zinc-450 dark:text-zinc-550 border-t border-zinc-200/40 dark:border-zinc-800/40 pt-4 font-semibold">
              © {new Date().getFullYear()} StemVault Portal
            </div>
          </div>
        </div>
      )}
    </>
  );
}