import { Play, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Mic2, ListMusic, MonitorSpeaker } from 'lucide-react';

import { useFavorites } from '../../context/FavoritesContext';

const Footer = () => {
  const { favorites, toggleFavorite } = useFavorites();

  // Тимчасово захардкожена пісня
  const currentSong = {
    id: 1,
    title: "Top Hits 2024",
    artist: "Various Artists",
  };

  const isFavorite = favorites.includes(currentSong.id);

  return (
      <footer className="h-[90px] bg-black border-t border-border-subtle px-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-x-4 w-[30%] min-w-[180px]">
          <div className="w-14 h-14 bg-bg-elevated rounded-md shadow-lg flex-shrink-0 border border-border-subtle overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary-dark to-bg-elevated flex items-center justify-center text-xs text-text-muted">
              IMG
            </div>
          </div>

          <div className="flex flex-col truncate">
            <p className="text-sm text-text-main font-semibold hover:underline cursor-pointer truncate">
              {currentSong.title}
            </p>
            <p className="text-xs text-text-muted hover:underline cursor-pointer truncate">
              {currentSong.artist}
            </p>
          </div>

          <button
              onClick={() => toggleFavorite(currentSong.id)}
              className="ml-2 text-text-muted hover:text-primary transition"
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center max-w-[45%] w-full gap-y-2">
          <div className="flex items-center gap-x-6 text-text-muted">
            <button className="hover:text-text-main transition"><Shuffle size={20} /></button>
            <button className="hover:text-text-main transition"><SkipBack size={24} fill="currentColor" /></button>
            <button className="bg-text-main text-black rounded-full p-2 hover:scale-105 transition active:scale-95">
              <Play size={24} fill="black" />
            </button>
            <button className="hover:text-text-main transition"><SkipForward size={24} fill="currentColor" /></button>
            <button className="hover:text-text-main transition"><Repeat size={20} /></button>
          </div>

          <div className="flex items-center gap-x-2 w-full max-w-md group">
            <span className="text-[11px] text-text-muted min-w-[30px] text-right">1:24</span>
            <div className="flex-1 h-1 bg-border-subtle rounded-full relative cursor-pointer">
              <div className="absolute top-0 left-0 h-full bg-text-main rounded-full group-hover:bg-primary transition-colors w-[40%]" />
            </div>
            <span className="text-[11px] text-text-muted min-w-[30px]">3:50</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center justify-end gap-x-3 w-[30%] text-text-muted">
          <button className="hover:text-text-main transition"><Mic2 size={18} /></button>
          <button className="hover:text-text-main transition"><ListMusic size={18} /></button>
          <button className="hover:text-text-main transition"><MonitorSpeaker size={18} /></button>
          <div className="flex items-center gap-x-2 w-32 group">
            <Volume2 size={20} />
            <div className="flex-1 h-1 bg-border-subtle rounded-full relative cursor-pointer">
              <div className="absolute top-0 left-0 h-full bg-text-main rounded-full group-hover:bg-primary w-[70%]" />
            </div>
          </div>
        </div>

      </footer>
  );
};

export default Footer;