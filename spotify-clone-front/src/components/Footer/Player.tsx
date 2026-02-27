import {Play, SkipBack, SkipForward, Volume2, Pause} from 'lucide-react';
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../services/Api/store.tsx";
import {
  playNextSong,
  playPreviousSong,
  setCurrentTime,
  setDuration,
  setVolume,
  togglePlay
} from "../../services/Api/songSlice.tsx";
import {audio} from "../../services/audio/audio.ts";
import {useEffect} from "react";
import {APP_ENV} from "../../env";
import {useFavoriteSongMutation} from "../../services/Api/api.tsx";

const Player = () => {
  const dispatch = useDispatch();
  const {currentSong, isPlaying, currentTime, duration, volume} =
      useSelector((state: RootState) => state.song);
  const [favoriteSong] = useFavoriteSongMutation();

  const formatTime = (time: number) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const progress = duration
      ? (currentTime / duration) * 100
      : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    audio.currentTime = percent * duration;
  };


  const handleVolume = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    audio.volume = percent;
    dispatch(setVolume(percent * 100));
  };

  useEffect(() => {
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (currentSong) {
      audio.src = APP_ENV.BACKEND_URL + `/music/${currentSong.songFileName}` || "";
      audio.currentTime = 0;
      audio.play();
    }
  }, [currentSong]);



  useEffect(() => {
    const handleLoadedMetadata = () => {
      dispatch(setDuration(audio.duration));
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      dispatch(setCurrentTime(audio.currentTime));
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleEnded = () => {
      dispatch(playNextSong());
    }

    audio.addEventListener("ended", handleEnded);


    return () => {
      audio.removeEventListener("ended", handleEnded);
    }
  },[dispatch]);


  return (
    <footer className="h-[90px] bg-black border-t border-border-subtle px-4 flex items-center justify-between">
      
      <div className="flex items-center gap-x-4 w-[30%] min-w-[180px]">
        <div className="w-14 h-14 bg-bg-elevated rounded-md shadow-lg flex-shrink-0 border border-border-subtle overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary-dark to-bg-elevated flex items-center justify-center text-xs text-text-muted">
            <img className={"w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"} src={APP_ENV.BACKEND_URL + `/music_images/medium/` + currentSong?.image} alt="IMG"/>
          </div>
        </div>
        <div className="flex flex-col truncate">
          <p className="text-sm text-text-main font-semibold hover:underline cursor-pointer truncate">
            {currentSong?.title || "Пісня не обрана"}
          </p>
          <p className="text-xs text-text-muted hover:underline cursor-pointer truncate">
            {currentSong?.artist || "Пісня не обрана"}
          </p>
        </div>
        <button
            onClick={() =>
                currentSong?.id && favoriteSong(currentSong.id )
            }
            className="text-text-muted hover:text-primary transition ml-2"
        >
          ❤️
        </button>
      </div>

      <div className="flex flex-col items-center max-w-[45%] w-full gap-y-2">
        <div className="flex items-center gap-x-6 text-text-muted">
          {/*<button className="hover:text-text-main transition"><Shuffle size={20} /></button>*/}
          <button onClick={() => dispatch(playPreviousSong())} className="hover:text-text-main transition"><SkipBack size={24} fill="currentColor" /></button>
          <button onClick={() => dispatch(togglePlay())} className="bg-text-main text-black rounded-full p-2 hover:scale-105 transition active:scale-95">
            {isPlaying ? (
                <Pause size={24} fill="black"/>
            ) : (
                 <Play size={24} fill="black" />
            )}
          </button>
          <button onClick={() => dispatch(playNextSong())} className="hover:text-text-main transition"><SkipForward size={24} fill="currentColor" /></button>
          {/*<button className="hover:text-text-main transition"><Repeat size={20} /></button>*/}
        </div>
        
        <div className="flex items-center gap-x-2 w-full max-w-md group">
          <span className="text-[11px] text-text-muted min-w-[30px] text-right">{formatTime(currentTime)}</span>
          <div onClick={handleSeek} className="flex-1 h-1 bg-border-subtle rounded-full relative cursor-pointer">
            <div
                className="absolute top-0 left-0 h-full bg-text-main rounded-full group-hover:bg-primary transition-colors"
                style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] text-text-muted min-w-[30px]">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-end gap-x-3 w-[30%] text-text-muted">
        <div className="flex items-center gap-x-2 w-32 group">
          <Volume2 size={20} />
          <div onClick={handleVolume} className="flex-1 h-1 bg-border-subtle rounded-full relative cursor-pointer">
            <div className="absolute top-0 left-0 h-full bg-text-main rounded-full group-hover:bg-primary w-[70%]" style={{width : `${volume}%`}} />
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Player;