"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllStems } from "@/services/stemAPI";
import { Stem } from "@/types/Stem";
import StemCard from "@/components/StemCard";
import CountUp from "@/components/ui/CountUp";

export default function Home() {
  const [featuredStems, setFeaturedStems] = useState<Stem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    getAllStems({ limit: 6 })
      .then((data) => {
        const stems = data.stems as Stem[];
        const featured = stems.filter((s) => s.isFeatured);
        if (featured.length > 0) {
          setFeaturedStems(featured.slice(0, 3));
        } else {
          setFeaturedStems(stems.slice(0, 3));
        }
      })
      .catch(() => {
        setFeaturedStems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const faqs = [
    {
      q: "How do I download stems?",
      a: "After secure checkout via Paystack, the purchased stems will immediately appear in your purchases tab. You can download high-fidelity WAV files anytime."
    },
    {
      q: "What payment methods are supported?",
      a: "We support safe, encrypted payments powered by Paystack, including debit/credit cards, bank transfers, USSD, and mobile money."
    },
    {
      q: "Are the stems royalty-free?",
      a: "All stems purchased on StemVault include a commercial usage license. Please review individual producer terms on the product page for specific details."
    }
  ];

  return (
    <main className="min-h-screen relative z-10 px-4 sm:px-6 md:px-8 py-8 sm:py-12 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative mt-20 sm:mt-24 min-h-[75vh] sm:min-h-[80vh] flex flex-col items-center justify-center text-center rounded-3xl sm:rounded-[3rem] overflow-hidden border border-white/10 dark:border-white/5 bg-white/20 dark:bg-zinc-950/20 backdrop-blur-2xl shadow-2xl p-6 sm:p-10 md:p-16">
        {/* Soft Glass Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none" />
        
        <div className="max-w-4xl relative z-10">
          <p className="mb-4 sm:mb-6 text-xs md:text-sm font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-green-600 dark:text-green-400">
            Premium Stems for Modern Producers
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-normal leading-tight sm:leading-none tracking-tight text-zinc-900 dark:text-white heading-font">
            Discover Premium Music <span className="text-green-600 dark:text-green-500 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300">Stems</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mt-6 sm:mt-8 font-medium leading-relaxed">
            Elevate your production workflow. Audition, purchase, and instantly download high-quality multi-tracks securely.
          </p>

          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Link
              href="/stems"
              className="inline-flex items-center justify-center rounded-2xl bg-green-600 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black px-8 sm:px-10 py-3.5 sm:py-4 font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-green-500/20 text-sm sm:text-base"
            >
              Browse Stems
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-white/40 dark:bg-black/40 hover:bg-white/60 dark:hover:bg-zinc-900/60 px-8 sm:px-10 py-3.5 sm:py-4 font-bold text-zinc-850 dark:text-zinc-200 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="max-w-6xl mx-auto py-12 sm:py-20 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="liquid-glass p-6 sm:p-8 md:p-10 text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal text-green-600 dark:text-green-400 heading-font">
              <CountUp end={1000} suffix="+" />
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs mt-3">
              Premium WAV Stems
            </p>
          </div>

          <div className="liquid-glass p-6 sm:p-8 md:p-10 text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal text-green-600 dark:text-green-400 heading-font">
              <CountUp end={500} suffix="+" />
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs mt-3">
              Elite Global Producers
            </p>
          </div>

          <div className="liquid-glass p-6 sm:p-8 md:p-10 text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal text-green-600 dark:text-green-400 heading-font">
              <CountUp end={10} suffix="K+" />
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs mt-3">
              Instant Downloads
            </p>
          </div>
        </div>
      </section>

      {/* Featured Stems Section */}
      <section className="max-w-6xl mx-auto py-10 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-zinc-900 dark:text-white heading-font">
              Featured Stems
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-base sm:text-lg">
              Handpicked premium tracks setting the trend.
            </p>
          </div>
          <Link
            href="/stems"
            className="text-green-600 dark:text-green-400 hover:text-green-500 font-bold flex items-center gap-2 transition duration-200 self-start md:self-auto"
          >
            See all stems <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-10 w-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : featuredStems.length === 0 ? (
          <div className="liquid-glass p-10 sm:p-16 text-center text-zinc-400">
            No featured stems available right now. Check back shortly!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredStems.map((stem) => (
              <StemCard key={stem.id} stem={stem} />
            ))}
          </div>
        )}
      </section>

      {/* Selling Points Section */}
      <section className="max-w-6xl mx-auto py-12 sm:py-20 md:py-24">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-center text-zinc-900 dark:text-white heading-font">
          Why Producers Choose StemVault
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-10 sm:mt-16">
          <div className="liquid-glass p-6 sm:p-8 md:p-10">
            <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 mb-6 border border-green-500/25">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 0L5.25 18.75m14.25-12.75v12.75M5.25 18.75v-12.75M5.25 18.75h14.25" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold heading-font text-zinc-900 dark:text-white">Studio Quality</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base">
              Lossless, fully tracking multi-channel WAV stems mixed by professionals ready for drag-and-drop.
            </p>
          </div>

          <div className="liquid-glass p-6 sm:p-8 md:p-10">
            <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 mb-6 border border-green-500/25">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold heading-font text-zinc-900 dark:text-white">Instant Downloads</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base">
              No subscription gates. Make a one-time purchase and access secure downloads directly in your dashboard.
            </p>
          </div>

          <div className="liquid-glass p-6 sm:p-8 md:p-10">
            <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 mb-6 border border-green-500/25">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold heading-font text-zinc-900 dark:text-white">Secure Checkout</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base">
              Integrations with Paystack ensure your banking information is protected with industry-standard bank security.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto py-12 sm:py-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-center text-zinc-900 dark:text-white heading-font">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 mt-10 sm:mt-16">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="liquid-glass overflow-hidden cursor-pointer"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="p-5 sm:p-8 flex items-center justify-between gap-4 select-none">
                <h3 className="font-semibold text-base sm:text-lg md:text-xl text-zinc-900 dark:text-white">
                  {faq.q}
                </h3>
                <span className="text-2xl text-green-600 dark:text-green-400 font-bold transition-transform duration-300" style={{ transform: activeFaq === idx ? 'rotate(45deg)' : 'rotate(0)' }}>
                  +
                </span>
              </div>
              <div
                className="transition-all duration-305 ease-in-out"
                style={{
                  maxHeight: activeFaq === idx ? "200px" : "0px",
                  opacity: activeFaq === idx ? 1 : 0,
                }}
              >
                <div className="px-5 pb-5 sm:px-8 sm:pb-8 text-zinc-600 dark:text-zinc-400 border-t border-zinc-200/40 dark:border-zinc-800/40 pt-4 leading-relaxed text-sm md:text-base">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}