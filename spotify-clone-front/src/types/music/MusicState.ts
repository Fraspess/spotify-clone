import type {Song} from "../song/Song.ts";

export interface MusicState{
    currentSong: Song | null;
    isPlaying: boolean;
}
