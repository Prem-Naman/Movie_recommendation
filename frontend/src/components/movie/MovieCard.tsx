import { Play, Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MovieCard({ movie }: { movie: any }) {
  return (
    <div className="group relative shrink-0 w-[240px] h-[360px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:z-20 bg-card border border-white/5">
      {movie.poster ? (
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-secondary flex items-center justify-center p-4 text-center">
          <span className="text-muted-foreground font-medium">{movie.title}</span>
        </div>
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content overlay */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-lg font-bold text-white line-clamp-2 mb-2">{movie.title}</h3>
        
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-primary/20 text-primary border-none">
            {movie.genre}
          </Badge>
          <div className="flex items-center text-sm font-medium text-yellow-500">
            <Star className="w-4 h-4 fill-current mr-1" />
            {movie.rating.toFixed(1)}
          </div>
        </div>
        
        <div className="flex gap-2">
          <a
            href={movie.trailer}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            Trailer
          </a>
          <button className="p-2 border border-white/30 rounded-md hover:bg-white/10 transition-colors text-white">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
