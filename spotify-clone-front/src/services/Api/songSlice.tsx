import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {Song} from "../../types/song/Song.ts";
import type {MusicState} from "../../types/music/MusicState.ts";

const initialState: MusicState = {
    currentSong: null,
    isPlaying: false,
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
        }
    }
})


export const {playSong, togglePlay, stopSong} = songSlice.actions;
export default songSlice.reducer;