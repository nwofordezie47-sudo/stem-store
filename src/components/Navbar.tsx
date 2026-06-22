"use client";

import Link from "next/link";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { logoutUser } from "@/services/authAPI";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function Navbar() {
  const { user, setUser, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
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
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 rounded-3xl border border-zinc-200/50 dark:border-white/5 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-lg transition-all duration-300">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-green-600 dark:text-green-500 hover:opacity-80 transition duration-200 heading-font"
          >
            StemVault
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-zinc-700 dark:text-zinc-300">
            <Link
              href="/"
              className="hover:text-green-600 dark:hover:text-green-400 transition duration-200"
            >
              Home
            </Link>

            <Link
              href="/stems"
              className="hover:text-green-600 dark:hover:text-green-400 transition duration-200"
            >
              Browse Stems
            </Link>
          </div>

          {/* Theme & Auth Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-350 dark:hover:bg-zinc-700 transition duration-200 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                // Sun Icon for Light Mode option
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              ) : (
                // Moon Icon for Dark Mode option
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              )}
            </button>

            {loading ? (
              <div className="h-10 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
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
                  className="bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 px-5 py-2.5 rounded-2xl font-bold text-zinc-800 dark:text-zinc-200 text-sm transition duration-205 border border-zinc-300/40 dark:border-zinc-700/40 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-zinc-700 dark:text-zinc-300 hover:text-green-600 dark:hover:text-green-400 font-semibold text-sm transition duration-205"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="bg-green-600 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 px-5 py-2.5 rounded-2xl font-bold text-white dark:text-black text-sm shadow-md transition duration-205"
                >
                  Get Started
                </Link>
              </>
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