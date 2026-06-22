"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { signupUser } from "@/services/authAPI";
import useAuth from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";

function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await signupUser(fullName, email, password);
      setUser(data.user);
      router.push(redirect);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Signup failed. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md liquid-glass p-8 md:p-10 border border-zinc-200/50 dark:border-white/5 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-2xl shadow-2xl relative z-10">
      <h1 className="text-4xl font-normal text-center text-zinc-900 dark:text-white heading-font">
        Create Account
      </h1>

      <p className="text-zinc-550 dark:text-zinc-400 text-center mt-3 font-semibold text-sm">
        Join StemVault to preview and download premium stems.
      </p>

      {error && (
        <p className="mt-6 text-red-505 text-center text-sm bg-red-500/5 border border-red-500/10 rounded-xl p-3.5 font-bold">
          {error}
        </p>
      )}

      <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full p-4 rounded-2xl bg-white/40 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-white/5 outline-none transition duration-300 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 rounded-2xl bg-white/40 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-white/5 outline-none transition duration-300 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full p-4 rounded-2xl bg-white/40 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-white/5 outline-none transition duration-300 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 font-semibold"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold py-4 rounded-2xl transition-all duration-305 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
        >
          {submitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-zinc-500 dark:text-zinc-400 mt-8 text-center text-sm font-semibold">
        Already have an account?
        <Link href="/login" className="text-green-600 dark:text-green-400 ml-2 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 mt-16 relative z-10">
      <Suspense fallback={
        <div className="h-10 w-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      }>
        <SignupForm />
      </Suspense>
    </main>
  );
}