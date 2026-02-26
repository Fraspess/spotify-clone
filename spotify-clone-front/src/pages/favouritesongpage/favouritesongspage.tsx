import { useNavigate } from 'react-router-dom';
import { useGetMeQuery, useFavoriteSongMutation } from '../../services/Api/api';
import { Play, Music, ArrowLeft, Heart } from 'lucide-react';
import { useDispatch } from "react-redux";
import { playSong, setSongs } from "../../services/Api/songSlice.tsx";
import { APP_ENV } from '../../env/index.ts';

const FavoriteSongsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { data: userData, isLoading } = useGetMeQuery();
  const [favoriteMutation, { isLoading: isMutating }] = useFavoriteSongMutation();

  const favoriteSongs = userData?.favoriteSongs || [];
  const IMAGE_BASE_URL = APP_ENV.IMAGE_BASE_URL;

  const playMusic = (music: any) => {
    dispatch(playSong({
      id: String(music.id),
      title: music.title,
      artist: music.artist,
      image: music.image,
      songFileName: music.songFileName,
    }));
  };

  const handlePlayAll = () => {
    if (favoriteSongs.length > 0) {
      const formattedSongs = favoriteSongs.map((s: any) => ({
        ...s,
        id: String(s.id)
      }));
      dispatch(setSongs(formattedSongs));
      dispatch(playSong(formattedSongs[0]));
    }
  };

const toggleFavorite = async (e: React.MouseEvent, id: any) => {
    e.stopPropagation();
    try {
        await favoriteMutation({ id: Number(id) }).unwrap();
        
    } catch (err) {
        console.error("Mutation failed:", err);
    }
};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24">
      <div className="flex flex-col md:flex-row items-end gap-6 mb-8 bg-gradient-to-b from-primary/20 to-transparent p-6 rounded-3xl border border-white/5">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-xl bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center shadow-2xl flex-shrink-0">
          <Heart size={100} fill="white" className="text-white" />
        </div>
        
        <div className="flex flex-col gap-y-2">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-white transition-colors uppercase tracking-widest mb-2"
          >
            <ArrowLeft size={16} /> Назад
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Плейлист</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
            Улюблені пісні
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm font-bold text-text-main">
            <span className="text-primary">{userData?.username}</span>
            <span className="text-text-muted">• {favoriteSongs.length} треків</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <button 
          onClick={handlePlayAll}
          disabled={favoriteSongs.length === 0}
          className="bg-primary p-4 rounded-full shadow-lg transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          <Play fill="black" size={28} className="text-black ml-1" />
        </button>
        <h2 className="text-2xl font-extrabold tracking-tight">Ваша колекція</h2>
      </div>

      <section>
        {favoriteSongs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-3">
            {favoriteSongs.map((song: any) => (
              <div 
                key={song.id} 
                onClick={() => playMusic(song)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 group cursor-pointer transition-all border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <div className="w-full h-full bg-zinc-800 rounded shadow-md flex items-center justify-center overflow-hidden">
                      {song.image ? (
                        <img 
                          src={song.image.startsWith('http') ? song.image : `${IMAGE_BASE_URL}/medium/${song.image}${song.image.includes('.') ? '' : '.webp'}`} 
                          alt={song.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Music size={20} className="text-zinc-600" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                      <Play size={16} fill="white" className="text-white" />
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
                  <button 
                    onClick={(e) => toggleFavorite(e, song.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                    disabled={isMutating}
                  >
                    <Heart size={18} fill="#ff1a1a" className="text-[#ff1a1a]" />
                  </button>
                  <span className="text-right text-xs text-text-muted font-mono w-10">
                     {song.durationInSeconds ? `${Math.floor(song.durationInSeconds / 60)}:${String(song.durationInSeconds % 60).padStart(2, '0')}` : '3:45'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Heart size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Тут поки порожньо</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default FavoriteSongsPage;