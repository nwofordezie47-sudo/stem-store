"use client";

import { use, useState, useEffect } from "react";
import { getStemById } from "@/services/stemAPI";
import { initializePayment } from "@/services/paymentAPI";
import useAuth from "@/hooks/useAuth";
import { Stem } from "@/types/Stem";
import AudioPlayer from "@/components/AudioPlayer";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Link from "next/link";

export default function StemDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const [stem, setStem] = useState<Stem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buying, setBuying] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  useEffect(() => {
    getStemById(id)
      .then((data) => setStem(data.stem))
      .catch(() => setError("Stem not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuyInitiate = () => {
    if (!user) {
      window.location.href = `/login?redirect=/stem/${id}`;
      return;
    }
    setShowBuyModal(true);
  };

  const handleBuyConfirm = async () => {
    setShowBuyModal(false);
    setBuying(true);
    try {
      const data = await initializePayment(id);
      window.location.href = data.authorization_url;
    } catch {
      setError("Payment initialization failed. Please try again.");
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="h-10 w-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !stem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center relative z-10 px-6">
        <div className="liquid-glass max-w-md p-10">
          <h1 className="text-3xl font-normal text-red-500 heading-font mb-4">
            Error
          </h1>
          <p className="text-zinc-550 dark:text-zinc-400 mb-6 font-medium">
            {error || "We couldn't find the requested stem."}
          </p>
          <Link
            href="/stems"
            className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-xl transition duration-200"
          >
            Back to Stems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 mt-28 min-h-[85vh] relative z-10">
      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Album Artwork Cover */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="liquid-glass group relative overflow-hidden rounded-[2rem] aspect-square w-full max-w-sm border border-zinc-200/50 dark:border-white/5 bg-zinc-100/50 dark:bg-zinc-950/20 shadow-2xl transition duration-500 hover:scale-[1.02]">
            <img
              src={stem.thumbnailUrl}
              alt={stem.title}
              className="h-full w-full object-cover rounded-[2rem] transition-transform duration-700 group-hover:rotate-6 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Details section */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <div className="liquid-glass p-8 md:p-10 flex flex-col gap-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-green-600 dark:text-green-400">
                {stem.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-normal text-zinc-900 dark:text-white heading-font mt-2 leading-none">
                {stem.title}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-bold text-lg">
                Producer: <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{stem.producer}</span>
              </p>
            </div>

            {stem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {stem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xl bg-green-500/5 border border-green-500/10 text-green-600 dark:text-green-400 px-3.5 py-1 text-xs font-bold uppercase tracking-widest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t border-zinc-200/50 dark:border-zinc-800/40 my-2" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-500 font-bold">Price</p>
                <h2 className="text-3xl md:text-4xl font-normal text-zinc-900 dark:text-white heading-font mt-1">
                  ₦{stem.price.toLocaleString()}
                </h2>
              </div>
              
              <button
                onClick={handleBuyInitiate}
                disabled={buying}
                className="bg-green-600 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/15 text-md cursor-pointer"
              >
                {buying ? "Redirecting..." : "Buy With Paystack"}
              </button>
            </div>
          </div>

          {/* Custom audio player box */}
          <div className="liquid-glass p-8">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-500 font-bold mb-1">
              Preview Audition
            </h3>
            <AudioPlayer previewUrl={stem.previewUrl} />
          </div>
        </div>
      </div>

      {/* Checkout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBuyModal}
        title="Confirm Purchase"
        message={`Are you sure you want to purchase "${stem.title}" by ${stem.producer} for ₦${stem.price.toLocaleString()}? You will be securely redirected to Paystack to complete your checkout.`}
        confirmText="Proceed to Paystack"
        onConfirm={handleBuyConfirm}
        onCancel={() => setShowBuyModal(false)}
      />
    </div>
  );
}