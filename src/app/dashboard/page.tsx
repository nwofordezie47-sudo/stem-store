"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { getMyPurchases } from "@/services/purchaseAPI";
import { useRouter } from "next/navigation";
import Topbar from "@/components/dashboard/Topbar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import RecentPurchaseCard from "@/components/dashboard/RecentPurchaseCard";

interface PurchaseItem {
  id: string;
  amount: number;
  createdAt: string;
  stem: {
    id: string;
    title: string;
    producer: string;
    thumbnailUrl: string;
    price: number;
  } | null;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
  const recentPurchases = purchases.slice(0, 3);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="h-10 w-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Topbar />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Purchases"
          value={String(purchases.length)}
          description="Total tracks acquired"
        />

        <DashboardCard
          title="Favorites"
          value={String(user?.favorites?.length ?? 0)}
          description="Saved stems to review"
        />

        <DashboardCard
          title="Amount Spent"
          value={`₦${totalSpent.toLocaleString()}`}
          description="Total investment"
        />
      </div>

      <div className="pt-6">
        <h2 className="text-3xl font-normal text-zinc-900 dark:text-white heading-font mb-6">
          Recent Purchases
        </h2>

        {recentPurchases.length === 0 ? (
          <div className="liquid-glass p-12 text-center text-zinc-450 dark:text-zinc-500 font-semibold">
            You haven&apos;t purchased any stems yet. Browse the marketplace to get started!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPurchases.map((p) => (
              <RecentPurchaseCard
                key={p.id}
                title={p.stem?.title ?? "Deleted Stem"}
                date={new Date(p.createdAt).toLocaleDateString()}
                amount={`₦${p.amount.toLocaleString()}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}