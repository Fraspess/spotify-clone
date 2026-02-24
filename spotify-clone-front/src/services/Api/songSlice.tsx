import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {Song} from "../../types/song/Song.ts";
import type {MusicState} from "../../types/music/MusicState.ts";

const initialState: MusicState = {
    currentSong: null,
    isPlaying: false,
    volume: 100,
    currentTime: 0,
    duration: 0,
};
const songSlice = createSlice({
    name:"song",
    initialState,
    reducers:{
        playSong:(state, action: PayloadAction<Song>) => {
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
        }
    }
})

export const {playSong, togglePlay, stopSong, setVolume, setCurrentTime, setDuration} = songSlice.actions;
export default songSlice.reducer;