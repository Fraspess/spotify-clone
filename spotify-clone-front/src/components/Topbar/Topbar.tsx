import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <header className="flex items-center gap-x-4 px-6 py-3 bg-black/20 backdrop-blur-md sticky top-0 z-50">
      
      <div 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition flex-shrink-0"
      >
        <div className="flex items-end gap-0.5 h-5">
           <div className="w-1 bg-primary rounded-t h-[40%]" />
           <div className="w-1 bg-primary rounded-t h-[70%]" />
           <div className="w-1 bg-primary rounded-t h-[100%]" />
           <div className="w-1 bg-primary rounded-t h-[80%]" />
           <div className="w-1 bg-primary rounded-t h-[60%]" />
           <div className="w-1 bg-primary rounded-t h-[40%]" />
        </div>
        <span className="font-bold text-lg tracking-tight hidden md:block">
          Audio<span className="text-primary">Lab</span>
        </span>
      </div>

      <div className="flex-1 max-w-md relative group ml-4">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted group-focus-within:text-white transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Що ви хочете послухати?"
          value={searchQuery}
          onChange={(e) => {
            const val = e.target.value;
            setSearchQuery(val); 

            if (val.trim() === "") {
              navigate('/');
            } else if (location.pathname !== '/search') {
              navigate('/search');
            }
          }}
          className="w-full bg-bg-elevated hover:bg-bg-elevated-soft border border-transparent focus:border-white/20 rounded-full py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-text-muted outline-none transition-all shadow-inner"
        />
        
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-3 flex items-center text-text-muted hover:text-white"
          >
            <span className="text-xl">×</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button 
          onClick={() => navigate('/login?mode=register')}
          className="hidden sm:block text-text-muted hover:text-white font-bold text-sm transition"
        >
          Зареєструватися
        </button>
        <button 
          onClick={() => navigate('/login?mode=login')}
          className="bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition active:scale-95 text-sm"
        >
          Увійти
        </button>
      </div>
          </header>
  );
};

export default Topbar;