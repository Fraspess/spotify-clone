const Home = () => {
  const playlists = [
    { id: 1, title: 'Top Hits 2024', desc: 'Найкращі треки року', color: 'bg-primary' },
    { id: 2, title: 'Relax Focus', desc: 'Музика для навчання', color: 'bg-blue-600' },
    { id: 3, title: 'Workout Energy', desc: 'Твій заряд бадьорості', color: 'bg-green-600' },
    { id: 4, title: 'Lofi Girl', desc: 'Beats to relax/study to', color: 'bg-purple-600' },
    { id: 5, title: 'Rock Classics', desc: 'Легенди року', color: 'bg-orange-600' },
    { id: 6, title: 'Jazz Night', desc: 'Вечірня атмосфера', color: 'bg-yellow-600' },
  ];

  return (
    <div className="space-y-8">
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.slice(0, 6).map((item) => (
            <div 
              key={item.id} 
              className="flex items-center bg-bg-elevated-soft/40 hover:bg-bg-elevated-soft transition-colors rounded-md overflow-hidden cursor-pointer group"
            >
              <div className={`w-20 h-20 shadow-lg ${item.color} flex-shrink-0 flex items-center justify-center text-2xl`}>
                🎵
              </div>
              <div className="flex flex-1 items-center justify-between px-4">
                <span className="font-bold truncate">{item.title}</span>
                <button className="w-12 h-12 bg-primary rounded-full items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity flex">
                  <span className="text-black text-xl ml-1">▶</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold hover:underline cursor-pointer">Зроблено для вас</h2>
          <span className="text-sm font-bold text-text-muted hover:underline cursor-pointer uppercase tracking-tighter">Показати все</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playlists.map((item) => (
            <div 
              key={item.id} 
              className="bg-bg-elevated/40 hover:bg-bg-elevated p-4 rounded-xl transition duration-300 group cursor-pointer border border-transparent hover:border-border-subtle"
            >
              <div className="relative aspect-square mb-4 shadow-2xl">
                <div className={`w-full h-full rounded-lg ${item.color} flex items-center justify-center text-4xl`}>
                  💿
                </div>
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full items-center justify-center shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex">
                   <span className="text-black text-xl ml-1">▶</span>
                </button>
              </div>
              <p className="font-bold text-text-main truncate mb-1">{item.title}</p>
              <p className="text-sm text-text-muted line-clamp-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;