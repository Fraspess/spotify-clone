import { useGetAlbumsQuery } from '../../services/Api/api';
import { useNavigate } from 'react-router-dom';
import { Disc, Play, ArrowLeft } from 'lucide-react';

const AllAlbumsPage = () => {
  const navigate = useNavigate();
  
  const { data: albumsData, isLoading } = useGetAlbumsQuery({ page: 0, size: 50 }) as any;
  const albums = albumsData?.content || (Array.isArray(albumsData) ? albumsData : []);

  const IMAGE_BASE_URL = "http://localhost:8080/music_images";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight">Всі альбоми</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {albums.map((album: any) => {
          const albumImg = album.image || album.coverUrl || (album.songs && album.songs[0]?.image);
          
          return (
            <div 
              key={album.id} 
              onClick={() => navigate(`/album/${album.id}`)}
              className="bg-bg-elevated-soft/30 p-4 rounded-xl hover:bg-bg-elevated transition-all duration-300 group cursor-pointer border border-white/5 shadow-lg"
            >
              <div className="aspect-square mb-4 relative rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center">
                {albumImg ? (
                  <img 
                    src={
                      albumImg.startsWith('http') 
                        ? albumImg 
                        : `${IMAGE_BASE_URL}/large/${albumImg}${albumImg.includes('.') ? '' : '.webp'}`
                    } 
                    alt={album.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.querySelector('.fallback-disc')?.classList.remove('hidden');
                    }}
                  />
                ) : null}

                <div className={`fallback-disc ${albumImg ? 'hidden' : ''}`}>
                  <Disc size={64} className="text-zinc-700 group-hover:text-primary transition-colors duration-300" />
                </div>
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-primary p-4 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <Play fill="black" size={24} className="text-black ml-1" />
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-sm truncate text-text-main">
                {album.title || "Без назви"}
              </h3>
              <p className="text-xs text-text-muted truncate mt-1">
                {album.artist || "Невідомий виконавець"}
              </p>
              <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-tighter font-medium">
                Треків: {album.songs?.length || 0}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllAlbumsPage;