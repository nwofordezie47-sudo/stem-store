"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { getFavorites, removeFavorite } from "@/services/favoritesAPI";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import AudioPlayer from "@/components/AudioPlayer";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

interface FavoriteItem {
  id: string;
  title: string;
  producer: string;
  thumbnailUrl: string;
  previewUrl: string;
  category: string;
  price: number;
}

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedRemoveId, setSelectedRemoveId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    getFavorites()
      .then((data) => setFavorites(data.favorites))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  const handleRemoveInitiate = (stemId: string) => {
    setSelectedRemoveId(stemId);
    setShowRemoveModal(true);
  };

  const handleRemoveConfirm = async () => {
    if (!selectedRemoveId) return;
    setShowRemoveModal(false);
    setRemoving(selectedRemoveId);
    try {
      await removeFavorite(selectedRemoveId);
      setFavorites((prev) => prev.filter((f) => f.id !== selectedRemoveId));
    } catch {
      alert("Failed to remove from favorites.");
    } finally {
      setRemoving(null);
      setSelectedRemoveId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen relative z-10 flex items-center justify-center">
        <div className="h-10 w-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedStemTitle = favorites.find(f => f.id === selectedRemoveId)?.title || "this stem";

  return (
    <div className="min-h-screen relative z-10 transition-colors duration-300">
      <Sidebar />
      
      <main className="pl-76 pr-8 pt-28 pb-12">
        <div className="space-y-8">
          {/* Header Card */}
          <div className="bg-white/40 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-white/5 p-8 rounded-3xl backdrop-blur-xl shadow-lg">
            <h1 className="text-3xl md:text-4xl font-normal text-zinc-900 dark:text-white heading-font leading-none">
              Favorites
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 font-bold text-sm">
              Your saved stems are waiting here. Play, preview, or manage them from one place.
            </p>
          </div>

          {favorites.length === 0 ? (
            <Card className="text-center py-16">
              <p className="text-zinc-500 dark:text-zinc-400 font-semibold text-lg mb-6">
                No favorites saved yet. Start exploring the marketplace!
              </p>
              <Link href="/stems">
                <Button>Browse Stems</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {favorites.map((item) => (
                <Card key={item.id} className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-start gap-4">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="h-20 w-20 rounded-2xl object-cover flex-shrink-0 border border-zinc-200/50 dark:border-white/5"
                      />
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white heading-font truncate">
                          {item.title}
                        </h2>
                        <p className="mt-1 text-zinc-500 dark:text-zinc-400 font-semibold text-sm">
                          By {item.producer}
                        </p>
                        <div className="mt-2">
                          <span className="rounded-xl bg-green-500/5 border border-green-500/10 text-green-600 dark:text-green-400 px-3 py-0.5 text-xs font-bold uppercase tracking-wider">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white heading-font">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>

                    <AudioPlayer previewUrl={item.previewUrl} />
                  </div>

                  <div className="flex items-center gap-4 mt-6 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/40">
                    <Link href={`/stem/${item.id}`} className="flex-grow">
                      <Button className="w-full">View Details</Button>
                    </Link>
                    <Button
                      variant="secondary"
                      onClick={() => handleRemoveInitiate(item.id)}
                      disabled={removing === item.id}
                      className="px-5 border border-zinc-200 dark:border-zinc-800 text-red-500 hover:text-red-400 hover:border-red-500/30"
                    >
                      {removing === item.id ? "Removing..." : "Remove"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Remove Favorite Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRemoveModal}
        title="Remove Favorite"
        message={`Are you sure you want to remove "${selectedStemTitle}" from your favorites?`}
        confirmText="Remove"
        onConfirm={handleRemoveConfirm}
        onCancel={() => setShowRemoveModal(false)}
        isDanger={true}
      />
    </div>
  );
}
