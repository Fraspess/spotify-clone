import { Play, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Mic2, ListMusic, MonitorSpeaker } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="h-[90px] bg-black border-t border-border-subtle px-4 flex items-center justify-between">
      
      <div className="flex items-center gap-x-4 w-[30%] min-w-[180px]">
        <div className="w-14 h-14 bg-bg-elevated rounded-md shadow-lg flex-shrink-0 border border-border-subtle overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary-dark to-bg-elevated flex items-center justify-center text-xs text-text-muted">
            IMG
          </div>
        </div>
        <div className="flex flex-col truncate">
          <p className="text-sm text-text-main font-semibold hover:underline cursor-pointer truncate">
            Назва пісні
          </p>
          <p className="text-xs text-text-muted hover:underline cursor-pointer truncate">
            Виконавець
          </p>
        </div>
        <button className="text-text-muted hover:text-primary transition ml-2">
          ❤️
        </button>
      </div>

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
            <div className="absolute top-1/2 left-[40%] -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md hidden group-hover:block" />
          </div>
          <span className="text-[11px] text-text-muted min-w-[30px]">3:50</span>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-end gap-x-3 w-[30%] text-text-muted">
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