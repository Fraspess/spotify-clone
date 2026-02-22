const SearchPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Огляд усіх розділів</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {['Поп', 'Рок', 'Хіп-хоп', 'Джаз', 'Електроніка'].map((genre, i) => (
          <div 
            key={i} 
            className="aspect-square rounded-lg p-4 font-bold text-xl cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: `hsl(${i * 60}, 70%, 40%)` }}
          >
            {genre}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;