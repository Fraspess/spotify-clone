import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {Song} from "../../types/song/Song.ts";
import type {MusicState} from "../../types/music/MusicState.ts";

const initialState: MusicState = {
    currentSong: null,
    isPlaying: false,
    volume: 100,
    currentTime: 0,
    duration: 0,
    currentIndex: 0,
    songs: []
};
const songSlice = createSlice({
    name:"song",
    initialState,
    reducers:{
        playSong:(state, action: PayloadAction<Song>) => {
            const index = state.songs.findIndex(
                song => song.id === action.payload.id
            );

            state.currentIndex = index !== -1 ? index : 0;
            state.currentSong = action.payload;
            state.isPlaying = true;
        },
        togglePlay: (state) => {
            state.isPlaying = !state.isPlaying;
        },
        stopSong: (state) => {
            state.currentSong = null;
            state.isPlaying = false;
        },
        setCurrentTime: (state, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
        },
        setDuration: (state, action: PayloadAction<number>) => {
            state.duration = action.payload;
        },
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = action.payload;
        },
        playNextSong: (state) => {
            if(state.songs.length == 0) return;

            const nextIndex = state.currentIndex < state.songs.length - 1 ? state.currentIndex + 1 : 0;

            state.currentIndex = nextIndex;
            state.currentSong = state.songs[nextIndex];
            state.isPlaying = true;
        },
        playPreviousSong: (state) => {
            if (state.songs.length === 0) return;

            const prevIndex =
                state.currentIndex > 0
                    ? state.currentIndex - 1
                    : state.songs.length - 1;

            state.currentIndex = prevIndex;
            state.currentSong = state.songs[prevIndex];
            state.isPlaying = true;
        },
        setSongs: (state, action: PayloadAction<Song[]>) => {
            state.songs = action.payload;
        }

    }
})

export const {playSong, togglePlay, stopSong, setVolume, setCurrentTime, setDuration, playPreviousSong, playNextSong, setSongs} = songSlice.actions;
export default songSlice.reducer;