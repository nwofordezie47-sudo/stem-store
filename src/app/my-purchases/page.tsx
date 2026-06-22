"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { getMyPurchases, downloadStem } from "@/services/purchaseAPI";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface PurchaseItem {
  id: string;
  amount: number;
  currency: string;
  paystackRef: string;
  createdAt: string;
  stem: {
    id: string;
    title: string;
    producer: string;
    thumbnailUrl: string;
    category: string;
    price: number;
  } | null;
}

export default function MyPurchasesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    getMyPurchases()
      .then((data) => setPurchases(data.purchases))
      .catch(() => setPurchases([]))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  const handleDownload = async (stemId: string) => {
    setDownloading(stemId);
    try {
      const data = await downloadStem(stemId);
      window.open(data.url, "_blank");
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen relative z-10 flex items-center justify-center">
        <div className="h-10 w-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10 transition-colors duration-300">
      <Sidebar />

      <main className="pl-76 pr-8 pt-28 pb-12">
        <div className="space-y-8">
          {/* Header Card */}
          <div className="bg-white/40 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-white/5 p-8 rounded-3xl backdrop-blur-xl shadow-lg">
            <h1 className="text-3xl md:text-4xl font-normal text-zinc-900 dark:text-white heading-font leading-none">
              My Purchases
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 font-bold text-sm">
              Securely download your purchased high-fidelity stem WAV files anytime.
            </p>
          </div>

          {purchases.length === 0 ? (
            <Card className="text-center py-16">
              <p className="text-zinc-500 dark:text-zinc-400 font-semibold text-lg mb-6">
                You haven&apos;t purchased any stems yet.
              </p>
              <Link href="/stems">
                <Button>Browse Marketplace</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {purchases.map((purchase) => (
                <Card key={purchase.id} className="flex flex-col justify-between">
                  <div className="flex items-start gap-4">
                    {purchase.stem?.thumbnailUrl && (
                      <img
                        src={purchase.stem.thumbnailUrl}
                        alt={purchase.stem.title}
                        className="h-20 w-20 rounded-2xl object-cover flex-shrink-0 border border-zinc-200/50 dark:border-white/5"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white heading-font truncate">
                        {purchase.stem?.title ?? "Deleted Stem"}
                      </h2>
                      <p className="mt-1 text-zinc-600 dark:text-zinc-400 font-semibold text-sm">
                        By {purchase.stem?.producer || "Unknown"}
                      </p>
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500 font-bold">
                        Acquired on {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white heading-font">
                      ₦{purchase.amount.toLocaleString()}
                    </p>
                  </div>
                  
                  {purchase.stem && (
                    <div className="mt-6 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/40">
                      <Button
                        onClick={() => handleDownload(purchase.stem!.id)}
                        disabled={downloading === purchase.stem.id}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        {downloading === purchase.stem.id ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                            <span>Requesting secure link...</span>
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            <span>Download WAV Stems</span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}