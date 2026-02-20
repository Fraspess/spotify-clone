import { Search, User } from 'lucide-react'; // static icon pike ne merge pashu
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../services/store';

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search);
      const q = params.get('q') || '';
      setSearchQuery(q);
    } else {
      setSearchQuery('');
    }
  }, [location.pathname, location.search]);

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

            const trimmed = val.trim();
            if (trimmed === '') {
              navigate('/');
            } else {
              const encoded = encodeURIComponent(trimmed);
              if (location.pathname === '/search') {
                navigate(`/search?q=${encoded}`, { replace: true });
              } else {
                navigate(`/search?q=${encoded}`);
              }
            }
          }}
          className="w-full bg-bg-elevated hover:bg-bg-elevated-soft border border-transparent focus:border-white/20 rounded-full py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-text-muted outline-none transition-all shadow-inner"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {token ? (
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 bg-bg-elevated hover:bg-bg-elevated-soft px-3 py-1.5 rounded-full transition border border-white/5 active:scale-95"
          >
            <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-black">
              <User size={18} fill="currentColor" />
            </div>
            <span className="text-sm font-bold hidden sm:block">
              {user?.username || "Мій профіль"}
            </span>
          </button>
        ) : (
          <>
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
          </>
        )}
      </div>
    </header>
  );
};

export default Topbar;