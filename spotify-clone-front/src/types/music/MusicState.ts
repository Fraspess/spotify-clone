import type {Song} from "../song/Song.ts";

export interface MusicState{
    songs: Song[];
    currentIndex: number;
    currentSong: Song | null;
    isPlaying: boolean;
    volume: number,
    currentTime: number,
    duration: number,
}
