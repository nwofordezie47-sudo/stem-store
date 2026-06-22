type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBar({ search, setSearch }: Props) {
  return (
    <div className="relative w-full z-10">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for stems, producers, genres..."
        className="w-full bg-white/40 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-5 pl-14 outline-none transition-all duration-300 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 backdrop-blur-xl text-zinc-900 dark:text-white placeholder-zinc-450 dark:placeholder-zinc-500 font-medium"
      />
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-550 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
        </svg>
      </div>
    </div>
  );
}