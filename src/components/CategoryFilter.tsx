type Props = {
  category: string;
  setCategory: (value: string) => void;
};

export default function CategoryFilter({ category, setCategory }: Props) {
  const categories = [
    "All",
    "Afrobeats",
    "Trap",
    "Amapiano",
    "Drill",
    "R&B",
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap mt-4 sm:mt-6 z-10 relative no-scrollbar">
      {categories.map((item) => (
        <button
          key={item}
          onClick={() => setCategory(item)}
          className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 transform active:scale-95 border cursor-pointer whitespace-nowrap flex-shrink-0 ${
            category === item
              ? "bg-green-600 dark:bg-green-500 text-white dark:text-black border-transparent shadow-md shadow-green-500/20"
              : "bg-white/40 dark:bg-zinc-950/40 text-zinc-700 dark:text-zinc-300 border-zinc-200/50 dark:border-white/5 hover:border-green-500/40 dark:hover:border-green-500/30"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}