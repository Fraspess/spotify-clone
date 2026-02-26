import { useEffect } from 'react'
import { useFavorites } from '../context/FavoritesContext'
import { useAppDispatch } from '../store/hooks'
import { setTrack, play } from '../features/player/playerSlice'

const Home = () => {
  const { favorites, toggleFavorite } = useFavorites()
  const dispatch = useAppDispatch()

  const playlists = [
    { id: 1, title: 'Top Hits 2024', desc: 'Найкращі треки року', color: 'bg-primary' },
    { id: 2, title: 'Relax Focus', desc: 'Музика для навчання', color: 'bg-blue-600' },
    { id: 3, title: 'Workout Energy', desc: 'Твій заряд бадьорості', color: 'bg-green-600' },
    { id: 4, title: 'Lofi Girl', desc: 'Beats to relax/study to', color: 'bg-purple-600' },
    { id: 5, title: 'Rock Classics', desc: 'Легенди року', color: 'bg-orange-600' },
    { id: 6, title: 'Jazz Night', desc: 'Вечірня атмосфера', color: 'bg-yellow-600' },
  ]

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // ПОКИ ЩО це просто заготовка
        // const response = await fetch('http://localhost:8080/api/songs')
        // const data = await response.json()
        // console.log(data)
      } catch (error) {
        console.error('Error fetching songs:', error)
      }
    }

    fetchSongs()
  }, [])

  const handlePlay = (item: any) => {
    dispatch(
      setTrack({
        id: item.id.toString(),
        title: item.title,
        artist: 'Unknown Artist',
        url: '/music/test.mp3', // поки що заглушка
      })
    )

    dispatch(play())
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((item) => {
            const isFavorite = favorites.includes(item.id)

            return (
              <div
                key={item.id}
                className="relative flex items-center bg-bg-elevated-soft/40 hover:bg-bg-elevated-soft transition-colors rounded-md overflow-hidden cursor-pointer group"
              >
                <div
                  className={`w-20 h-20 shadow-lg ${item.color} flex-shrink-0 flex items-center justify-center text-2xl`}
                >
                  🎵
                </div>

                <div className="flex flex-1 items-center justify-between px-4">
                  <span className="font-bold truncate">
                    {item.title}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(item.id)
                      }}
                      className="text-lg"
                    >
                      {isFavorite ? '❤️' : '🤍'}
                    </button>

                    <button
                      onClick={() => handlePlay(item)}
                      className="w-12 h-12 bg-primary rounded-full items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity flex"
                    >
                      <span className="text-black text-xl ml-1">▶</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Home