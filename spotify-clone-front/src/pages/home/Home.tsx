import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetSongsQuery, useGetAlbumsQuery } from '../../services/Api/api';
import { Play, Disc, Music, Plus } from 'lucide-react';
import {useDispatch} from "react-redux";
import {playSong, setSongs} from "../../services/Api/songSlice.tsx";

const Home = () => {
  const navigate = useNavigate();
  const [songLimit, setSongLimit] = useState(20);
  const dispatch = useDispatch();

  const { data: albumsData, isLoading: albumsLoading } = useGetAlbumsQuery({ page: 0, size: 6 }) as any;
  const { data: songsData, isLoading: songsLoading, isFetching } = useGetSongsQuery({ 
    page: 0, 
    size: songLimit 
  }) as any;

  const albums = albumsData?.content || (Array.isArray(albumsData) ? albumsData : []);
  const songs = songsData?.content || (Array.isArray(songsData) ? songsData : []);

  const handleLoadMore = () => {
    setSongLimit(prev => prev + 20);
  };

  useEffect(() => {
    if(songs.length > 0){
      dispatch(setSongs(songs));
    }
  }, [songs, dispatch]);

  const IMAGE_BASE_URL = "http://localhost:8080/music_images";

  if (albumsLoading && songsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  const playMusic = (music) => {
    console.log(music);
      dispatch(playSong({
        id: music.id,
        title: music.title,
        artist: music.artist,
        image: music.image,
        songFileName: music.songFileName,
      }))
  }

  return (
    <div className="space-y-12 p-6 pb-24">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Популярні альбоми</h2>
          <button 
            onClick={() => navigate('/all-albums')}
            className="text-xs font-bold text-text-muted hover:text-white transition-colors uppercase tracking-widest border-b border-transparent hover:border-text-muted"
          >
            Показати всі
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
                        console.log("Помилка завантаження картинки за адресою:", e.currentTarget.src);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.querySelector('.fallback-disc')?.classList.remove('hidden');
                      }}
                    />
                  ) : null}

                  <div className={`fallback-disc ${albumImg ? 'hidden' : ''}`}>
                    <Disc size={64} className="text-zinc-700 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-primary p-4 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Play fill="black" size={24} className="text-black ml-1" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-sm truncate text-text-main">
                  {album.title}
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
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Рекомендовані треки</h2>
          <div className="h-[1px] flex-1 mx-6 bg-white/5 hidden md:block"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-3">
          {songs.map((song: any) => (
            <div 
              key={song.id} 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 group cursor-pointer transition-all border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <div className="w-full h-full bg-zinc-800 rounded shadow-md flex items-center justify-center overflow-hidden">
                    {song.image ? (
                      <img 
                        src={
                          song.image.startsWith('http')
                          ? song.image
                          : `${IMAGE_BASE_URL}/medium/${song.image}${song.image.includes('.') ? '' : '.webp'}`
                        } 
                        alt={song.title} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    
                    <div className={`fallback ${song.image ? 'hidden' : ''}`}>
                      <Music size={20} className="text-zinc-600" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                    <Play onClick={event => {event.preventDefault(); playMusic(song)}} size={16} fill="white" className="text-white" />
                  </div>
                </div>

                <div className="truncate">
                  <div className="font-semibold text-sm text-text-main truncate group-hover:text-primary transition-colors">
                    {song.title}
                  </div>
                  <div className="text-xs text-text-muted truncate mt-0.5">
                    {song.artist || 'Невідомий виконавець'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 ml-4">
                <button className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-primary transition-all">
                  <Plus size={18} />
                </button>
                <span className="text-right text-xs text-text-muted font-mono w-10">
                   {song.durationInSeconds ? 
                    `${Math.floor(song.durationInSeconds / 60)}:${String(song.durationInSeconds % 60).padStart(2, '0')}` 
                    : '3:45'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <button 
            onClick={handleLoadMore}
            disabled={isFetching}
            className="group relative px-12 py-4 rounded-full bg-white text-black font-bold text-sm overflow-hidden hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="relative z-10">{isFetching ? 'Завантаження...' : 'Показати ще'}</span>
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;