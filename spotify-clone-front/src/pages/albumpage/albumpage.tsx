import { useParams, useNavigate } from 'react-router-dom';
import { useGetAlbumByIdQuery } from '../../services/Api/api';
import { Play, ArrowLeft, Disc, Clock } from 'lucide-react';
import { useDispatch } from "react-redux";
import { playSong, setSongs } from "../../services/Api/songSlice.tsx";
import { APP_ENV } from '../../env/index.ts';

const AlbumPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const IMAGE_BASE_URL = APP_ENV.IMAGE_BASE_URL;
    const { data: album, isLoading, error } = useGetAlbumByIdQuery(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="p-8 text-white flex flex-col items-center gap-4">
        <p className="text-xl font-bold">Альбом не знайдено</p>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft size={20} /> Повернутися назад
        </button>
      </div>
    );
  }

  const albumImg = album.songs?.[0]?.image || album.image;

  const handlePlayAlbum = () => {
    if (album.songs && album.songs.length > 0) {
      dispatch(setSongs(album.songs));
      playMusic(album.songs[0]);
    }
  };

  const playMusic = (song: any) => {
    dispatch(playSong({
      id: song.id,
      title: song.title,
      artist: song.artist || album.artist,
      image: song.image,
      songFileName: song.songFileName,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-800/50 to-bg-main p-6 pb-32">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 p-2 hover:bg-white/10 rounded-full transition-all text-white"
      >
        <ArrowLeft size={28} />
      </button>

      <div className="flex flex-col md:flex-row items-end gap-8 mb-10">
        <div className="w-64 h-64 shadow-[0_8px_40px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
          {albumImg ? (
            <img 
              src={albumImg.startsWith('http') ? albumImg : `${IMAGE_BASE_URL}/large/${albumImg}${albumImg.includes('.') ? '' : '.webp'}`} 
              alt={album.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`fallback-icon w-full h-full flex items-center justify-center ${albumImg ? 'hidden' : ''}`}>
             <Disc size={120} className="text-zinc-700" />
          </div>
        </div>
        
        <div className="flex flex-col gap-2 text-white">
          <span className="text-xs font-bold uppercase tracking-wider">Альбом</span>
          <h1 className="text-5xl md:text-7xl font-black mb-4">{album.title || "Без назви"}</h1>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="text-primary hover:underline cursor-pointer">{album.artist || "Невідомий виконавець"}</span>
            <span className="text-zinc-400">• {album.releaseDate ? album.releaseDate.split('-')[0] : '2024'} •</span>
            <span className="text-zinc-400">{album.songs?.length || 0} треків</span>
          </div>
        </div>
      </div>

      <div className="mb-8 flex items-center gap-6">
        <button 
          onClick={handlePlayAlbum}
          className="bg-primary hover:scale-105 transition-transform p-4 rounded-full shadow-lg active:scale-95"
        >
          <Play fill="black" size={32} className="text-black ml-1" />
        </button>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-[16px_1fr_auto] gap-4 px-4 py-2 text-zinc-400 border-b border-white/10 text-xs uppercase tracking-widest mb-4">
          <span>#</span>
          <span>Назва</span>
          <Clock size={16} className="mr-4" />
        </div>

        {album.songs?.map((song: any, index: number) => (
          <div 
            key={song.id}
            onClick={() => playMusic(song)}
            className="grid grid-cols-[16px_1fr_auto] gap-4 px-4 py-3 rounded-md hover:bg-white/10 group cursor-pointer transition-colors items-center"
          >
            <div className="flex items-center justify-center w-4">
              <span className="text-zinc-400 group-hover:hidden">{index + 1}</span>
              <Play size={14} className="hidden group-hover:block text-white" fill="white" />
            </div>
            
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-white truncate group-hover:text-primary transition-colors">
                {song.title}
              </span>
              <span className="text-xs text-zinc-400 truncate">
                {song.artist || album.artist}
              </span>
            </div>

            <span className="text-zinc-400 text-sm font-mono mr-4">
              {song.durationInSeconds ? 
                `${Math.floor(song.durationInSeconds / 60)}:${String(song.durationInSeconds % 60).padStart(2, '0')}` 
                : '--:--'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumPage;