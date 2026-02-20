export type Track = {
  id: number
  title: string
  artist: string
  album: string
  duration: string
  coverColor: string
}

export type Album = {
  id: number
  title: string
  artist: string
  year: number
  coverColor: string
}

export const tracks: Track[] = [
  {
    id: 1,
    title: 'Night Drive',
    artist: 'AudioLab',
    album: 'Midnight Sessions',
    duration: '3:42',
    coverColor: 'from-primary to-primary-soft'
  },
  {
    id: 2,
    title: 'City Lights',
    artist: 'Neon Pulse',
    album: 'Urban Stories',
    duration: '4:10',
    coverColor: 'from-purple-600 to-pink-600'
  },
  {
    id: 3,
    title: 'Rainy Lofi',
    artist: 'LoFi Girl',
    album: 'Study Beats',
    duration: '2:58',
    coverColor: 'from-sky-500 to-indigo-500'
  },
  {
    id: 4,
    title: 'Morning Coffee',
    artist: 'Soft Jazz Trio',
    album: 'Jazz Morning',
    duration: '5:12',
    coverColor: 'from-amber-500 to-orange-600'
  },
  {
    id: 5,
    title: 'Gym Anthem',
    artist: 'Beat Machine',
    album: 'Workout Energy',
    duration: '3:25',
    coverColor: 'from-emerald-500 to-lime-500'
  },
  {
    id: 6,
    title: 'Dreamscape',
    artist: 'Synth Wave',
    album: 'Retrowave Dreams',
    duration: '4:47',
    coverColor: 'from-cyan-500 to-blue-700'
  }
]

export const albums: Album[] = [
  {
    id: 1,
    title: 'Midnight Sessions',
    artist: 'AudioLab',
    year: 2025,
    coverColor: 'from-primary-dark to-primary-soft'
  },
  {
    id: 2,
    title: 'Urban Stories',
    artist: 'Neon Pulse',
    year: 2024,
    coverColor: 'from-fuchsia-600 to-rose-600'
  },
  {
    id: 3,
    title: 'Study Beats',
    artist: 'LoFi Girl',
    year: 2023,
    coverColor: 'from-sky-500 to-teal-500'
  },
  {
    id: 4,
    title: 'Jazz Morning',
    artist: 'Soft Jazz Trio',
    year: 2022,
    coverColor: 'from-amber-500 to-yellow-500'
  },
  {
    id: 5,
    title: 'Workout Energy',
    artist: 'Beat Machine',
    year: 2024,
    coverColor: 'from-emerald-500 to-green-700'
  }
]


