import { useGetAlbumsQuery } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Disc, Play, ArrowLeft } from 'lucide-react';

const AllAlbumsPage = () => {
  const navigate = useNavigate();
  const { data: albums = [], isLoading } = useGetAlbumsQuery({ page: 0, size: 50 });

  if (isLoading) return <div className="p-8 text-primary animate-pulse">Завантаження медіатеки...</div>;

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold">Всі альбоми</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {albums.map((album: any) => (
          <div 
            key={album.id} 
            onClick={() => navigate(`/album/${album.id}`)}
            className="bg-bg-elevated/40 p-4 rounded-xl hover:bg-bg-elevated transition-all group cursor-pointer border border-transparent hover:border-white/5 shadow-md"
          >
            <div className="aspect-square mb-4 relative rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
              <Disc size={60} className="text-zinc-700" />
              <div className="absolute bottom-2 right-2 bg-primary p-3 rounded-full shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                <Play fill="black" size={20} className="text-black ml-0.5" />
              </div>
            </div>
            <h3 className="font-bold text-sm truncate">{album.title}</h3>
            <p className="text-xs text-text-muted mt-1 truncate">{album.artist || 'Виконавець'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAlbumsPage;