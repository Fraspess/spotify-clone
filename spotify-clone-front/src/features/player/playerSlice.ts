import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Track {
  id: string
  title: string
  artist: string
  url: string
  cover?: string
}

interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload
    },
    play: (state) => {
      state.isPlaying = true
    },
    pause: (state) => {
      state.isPlaying = false
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying
    },
  },
})

export const { setTrack, play, pause, togglePlay } = playerSlice.actions
export default playerSlice.reducer