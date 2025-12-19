
import React, { useState, useEffect } from 'react';
import { MOCK_ANIME, EPISODES } from './constants';
import { Anime, DetailedAnime, DetailedEpisode } from './types';

// --- Components ---

const Button = ({ children, variant = 'yellow', className = '', onClick }: { children: React.ReactNode, variant?: 'yellow' | 'red' | 'blue' | 'black' | 'white', className?: string, onClick?: () => void }) => {
  const variants = {
    yellow: 'bg-[#FFCC00] text-black hover:bg-[#FFD633]',
    red: 'bg-[#FF3B30] text-white hover:bg-[#FF4D42]',
    blue: 'bg-[#007AFF] text-white hover:bg-[#1A87FF]',
    black: 'bg-black text-white hover:bg-[#222]',
    white: 'bg-white text-black hover:bg-gray-100',
  };

  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-black oswald uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all cursor-pointer ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, color = 'yellow', className = '' }: { children: React.ReactNode, color?: string, className?: string }) => {
  const colors: Record<string, string> = {
    yellow: 'bg-[#FFCC00] text-black',
    red: 'bg-[#FF3B30] text-white',
    blue: 'bg-[#007AFF] text-white',
    green: 'bg-[#4CD964] text-black',
    black: 'bg-black text-white',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-bold border-2 border-black uppercase oswald ${colors[color] || colors.yellow} ${className}`}>
      {children}
    </span>
  );
};

const Loader = ({ message = "SYNCING WITH SERVERS..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <div className="w-16 h-16 border-8 border-black border-t-[#FFCC00] rounded-full animate-spin shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
    <h2 className="text-3xl font-black oswald animate-pulse italic">{message}</h2>
  </div>
);

const Navbar = ({ onNavigate, currentPage }: { onNavigate: (page: string) => void, currentPage: string }) => {
  return (
    <nav className="sticky top-0 z-50 bg-[#0c0c0c] border-b-4 border-black px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="text-4xl font-black oswald italic cursor-pointer flex items-center gap-2"
          onClick={() => onNavigate('home')}
        >
          <span className="bg-[#FFCC00] text-black px-2 border-2 border-black transform -rotate-2">ANIME</span>
          <span className="text-[#FF3B30] underline decoration-4 underline-offset-4">X</span>
        </div>
        
        <div className="hidden md:flex gap-8 font-black uppercase oswald text-xl">
          {['home', 'movies'].map(item => (
            <button 
              key={item}
              onClick={() => onNavigate(item)}
              className={`hover:text-[#FFCC00] transition-colors cursor-pointer ${currentPage === item ? 'text-[#FFCC00]' : ''}`}
            >
              {item}
            </button>
          ))}
          <button onClick={() => onNavigate('home')} className="hover:text-[#FFCC00] transition-colors cursor-pointer">Trending</button>
          <button onClick={() => onNavigate('home')} className="hover:text-[#FFCC00] transition-colors cursor-pointer">New</button>
        </div>

        <div className="flex gap-4">
          <Button variant="white" className="py-2 px-4 text-sm" onClick={() => onNavigate('login')}>Login</Button>
          <Button variant="red" className="py-2 px-4 text-sm hidden sm:block" onClick={() => onNavigate('register')}>Join</Button>
        </div>
      </div>
    </nav>
  );
};

const AnimeCard = ({ anime, onClick }: { anime: Anime, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative border-4 border-black bg-white cursor-pointer shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(255,204,0,1)] transition-all overflow-hidden h-full flex flex-col"
    >
      <div className="aspect-[2/3] overflow-hidden relative">
        <img 
          src={anime.thumbnail} 
          alt={anime.title} 
          className="w-full h-full object-cover grayscale-0 group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge color="yellow">{anime.episode || anime.year}</Badge>
          <Badge color="red">{anime.status}</Badge>
        </div>
        <div className="absolute bottom-2 right-2">
          <Badge color="blue">★ {anime.rating.toFixed(1)}</Badge>
        </div>
      </div>
      <div className="p-3 bg-black text-white border-t-4 border-black flex-1 flex flex-col justify-between">
        <h3 className="font-bold oswald text-lg line-clamp-2 uppercase leading-tight mb-2">{anime.title}</h3>
        <p className="text-[10px] text-gray-400 font-bold tracking-widest">{anime.genre.join(' / ')}</p>
      </div>
    </div>
  );
};

// --- Page Components ---

