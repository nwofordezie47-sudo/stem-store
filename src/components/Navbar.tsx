"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { logoutUser } from "@/services/authAPI";
import { useRouter, usePathname } from "next/navigation";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function Navbar() {
  const { user, setUser, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    setMobileMenuOpen(false);
    try {
      await logoutUser();
      setUser(null);
      router.push("/");
    } catch {
      // Silently fail
    }
  };

  return (
    <>
      <nav className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 w-[94%] sm:w-[90%] max-w-6xl z-50 rounded-2xl sm:rounded-3xl border border-zinc-200/60 dark:border-white/10 bg-white/70 dark:bg-black/50 backdrop-blur-2xl shadow-xl transition-all duration-300">
        <div className="px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-500 hover:opacity-85 transition duration-200 heading-font tracking-tight"
            onClick={() => setMobileMenuOpen(false)}
          >
            StemVault
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-zinc-700 dark:text-zinc-300">
            <Link
              href="/"
              className={`hover:text-green-600 dark:hover:text-green-400 transition duration-200 ${
                pathname === "/" ? "text-green-600 dark:text-green-400 font-bold" : ""
              }`}
            >
              Home
            </Link>

            <Link
              href="/stems"
              className={`hover:text-green-600 dark:hover:text-green-400 transition duration-200 ${
                pathname === "/stems" ? "text-green-600 dark:text-green-400 font-bold" : ""
              }`}
            >
              Browse Stems
            </Link>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition duration-200 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                // Sun Icon
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              ) : (
                // Moon Icon
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              )}
            </button>

            {/* Desktop Auth Controls */}
            <div className="hidden md:flex items-center gap-4">
              {loading ? (
                <div className="h-9 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              ) : user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-zinc-700 dark:text-zinc-300 hover:text-green-600 dark:hover:text-green-400 font-semibold text-sm transition duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="bg-zinc-200/80 dark:bg-zinc-800/80 hover:bg-zinc-300 dark:hover:bg-zinc-700 px-4 py-2 rounded-xl sm:rounded-2xl font-bold text-zinc-800 dark:text-zinc-200 text-sm transition duration-200 border border-zinc-300/40 dark:border-zinc-700/40 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-zinc-700 dark:text-zinc-300 hover:text-green-600 dark:hover:text-green-400 font-semibold text-sm transition duration-200"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    className="bg-green-600 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 px-5 py-2.5 rounded-2xl font-bold text-white dark:text-black text-sm shadow-md transition duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 sm:p-2.5 rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition duration-200 cursor-pointer flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-5 h-4 relative flex flex-col justify-between items-center">
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 transform origin-left ${
                    mobileMenuOpen ? "rotate-45 translate-x-0.5 -translate-y-0.5" : ""
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-opacity duration-200 ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 transform origin-left ${
                    mobileMenuOpen ? "-rotate-45 translate-x-0.5 translate-y-0.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-zinc-200/40 dark:border-zinc-800/40 ${
            mobileMenuOpen ? "max-h-[500px] opacity-100 py-4 px-5" : "max-h-0 opacity-0 py-0 px-5"
          }`}
        >
          <div className="flex flex-col gap-3">
            {/* Nav links */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-xl font-bold text-sm transition duration-200 flex items-center justify-between ${
                pathname === "/"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50"
              }`}
            >
              <span>Home</span>
              {pathname === "/" && (
                <span className="w-2 h-2 rounded-full bg-green-500" />
              )}
            </Link>

            <Link
              href="/stems"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-xl font-bold text-sm transition duration-200 flex items-center justify-between ${
                pathname === "/stems"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50"
              }`}
            >
              <span>Browse Stems</span>
              {pathname === "/stems" && (
                <span className="w-2 h-2 rounded-full bg-green-500" />
              )}
            </Link>

            <div className="border-t border-zinc-200/40 dark:border-zinc-800/40 my-1" />

            {/* Mobile Auth Items */}
            {loading ? (
              <div className="h-10 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ) : user ? (
              <>
                <div className="px-3 py-2 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-white/5">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                    Signed in as
                  </p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white truncate mt-0.5">
                    {user.fullName || user.email}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 text-center rounded-xl bg-zinc-100 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 transition duration-200 border border-zinc-200/40 dark:border-zinc-800/40"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/my-purchases"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 text-center rounded-xl bg-zinc-100 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 transition duration-200 border border-zinc-200/40 dark:border-zinc-800/40"
                  >
                    Purchases
                  </Link>
                  <Link
                    href="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 text-center rounded-xl bg-zinc-100 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 transition duration-200 border border-zinc-200/40 dark:border-zinc-800/40"
                  >
                    Favorites
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 text-center rounded-xl bg-zinc-100 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 transition duration-200 border border-zinc-200/40 dark:border-zinc-800/40"
                  >
                    Profile
                  </Link>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full mt-1 p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 font-bold text-sm transition duration-200 cursor-pointer border border-red-500/20 text-center"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 transition duration-200"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center p-3 rounded-xl bg-green-600 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold text-sm shadow-md transition duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        title="Confirm Logout"
        message="Are you sure you want to log out of your StemVault account?"
        confirmText="Log Out"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
        isDanger={true}
      />
    </>
  );
}