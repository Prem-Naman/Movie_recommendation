import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./MovieCard";

export function MovieRow({ title, movies }: { title: string; movies: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -800 : 800;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-12 relative group">
      <h2 className="text-2xl font-bold mb-4 px-8 text-white">{title}</h2>
      
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-[60%] -translate-y-1/2 z-30 bg-black/50 p-2 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-8 pb-8 pt-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie, idx) => (
          <div key={`${movie.tmdb_id}-${idx}`} className="snap-start">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-[60%] -translate-y-1/2 z-30 bg-black/50 p-2 rounded-l-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>
    </div>
  );
}
