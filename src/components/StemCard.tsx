import Link from "next/link";
import { Stem } from "@/types/Stem";
import AudioPlayer from "./AudioPlayer";

type Props = {
  stem: Stem;
};

export default function StemCard({ stem }: Props) {
  return (
    <div className="liquid-glass group overflow-hidden flex flex-col justify-between">
      {/* Thumbnail with hover zoom */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={stem.thumbnailUrl}
          alt={stem.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-green-400 border border-white/10 uppercase tracking-widest">
          {stem.category}
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white heading-font truncate">
            {stem.title}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-semibold text-sm">
            By {stem.producer}
          </p>

          <AudioPlayer previewUrl={stem.previewUrl} />
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/40">
          <span className="text-zinc-900 dark:text-white text-xl font-bold">
            ₦{stem.price.toLocaleString()}
          </span>

          <Link
            href={`/stem/${stem.id}`}
            className="bg-green-600 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold px-6 py-2.5 rounded-xl transition-all duration-200 transform active:scale-95 text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}