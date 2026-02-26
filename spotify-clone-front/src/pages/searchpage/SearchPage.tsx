import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearchSongsQuery, useGetSongsQuery, useGetAlbumsQuery } from '../../services/Api/api';
import { Play, Music, Disc, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { playSong, setSongs } from '../../services/Api/songSlice';
import { APP_ENV } from '../../env/index.ts';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const query = searchParams.get('q') || "";
  const IMAGE_BASE_URL = APP_ENV.IMAGE_BASE_URL;

  const { data: albumsData } = useGetAlbumsQuery({ page: 0, size: 6 }) as any;
  const { data: songsData } = useGetSongsQuery({ page: 0, size: 20 }) as any;

  const albums = albumsData?.content || (Array.isArray(albumsData) ? albumsData : []);
  const popularSongs = songsData?.content || (Array.isArray(songsData) ? songsData : []);

  const { data: searchData, isFetching } = useSearchSongsQuery(query, {
    skip: query.trim().length === 0,
  }) as any;

  const foundSongs = searchData?.data || searchData?.content || (Array.isArray(searchData) ? searchData : []);

  const handlePlayMusic = (song: any, queue: any[]) => {
    dispatch(setSongs(queue));
    dispatch(playSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      image: song.image,
      songFileName: song.songFileName,
    }));
  };

  const getFullImgUrl = (img: string, size: 'medium' | 'large') => {
    if (!img) return "";
    if (img.startsWith('http')) return img;
    return `${IMAGE_BASE_URL}/${size}/${img}${img.includes('.') ? '' : '.webp'}`;
  };

  const isSearching = query.trim().length > 0;

  return (
    <div className="space-y-12 p-6 pb-24">
      {isSearching ? (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight">Результати для "{query}"</h2>
            <div className="h-[1px] flex-1 mx-6 bg-white/5 hidden md:block"></div>
          </div>

          {isFetching ? (
            <div className="flex items-center justify-center h-[30vh]">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
            </div>
          ) : foundSongs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-3">
              {foundSongs.map((song: any) => (
                <div key={song.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 group cursor-pointer transition-all border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-12 h-12 flex-shrink-0 bg-zinc-800 rounded shadow-md overflow-hidden flex items-center justify-center">
                      {song.image ? (
                        <img 
                          src={getFullImgUrl(song.image, 'medium')} 
                          className="w-full h-full object-cover" 
                          alt="" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`fallback-icon ${song.image ? 'hidden' : ''}`}>
                        <Music size={20} className="text-zinc-600" />
                      </div>
                      <div onClick={() => handlePlayMusic(song, foundSongs)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={16} fill="white" className="text-white" />
                      </div>
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-sm text-text-main truncate group-hover:text-primary transition-colors">{song.title}</div>
                      <div className="text-xs text-text-muted truncate mt-0.5">{song.artist || 'Невідомий виконавець'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 ml-4">
                    <Plus size={18} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-primary transition-all" />
                    <span className="text-xs text-text-muted font-mono w-10">
                      {song.durationInSeconds ? `${Math.floor(song.durationInSeconds / 60)}:${String(song.durationInSeconds % 60).padStart(2, '0')}` : '3:45'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-20 text-text-muted">Нічого не знайдено.</p>
          )}
        </section>
      ) : (
        <>
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight">Популярні альбоми</h2>
              <button onClick={() => navigate('/all-albums')} className="text-xs font-bold text-text-muted hover:text-white transition-colors uppercase tracking-widest">
                Показати всі
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {albums.map((album: any) => {
                const albumImg = album.image || (album.songs && album.songs[0]?.image);
                return (
                  <div key={album.id} onClick={() => navigate(`/album/${album.id}`)} className="bg-bg-elevated-soft/30 p-4 rounded-xl hover:bg-bg-elevated transition-all group cursor-pointer border border-white/5">
                    <div className="aspect-square mb-4 relative rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center">
                      {albumImg ? (
                        <img 
                          src={getFullImgUrl(albumImg, 'large')} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          alt="" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.querySelector('.fallback-disc')?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`fallback-disc ${albumImg ? 'hidden' : ''}`}>
                        <Disc size={64} className="text-zinc-700" />
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-primary p-4 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          <Play fill="black" size={24} className="text-black ml-1" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-sm truncate">{album.title}</h3>
                    <p className="text-xs text-text-muted truncate mt-1">{album.artist || "Невідомий"}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold tracking-tight mb-8">Рекомендовані треки</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-3">
              {popularSongs.map((song: any) => (
                <div key={song.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 group cursor-pointer border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-12 h-12 flex-shrink-0 bg-zinc-800 rounded overflow-hidden flex items-center justify-center">
                      <img 
                        src={getFullImgUrl(song.image, 'medium')} 
                        className="w-full h-full object-cover" 
                        alt="" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.querySelector('.fallback-song')?.classList.remove('hidden');
                        }}
                      />
                      <div className="fallback-song hidden"><Music size={20} className="text-zinc-600" /></div>
                      <div onClick={() => handlePlayMusic(song, popularSongs)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={16} fill="white" className="text-white" />
                      </div>
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{song.title}</div>
                      <div className="text-xs text-text-muted truncate">{song.artist}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 ml-4">
                    <Plus size={18} className="opacity-0 group-hover:opacity-100 text-text-muted" />
                    <span className="text-xs text-text-muted font-mono">{song.durationInSeconds ? `${Math.floor(song.durationInSeconds/60)}:${String(song.durationInSeconds%60).padStart(2,'0')}` : '3:45'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default SearchPage;