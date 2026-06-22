"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import StemCard from "@/components/StemCard";
import { getAllStems } from "@/services/stemAPI";
import { Stem } from "@/types/Stem";

export default function StemsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stems, setStems] = useState<Stem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getAllStems({
      search: search || undefined,
      category: category !== "All" ? category : undefined,
    })
      .then((data) => {
        setStems(data.stems);
        setError("");
      })
      .catch(() => {
        setError("Failed to load stems from server.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, category]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 mt-28 min-h-[80vh] relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-normal text-zinc-900 dark:text-white heading-font">
            Browse Stems
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-lg">
            Find the perfect layers, instrumentals, and loops for your next production.
          </p>
        </div>
      </div>

      <div className="liquid-glass p-8 mb-12 flex flex-col gap-2">
        <SearchBar search={search} setSearch={setSearch} />
        <CategoryFilter category={category} setCategory={setCategory} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="h-10 w-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="liquid-glass p-12 text-center text-red-500 font-semibold">
          {error}
        </div>
      ) : stems.length === 0 ? (
        <div className="liquid-glass p-16 text-center text-zinc-450 dark:text-zinc-500">
          No stems match your search criteria. Try browsing another category or keyword!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stems.map((stem) => (
            <StemCard key={stem.id} stem={stem} />
          ))}
        </div>
      )}
    </main>
  );
}