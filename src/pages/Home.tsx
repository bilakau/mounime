import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Anime } from '../types';
import { MOCK_ANIME } from '../constants';
import Loader from '../components/Loader';
import Badge from '../components/Badge';
import Button from '../components/Button';
import AnimeCard from '../components/AnimeCard';
import { useFavorites } from '../hooks/useFavorites';

const Home = ({ trending, movies, completed, loading }: { trending: Anime[], movies: Anime[], completed: Anime[], loading: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const trendingList = trending.length > 0 ? trending : MOCK_ANIME;
  const movieList = movies;
  const completedList = completed;
  const featuredList = trendingList.slice(0, 5); // Use top 5 for carousel

  useEffect(() => {
    if (loading || featuredList.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredList.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [loading, featuredList.length]);

  if (loading) return <Loader />;

  const featured = featuredList[currentIndex];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % featuredList.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + featuredList.length) % featuredList.length);
  
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-20">
      {/* Hero Carousel Section */}
      <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 border-8 border-black shadow-[16px_16px_0px_0px_#007AFF] bg-white overflow-hidden">
        {/* Visual Side */}
        <div className="lg:col-span-8 relative h-[350px] lg:h-[450px] border-b-8 lg:border-b-0 lg:border-r-8 border-black overflow-hidden group bg-black">
          {/* Blurred Background Fallback for different aspect ratios */}
          <img 
            key={featured.id + '-bg'}
            src={featured.banner} 
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-50 scale-110"
            alt=""
          />
          
          <img 
            key={featured.id + '-img'}
            src={featured.banner} 
            className="relative w-full h-full object-cover lg:object-top grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 animate-in fade-in zoom-in duration-500" 
            alt="Hero" 
          />
          <div className="absolute inset-0 bg-black/20 bg-[radial-gradient(circle,transparent_20%,#000_120%)] pointer-events-none"></div>
          
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
             <div className="bg-[#FF3B30] text-white px-3 py-1 border-4 border-black text-black oswald text-lg shadow-[4px_4px_0px_0px_black] transform -rotate-2">
               RELEASE TODAY
             </div>
          </div>
          
          <div className="absolute bottom-4 right-4 flex gap-2 flex-wrap justify-end max-w-[80%] z-10">
             {featured.genre.map((g, i) => (
               <span key={g} className={`px-2 py-0.5 border-2 border-black font-bold uppercase text-[10px] shadow-[2px_2px_0px_0px_black] ${i % 2 === 0 ? 'bg-[#FFCC00] text-black rotate-1' : 'bg-white text-black -rotate-1'}`}>
                 {g}
               </span>
             ))}
          </div>

          {/* Carousel Controls - On Image for Mobile/Tablet */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none lg:hidden z-20">
             <button onClick={prevSlide} className="pointer-events-auto bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none">
               <span className="text-black text-2xl">←</span>
             </button>
             <button onClick={nextSlide} className="pointer-events-auto bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none">
               <span className="text-black text-2xl">→</span>
             </button>
          </div>
        </div>

        {/* Info Side */}
        <div className="lg:col-span-4 bg-[#FFCC00] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden lg:h-[450px]">
          {/* Decorative patterned background */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 space-y-3">
            <div className="flex justify-between items-start">
              <div className="inline-block bg-black text-white px-3 py-1 font-bold font-mono text-[10px] border-2 border-white transform rotate-3 mb-2">
                // NOW_STREAMING // {currentIndex + 1}/5
              </div>
              
              {/* Desktop Carousel Controls */}
              <div className="hidden lg:flex gap-2">
                <button onClick={prevSlide} className="bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_black] hover:-translate-y-0.5 transition-transform cursor-pointer">
                  <span className="text-black text-sm">←</span>
                </button>
                <button onClick={nextSlide} className="bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_black] hover:-translate-y-0.5 transition-transform cursor-pointer">
                  <span className="text-black text-sm">→</span>
                </button>
              </div>
            </div>
            
            <h1 key={featured.id + '-title'} className="text-2xl md:text-3xl lg:text-4xl text-black oswald leading-[1.1] uppercase break-words text-black drop-shadow-lg animate-in slide-in-from-left-4 duration-500 line-clamp-2">
              {featured.title}
            </h1>

            <div key={featured.id + '-synop'} className="bg-white border-4 border-black p-3 shadow-[6px_6px_0px_0px_black] transform -rotate-1 animate-in slide-in-from-right-4 duration-500">
              <p className="text-xs text-black font-bold line-clamp-3 leading-tight">
                {featured.synopsis}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-4 space-y-3">
            <Link to={`/detail/${featured.id}`} className="block">
              <button className="w-full py-3 bg-black text-white text-black oswald text-lg md:text-xl uppercase border-4 border-white shadow-[6px_6px_0px_0px_#FF3B30] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:bg-[#333] cursor-pointer">
                Start Watching
              </button>
            </Link>
            <div className="flex gap-4">
               <button 
                onClick={() => toggleFavorite(featured)}
                className={`flex-1 py-1.5 font-bold border-4 border-black uppercase text-[10px] cursor-pointer transition-colors ${
                  isFavorite(featured.id) ? 'bg-[#FF3B30] text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
               >
                 {isFavorite(featured.id) ? '✓ In My List' : '+ My List'}
               </button>
               <button className="flex-1 py-1.5 bg-[#007AFF] text-white font-bold border-4 border-black hover:bg-[#0056b3] uppercase text-[10px] cursor-pointer">
                 Trailer
               </button>
            </div>
          </div>
          
          {/* Progress Indicators */}
          <div className="relative z-10 mt-4 flex gap-2">
            {featuredList.map((_, idx) => (
              <div 
                key={idx} 
                onClick={() => setCurrentIndex(idx)}
                className={`h-3 border-2 border-black cursor-pointer transition-all ${idx === currentIndex ? 'w-10 bg-black' : 'w-3 bg-white'}`}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-[#FF3B30] text-white px-6 py-3 border-4 border-black transform -rotate-1 shadow-[8px_8px_0px_0px_black]">
              <h2 className="text-4xl md:text-5xl font-black oswald italic uppercase">Sedang Populer</h2>
            </div>
            <div className="hidden md:block flex-1 h-2 bg-black min-w-[50px]"></div>
          </div>
          <Link to="/trending">
            <button className="px-6 py-2 bg-[#FFCC00] text-black font-black oswald border-4 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer uppercase text-sm md:text-lg">
              See All →
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
          {trendingList.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>

      {/* Movies Section */}
      {movieList.length > 0 && (
        <section>
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-[#FFCC00] text-black px-6 py-3 border-4 border-black transform rotate-1 shadow-[8px_8px_0px_0px_black]">
                <h2 className="text-4xl md:text-5xl font-black oswald italic uppercase">Film Layar Lebar</h2>
              </div>
              <div className="hidden md:block flex-1 h-2 bg-black min-w-[50px]"></div>
            </div>
            <Link to="/movies">
              <button className="px-6 py-2 bg-black text-white font-black oswald border-4 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer uppercase text-sm md:text-lg">
                See All →
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
            {movieList.map(anime => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Completed Section */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-[#007AFF] text-white px-6 py-3 border-4 border-black transform rotate-1 shadow-[8px_8px_0px_0px_black]">
              <h2 className="text-4xl md:text-5xl font-black oswald italic uppercase">Selesai Ditayangkan</h2>
            </div>
            <div className="hidden md:block flex-1 h-2 bg-black min-w-[50px]"></div>
          </div>
          <Link to="/complete">
            <button className="px-6 py-2 bg-[#4CD964] text-black font-black oswald border-4 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer uppercase text-sm md:text-lg">
              See All →
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
          {completedList.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
