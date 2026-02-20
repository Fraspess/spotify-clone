import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { albums, tracks } from '../data/library'

const useQuery = () => {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

const SearchPage = () => {
  const query = useQuery()
  const q = (query.get('q') || '').trim().toLowerCase()

  const filteredTracks = useMemo(() => {
    if (!q) return []
    return tracks.filter((t) => {
      const haystack = `${t.title} ${t.artist} ${t.album}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [q])

  const filteredAlbums = useMemo(() => {
    if (!q) return []
    return albums.filter((a) => {
      const haystack = `${a.title} ${a.artist} ${a.year}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [q])

  const hasQuery = q.length > 0

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {hasQuery ? `Результати пошуку для "${q}"` : 'Огляд усіх розділів'}
        </h1>
        {!hasQuery && (
          <span className="text-sm text-text-muted hidden sm:inline">
            Введіть назву треку, альбому або виконавця у полі пошуку зверху
          </span>
        )}
      </div>

      {!hasQuery && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {['Поп', 'Рок', 'Хіп-хоп', 'Джаз', 'Електроніка'].map((genre, i) => (
            <div
              key={genre}
              className="aspect-square rounded-lg p-4 font-bold text-xl cursor-pointer hover:scale-105 transition-transform text-white shadow-lg"
              style={{ backgroundColor: `hsl(${i * 60}, 70%, 45%)` }}
            >
              {genre}
            </div>
          ))}
        </div>
      )}

      {hasQuery && (
        <>
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Треки</h2>
            {filteredTracks.length === 0 ? (
              <p className="text-sm text-text-muted">Треки не знайдено.</p>
            ) : (
              <div className="space-y-2">
                {filteredTracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg bg-bg-elevated-soft/70 hover:bg-bg-elevated-soft cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-md bg-gradient-to-br ${track.coverColor} flex items-center justify-center text-xs font-bold text-white shadow-md`}
                      >
                        ♫
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-text-main">
                          {track.title}
                        </span>
                        <span className="text-xs text-text-muted">
                          {track.artist} • {track.album}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-text-muted">{track.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">Альбоми</h2>
            {filteredAlbums.length === 0 ? (
              <p className="text-sm text-text-muted">Альбоми не знайдено.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAlbums.map((album) => (
                  <div
                    key={album.id}
                    className="bg-bg-elevated/60 hover:bg-bg-elevated p-4 rounded-xl transition duration-200 cursor-pointer border border-transparent hover:border-border-subtle"
                  >
                    <div
                      className={`relative aspect-square mb-3 rounded-lg bg-gradient-to-br ${album.coverColor} flex items-center justify-center text-3xl text-white shadow-lg`}
                    >
                      💿
                    </div>
                    <p className="font-semibold text-sm text-text-main truncate">
                      {album.title}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {album.artist} • {album.year}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default SearchPage