const Home = ({ animes, loading, onSelectAnime }: { animes: Anime[], loading: boolean, onSelectAnime: (a: Anime) => void }) => {
  if (loading) return <Loader />;

  const featured = animes.length > 0 ? animes[0] : MOCK_ANIME[0];
  const list = animes.length > 0 ? animes : MOCK_ANIME;
  
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-12">
      <section className="relative min-h-[500px] lg:h-[600px] border-8 border-black shadow-[12px_12px_0px_0px_rgba(255,59,48,1)] overflow-hidden bg-black">
        <img src={featured.banner} className="w-full h-full object-cover opacity-60" alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent p-6 md:p-12 flex flex-col justify-end items-start gap-4">
          <div className="flex gap-2">
            {featured.genre.map(g => <Badge key={g} color="red">{g}</Badge>)}
          </div>
          <h1 className="text-4xl md:text-7xl font-black oswald leading-none max-w-2xl transform -rotate-1 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            {featured.title}
          </h1>
          <p className="max-w-xl text-sm md:text-lg font-medium line-clamp-3 bg-black/80 p-4 border-l-4 border-[#FFCC00]">
            {featured.synopsis}
          </p>
          <div className="flex gap-4 pt-4">
            <Button variant="yellow" onClick={() => onSelectAnime(featured)}>Watch Now</Button>
            <Button variant="white" className="hidden sm:block">+ List</Button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-4xl font-black oswald bg-[#FF3B30] text-white px-4 py-2 transform rotate-1 inline-block">Latest Releases</h2>
          <div className="flex-1 h-1 bg-black"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {list.map(anime => (
            <AnimeCard key={anime.id} anime={anime} onClick={() => onSelectAnime(anime)} />
          ))}
        </div>
      </section>
    </div>
  );
};

const MoviesPage = ({ movies, loading, onSelectAnime }: { movies: Anime[], loading: boolean, onSelectAnime: (a: Anime) => void }) => {
  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-12">
      <header className="bg-[#007AFF] border-8 border-black p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
        <h1 className="text-7xl font-black oswald text-white italic">ANIME MOVIES</h1>
        <p className="text-2xl font-bold oswald text-black bg-[#FFCC00] px-2 py-1 inline-block mt-4">CINEMATIC EXPERIENCES ONLY</p>
      </header>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.map(movie => (
            <AnimeCard key={movie.id} anime={movie} onClick={() => onSelectAnime(movie)} />
          ))}
        </div>
      </section>
    </div>
  );
};

