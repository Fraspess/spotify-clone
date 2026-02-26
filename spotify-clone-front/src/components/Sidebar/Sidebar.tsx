import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Library, Plus, Heart, Search } from 'lucide-react'; 
import { useGetMeQuery } from '../../services/Api/api.tsx';

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const { data: userData } = useGetMeQuery();
  const isAuth = !!userData;

  const navItems = [
    { name: 'Головна', path: '/', icon: Home },
    { name: 'Пошук', path: '/search', icon: Search },
  ];

  return (
    <aside className="w-64 flex flex-col gap-y-2 h-full bg-black p-2 select-none">
      <div className="rounded-xl bg-bg-elevated p-4 flex flex-col gap-y-5">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-x-4 text-sm font-bold transition duration-300 group ${
                isActive ? 'text-text-main' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <item.icon 
                size={26} 
                className={`transition-colors ${isActive ? 'text-primary' : 'group-hover:text-text-main'}`} 
              />
              <span className="mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex-1 rounded-xl bg-bg-elevated p-4 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center gap-x-3 text-text-muted hover:text-text-main transition font-bold text-sm">
            <Library size={26} />
            <span>Ваша медіатека</span>
          </button>
          <button className="text-text-muted hover:text-text-main hover:bg-bg-elevated-soft p-1.5 rounded-full transition">
            <Plus size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 custom-scrollbar">
          {isAuth && (
            <div 
              onClick={() => navigate('/favorite-songs')}
              className={`flex items-center gap-x-3 p-2 rounded-lg hover:bg-bg-elevated-soft cursor-pointer transition group ${
                pathname === '/favorite-songs' ? 'bg-bg-elevated-soft' : ''
              }`}
            >
              <div className="w-12 h-12 rounded bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center shadow-lg text-white shrink-0">
                <Heart size={20} fill="white" />
              </div>
              <div className="flex flex-col truncate">
                <p className="text-sm font-semibold text-text-main">Улюблені пісні</p>
                <p className="text-xs text-text-muted">Плейлист</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;