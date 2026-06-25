"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { verifyPayment } from "@/services/paymentAPI";
import Link from "next/link";

function MockCheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reference = searchParams.get("reference") || "";
  const title = searchParams.get("title") || "Premium Music Stem";
  const amountKobo = parseInt(searchParams.get("amount") || "0", 10);
  const amountNaira = amountKobo / 100;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"card" | "bank">("card");

  // Simulated credit card state
  const [cardNumber, setCardNumber] = useState("4081 0000 0000 0000");
  const [expiry, setExpiry] = useState("12/29");
  const [cvv, setCvv] = useState("123");

  const handlePaySuccess = async () => {
    if (!reference) {
      setError("Missing transaction reference.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Call backend verification
      await verifyPayment(reference);
      setSuccess(true);
      setTimeout(() => {
        router.push("/my-purchases?success=true");
      }, 1500);
    } catch {
      setError("Simulation verification failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row">
      {/* Left Sidebar Info */}
      <div className="md:w-5/12 bg-zinc-900/60 p-6 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="h-6 w-6 bg-teal-500 rounded-full flex items-center justify-center font-bold text-black text-xs">P</div>
            <span className="text-zinc-300 font-bold tracking-wider text-sm">paystack</span>
            <span className="bg-zinc-800 text-[10px] text-zinc-400 font-bold px-2 py-0.5 rounded uppercase">Test</span>
          </div>
          
          <div className="space-y-1">
            <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider block">Stem Title</span>
            <span className="text-white font-semibold text-base block leading-snug truncate">{title}</span>
          </div>
        </div>

        <div className="mt-8 md:mt-0">
          <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider block">Payable Amount</span>
          <span className="text-2xl font-bold text-white heading-font mt-1 block">₦{amountNaira.toLocaleString()}</span>
        </div>
      </div>

      {/* Right Interactive Panel */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-zinc-950">
        <div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-900">
            <h2 className="text-zinc-200 font-bold text-sm">Choose Payment Method</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMethod("card")}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                  selectedMethod === "card" ? "bg-teal-500 text-black" : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                Card
              </button>
              <button
                onClick={() => setSelectedMethod("bank")}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                  selectedMethod === "bank" ? "bg-teal-500 text-black" : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                Bank
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-xs font-bold text-red-400 bg-red-950/20 border border-red-900/50 rounded-xl p-3 text-center">
              {error}
            </div>
          )}

          {success ? (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 bg-teal-500/20 border border-teal-500/40 text-teal-400 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg">Payment Successful!</h3>
              <p className="text-zinc-400 text-xs mt-1">Verifying with merchant and redirecting...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedMethod === "card" ? (
                <div className="space-y-4">
                  {/* Card Simulation Frame */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-teal-600/90 to-teal-800 p-5 rounded-2xl text-black shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                      <span className="font-extrabold italic tracking-wider text-xs">VISA</span>
                      <div className="h-7 w-9 bg-yellow-400/80 rounded-md border border-yellow-500/30" />
                    </div>
                    <div className="mb-4">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-black/20 focus:border-black/40 outline-none w-full text-lg font-bold tracking-widest text-black/90"
                      />
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider block opacity-70">Expiry</span>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="bg-transparent border-b border-transparent hover:border-black/20 focus:border-black/40 outline-none w-14 font-bold text-xs"
                        />
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider block opacity-70">CVV</span>
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="bg-transparent border-b border-transparent hover:border-black/20 focus:border-black/40 outline-none w-10 text-right font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold">
                    This is a **Sandbox Payment Simulator**. Clicking the button below will authorize a mock successful response to verify the integration.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 py-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-zinc-400 font-bold block">Mock Account Number</span>
                      <span className="text-white font-bold text-base mt-0.5 block tracking-wider">0123456789</span>
                    </div>
                    <span className="bg-teal-500/10 text-teal-400 text-[10px] font-bold px-2 py-1 rounded-lg">Wema Bank</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold">
                    Select mock transfer to complete verification.
                  </p>
                </div>
              )}

              <div className="pt-4 space-y-3">
                <button
                  onClick={handlePaySuccess}
                  disabled={loading}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-black font-extrabold py-3.5 rounded-2xl transition duration-300 transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing...</span>
                    </>
                  ) : (
                    <span>Pay ₦{amountNaira.toLocaleString()}</span>
                  )}
                </button>

                <Link
                  href="/stems"
                  className="w-full border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white font-bold py-3 rounded-2xl transition duration-300 text-xs cursor-pointer block text-center"
                >
                  Decline & Cancel Payment
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MockCheckoutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative z-10 bg-zinc-950 pt-20">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <Suspense fallback={
        <div className="h-10 w-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      }>
        <MockCheckoutForm />
      </Suspense>
    </main>
  );
}
