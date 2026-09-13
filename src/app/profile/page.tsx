"use client";

import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Card from "@/components/ui/Card";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen relative z-10 flex items-center justify-center">
        <div className="h-10 w-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10 transition-colors duration-300">
      <Sidebar />

      <main className="px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:pl-76 lg:pr-8">
        <div className="space-y-8">
          {/* Header Card */}
          <div className="bg-white/40 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-lg">
            <h1 className="text-3xl md:text-4xl font-normal text-zinc-900 dark:text-white heading-font leading-none">
              My Profile
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 font-bold text-sm">
              Manage your credentials, role privileges, and account settings.
            </p>
          </div>

          <Card className="max-w-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-24 w-24 rounded-3xl bg-green-500/10 border border-green-500/25 flex items-center justify-center text-green-600 dark:text-green-400 text-4xl font-bold uppercase tracking-wider shadow-sm">
                {user.fullName.charAt(0)}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white heading-font">
                  {user.fullName}
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-semibold text-md">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-200/50 dark:border-zinc-800/40 my-8" />

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Account Role
                </span>
                <span className="text-sm font-bold capitalize px-3 py-1 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                  {user.role}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Saved Favorites
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  {user.favorites?.length ?? 0} tracks
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Member Since
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  June 2026
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}