const AnimeDetail = ({ 
  anime, 
  onWatchEpisode, 
  onBack, 
  loading 
}: { 
  anime: DetailedAnime | null, 
  onWatchEpisode: (ep: DetailedEpisode) => void, 
  onBack: () => void,
  loading: boolean
}) => {
  if (loading || !anime) return <Loader message="DECRYPTING ANIME DATA..." />;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 pb-20">
      <Button variant="black" className="mb-4" onClick={onBack}>← Back</Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Poster & Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,122,255,1)] bg-white">
            <img src={anime.thumbnail} className="w-full" alt={anime.title} />
          </div>
          <div className="bg-white border-4 border-black p-6 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
            <h3 className="font-black oswald text-xl border-b-4 border-black pb-2 mb-4">Detailed Intel</h3>
            <div className="space-y-3 font-bold uppercase text-sm">
              <div className="flex justify-between border-b border-black/10 pb-1">
                <span className="text-gray-500">Status</span>
                <Badge color="red">{anime.status}</Badge>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-1">
                <span className="text-gray-500">Type</span>
                <span>{anime.info?.tipe || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-1">
                <span className="text-gray-500">Episodes</span>
                <span>{anime.info?.jumlah_episode || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-1">
                <span className="text-gray-500">Studio</span>
                <span>{anime.info?.studio || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-1">
                <span className="text-gray-500">Season</span>
                <span>{anime.info?.musim || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Score</span>
                <span className="text-blue-600 font-black">★ {anime.rating?.toFixed(2) || 'N/A'}</span>
              </div>
            </div>
            <div className="pt-4 border-t-4 border-black">
              <p className="font-black oswald mb-2">Genres</p>
              <div className="flex flex-wrap gap-2">
                {anime.genre?.map(g => <Badge key={g} color="yellow">{g}</Badge>)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Synopsis, Episodes */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#FF3B30] p-8 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-white relative">
            <Badge color="black" className="absolute -top-3 -left-3 scale-150">Top Choice</Badge>
            <h1 className="text-3xl md:text-6xl font-black oswald mb-4 transform -rotate-1 leading-tight">{anime.title}</h1>
            <p className="text-lg md:text-xl leading-relaxed font-bold bg-black/20 p-6 border-l-8 border-white italic">
              {anime.synopsis}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {anime.episodes && anime.episodes.length > 0 && (
                <Button variant="yellow" className="text-xl px-12" onClick={() => onWatchEpisode(anime.episodes[0])}>Watch Ep 01</Button>
              )}
              <Button variant="white">Track Progress</Button>
            </div>
          </div>

          <div className="bg-white border-4 border-black p-6 text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-4xl font-black oswald mb-6 border-b-8 border-black pb-2 inline-block italic">Episode List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anime.episodes?.map((ep) => (
                <div 
                  key={ep.slug} 
                  onClick={() => onWatchEpisode(ep)}
                  className="group flex items-center gap-4 border-4 border-black p-4 hover:bg-[#FFCC00] cursor-pointer transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="w-12 h-12 bg-black text-[#FFCC00] flex items-center justify-center font-black oswald text-2xl italic shrink-0">
                    {ep.episode?.padStart(2, '0') || '??'}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-black oswald uppercase text-sm line-clamp-1 group-hover:text-black">{ep.title.replace(anime.title, '').replace('Subtitle Indonesia', '').trim() || `Episode ${ep.episode}`}</h4>
                    <p className="text-[10px] font-bold text-gray-400 group-hover:text-black/60 uppercase italic">Released: {ep.date}</p>
                  </div>
                  <div className="w-8 h-8 border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    ▶
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WatchPage = ({ 
  anime, 
  episode, 
  onBack 
}: { 
  anime: DetailedAnime, 
  episode: DetailedEpisode, 
  onBack: () => void 
}) => {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <Button variant="black" className="mb-2" onClick={onBack}>← Back to Intel</Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Player Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className="aspect-video bg-black border-8 border-black shadow-[12px_12px_0px_0px_rgba(255,204,0,1)] relative flex items-center justify-center overflow-hidden">
            <img src={anime.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xl" alt="background" />
            <div className="relative z-10 text-center space-y-6 px-4">
              <div className="mx-auto w-24 h-24 bg-[#FFCC00] border-8 border-black rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-2 active:translate-y-2">
                <div className="w-0 h-0 border-t-[20px] border-t-transparent border-l-[35px] border-l-black border-b-[20px] border-b-transparent ml-2"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-black oswald text-2xl md:text-3xl uppercase tracking-tighter bg-black/80 px-6 py-3 border-4 border-[#FFCC00] inline-block">
                  STREAMING: EPISODE {episode.episode}
                </h3>
                <p className="text-[#FFCC00] font-black oswald text-lg">{episode.title}</p>
              </div>
            </div>
            {/* Mock Player UI */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-6 z-20">
               <div className="flex-1 h-4 bg-gray-800 border-2 border-black relative">
                  <div className="absolute top-0 left-0 bottom-0 w-[45%] bg-[#FF3B30] border-r-2 border-black"></div>
               </div>
               <div className="flex gap-2">
                  <div className="w-8 h-8 bg-white border-2 border-black"></div>
                  <div className="w-8 h-8 bg-white border-2 border-black"></div>
               </div>
            </div>
          </div>

          <div className="bg-white border-8 border-black p-8 text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black oswald uppercase leading-none italic">{anime.title}</h1>
                <p className="text-xl font-bold text-red-600 mt-2 uppercase tracking-widest">Now Playing: Episode {episode.episode}</p>
              </div>
              <div className="flex gap-4">
                 <Button variant="red" className="py-2 px-6 text-xl">♥ LOVE IT</Button>
              </div>
            </div>
            <div className="border-t-4 border-black pt-6">
               <h4 className="font-black oswald text-xl mb-4">SYNOPSIS</h4>
               <p className="text-lg font-medium leading-relaxed">{anime.synopsis}</p>
            </div>
          </div>
        </div>

        {/* Sidebar: Episode Selector */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#4CD964] p-6 border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
            <h3 className="text-black font-black oswald uppercase text-2xl mb-4 italic">Next Targets</h3>
            <div className="space-y-4">
              {anime.episodes?.slice(0, 10).map((ep) => (
                <div 
                  key={ep.slug} 
                  className={`bg-white border-4 border-black p-3 flex gap-4 cursor-pointer hover:bg-black hover:text-[#FFCC00] transition-colors ${ep.slug === episode.slug ? 'ring-4 ring-black ring-offset-2 bg-yellow-100' : ''}`}
                >
                  <div className="font-black oswald text-xl shrink-0 italic">EP {ep.episode}</div>
                  <div className="text-[10px] font-bold uppercase line-clamp-2 leading-tight">{ep.title.split('Episode')[0]}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-500 p-6 border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             <h3 className="font-black oswald text-white text-xl mb-2">QUICK TIP</h3>
             <p className="text-white text-xs font-bold leading-tight uppercase">Switch to premium to skip the intro and sync your progress with the cloud village!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthPage = ({ mode, onSwitch, onFinish }: { mode: 'login' | 'register', onSwitch: () => void, onFinish: () => void }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-md bg-white border-8 border-black p-8 shadow-[16px_16px_0px_0px_rgba(255,204,0,1)] text-black space-y-8 transform -rotate-1">
        <div className="text-center space-y-2">
          <h2 className="text-5xl md:text-6xl font-black oswald italic transform rotate-2">{mode === 'login' ? 'WELCOME BACK' : 'JOIN THE CLAN'}</h2>
        </div>
        <div className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-black oswald uppercase text-sm">Username</label>
              <input type="text" className="w-full p-3 border-4 border-black font-bold outline-none focus:bg-[#FFCC00]" placeholder="USER" />
            </div>
          )}
          <div className="space-y-1">
            <label className="font-black oswald uppercase text-sm">Email</label>
            <input type="email" className="w-full p-3 border-4 border-black font-bold outline-none focus:bg-[#FFCC00]" placeholder="NINJA@VILLAGE.COM" />
          </div>
          <div className="space-y-1">
            <label className="font-black oswald uppercase text-sm">Password</label>
            <input type="password" className="w-full p-3 border-4 border-black font-bold outline-none focus:bg-[#FFCC00]" placeholder="••••••••" />
          </div>
        </div>
        <Button variant={mode === 'login' ? 'yellow' : 'red'} className="w-full py-4" onClick={onFinish}>
          {mode === 'login' ? 'ACCESS' : 'CREATE'}
        </Button>
      </div>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedAnime, setSelectedAnime] = useState<DetailedAnime | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<DetailedEpisode | null>(null);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [movieList, setMovieList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const cleanTitle = (title?: string) => title ? title.split(' Subtitle Indonesia')[0].trim() : 'Unknown Title';

  const mapApiData = (data: any[]): Anime[] => {
    if (!Array.isArray(data)) return [];
    return data.map((item: any) => ({
      id: item.slug || 'unknown',
      title: cleanTitle(item.title),
      thumbnail: item.poster || '',
      banner: item.poster || '',
      episode: item.type === 'Movie' ? 'Movie' : (item.episode || item.type || 'ONA'),
      status: item.status?.toLowerCase().includes('completed') ? 'COMPLETED' : 'ONGOING',
      year: parseInt(item.date) || 2024,
      rating: 8.0 + (Math.random() * 1.5),
      genre: [item.type || 'Action'],
      synopsis: `Release status: ${item.status || 'Active'}. Dive into the world of ${item.title} on AnimeX.`,
      likes: `${Math.floor(Math.random() * 50) + 1}K`
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [homeRes, movieRes] = await Promise.all([
          fetch('https://www.sankavollerei.com/anime/animesail/home'),
          fetch('https://www.sankavollerei.com/anime/animesail/movie?page=1')
        ]);
        
        const homeJson = await homeRes.json();
        const movieJson = await movieRes.json();
        
        if (homeJson.status === 'success') setAnimeList(mapApiData(homeJson.data));
        if (movieJson.status === 'success') setMovieList(mapApiData(movieJson.data));
      } catch (error) {
        console.error('Fetch Error:', error);
        setAnimeList(MOCK_ANIME);
        setMovieList(MOCK_ANIME);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectAnime = async (anime: Anime) => {
    setPage('detail');
    setDetailLoading(true);
    window.scrollTo(0, 0);

    try {
      const res = await fetch(`https://www.sankavollerei.com/anime/animesail/detail/${anime.id}`);
      const json = await res.json();
      
      if (json.status === 'success' && json.data) {
        const d = json.data;
        const detailed: DetailedAnime = {
          ...anime,
          title: cleanTitle(d.title || anime.title),
          thumbnail: d.poster || anime.thumbnail,
          synopsis: d.synopsis || anime.synopsis,
          rating: (d.info && d.info.skor_anime) ? parseFloat(d.info.skor_anime) : anime.rating,
          genre: d.genres || anime.genre,
          status: (d.info && d.info.status === 'Completed') ? 'COMPLETED' : 'ONGOING',
          year: (d.info && parseInt(d.info.dirilis)) || anime.year,
          info: {
            alternatif: d.info?.alternatif,
            tipe: d.info?.tipe,
            jumlah_episode: d.info?.jumlah_episode,
            studio: d.info?.studio,
            musim: d.info?.musim,
          },
          episodes: d.episodes || []
        };
        setSelectedAnime(detailed);
      } else {
        throw new Error("Invalid detail data from API");
      }
    } catch (err) {
      console.error('Detail Fetch Error:', err);
      // Fallback: Create a detailed view using available data from the list
      const fallbackDetail: DetailedAnime = {
        ...anime,
        info: {},
        episodes: []
      };
      setSelectedAnime(fallbackDetail);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleWatchEpisode = (ep: DetailedEpisode) => {
    setSelectedEpisode(ep);
    setPage('watch');
    window.scrollTo(0, 0);
  };

  const handleNavigate = (newPage: string) => {
    setPage(newPage);
    setSelectedAnime(null);
    setSelectedEpisode(null);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (page) {
      case 'home':
        return <Home animes={animeList} loading={loading} onSelectAnime={handleSelectAnime} />;
      case 'movies':
        return <MoviesPage movies={movieList} loading={loading} onSelectAnime={handleSelectAnime} />;
      case 'detail':
        return <AnimeDetail 
          anime={selectedAnime} 
          loading={detailLoading} 
          onWatchEpisode={handleWatchEpisode} 
          onBack={() => handleNavigate('home')} 
        />;
      case 'watch':
        return selectedAnime && selectedEpisode ? (
          <WatchPage 
            anime={selectedAnime} 
            episode={selectedEpisode} 
            onBack={() => setPage('detail')} 
          />
        ) : <Home animes={animeList} loading={loading} onSelectAnime={handleSelectAnime} />;
      case 'login':
        return <AuthPage mode="login" onSwitch={() => setPage('register')} onFinish={() => setPage('home')} />;
      case 'register':
        return <AuthPage mode="register" onSwitch={() => setPage('login')} onFinish={() => setPage('home')} />;
      default:
        return <Home animes={animeList} loading={loading} onSelectAnime={handleSelectAnime} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-[#FFCC00] selection:text-black overflow-x-hidden">
      <Navbar onNavigate={handleNavigate} currentPage={page} />
      <main className="py-4 md:py-8">
        {renderContent()}
      </main>
      
      <footer className="mt-20 bg-black border-t-8 border-[#FF3B30] p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 text-[60px] md:text-[120px] font-black opacity-10 transform translate-x-10 -translate-y-10 leading-none pointer-events-none oswald">
          ANIME X
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="space-y-4">
             <div className="text-4xl font-black oswald italic flex items-center gap-2">
                <span className="bg-[#FFCC00] text-black px-2 border-2 border-black transform -rotate-2 oswald">ANIME</span>
                <span className="text-[#FF3B30] underline decoration-4 underline-offset-4 oswald">X</span>
              </div>
              <p className="font-bold text-gray-400">The world's most aggressive anime experience. Built for the fans.</p>
          </div>
          <div>
            <h4 className="font-black oswald text-xl mb-4 text-[#FFCC00]">NAVIGATE</h4>
            <ul className="space-y-2 font-bold uppercase text-sm">
              <li onClick={() => handleNavigate('home')} className="hover:text-[#FF3B30] cursor-pointer">Home</li>
              <li onClick={() => handleNavigate('movies')} className="hover:text-[#FF3B30] cursor-pointer">Movies</li>
              <li className="hover:text-[#FF3B30] cursor-pointer">Discord</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black oswald text-xl mb-4 text-[#FFCC00]">FOLLOW US</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 border-4 border-white flex items-center justify-center font-black hover:bg-[#FFCC00] hover:text-black cursor-pointer shadow-[2px_2px_0px_0px_white]">X</div>
              <div className="w-10 h-10 border-4 border-white flex items-center justify-center font-black hover:bg-[#FFCC00] hover:text-black cursor-pointer shadow-[2px_2px_0px_0px_white]">Y</div>
            </div>
          </div>
          <div className="bg-[#FFCC00] p-4 border-4 border-white text-black shadow-[8px_8px_0px_0px_white]">
             <h4 className="font-black oswald text-lg mb-2">JOIN THE SQUAD</h4>
             <div className="flex">
               <input type="text" className="bg-white border-2 border-black p-2 w-full outline-none font-bold text-sm" placeholder="Email" />
               <button className="bg-black text-white p-2 border-2 border-black border-l-0 font-black oswald px-4 hover:bg-red-600 transition-colors">GO</button>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t-2 border-gray-800 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
           © 2024 ANIME X - NO RIGHTS RESERVED. BEYOND BOLD.
        </div>
      </footer>
    </div>
  );
}
