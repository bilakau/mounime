import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Genre } from '../types';
import Loader from '../components/Loader';
import { ANIMEPLAY_API_BASE_URL } from '../constants';
import { authenticatedFetch } from '../utils/api';

const GenrePage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await authenticatedFetch(`${ANIMEPLAY_API_BASE_URL}/listgenre`);
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data)) {
          const mappedGenres = json.data.map((g: any) => ({
            genreId: g.id,
            title: g.name
          }));
          setGenres(mappedGenres);
        }
      } catch (err) {
        console.error('Genre Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  if (loading) return <Loader message="SORTING GENRES..." />;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-12 pb-20">
      <header className="bg-[#FFCC00] border-8 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 font-black text-8xl -translate-y-4 select-none">GENRES</div>
        <h1 className="text-4xl md:text-7xl font-black oswald text-black italic relative z-10">GENRE ARCHIVE</h1>
        <p className="text-lg md:text-2xl font-bold oswald text-white bg-black px-2 py-1 inline-block mt-4 relative z-10 uppercase">Select Your Category</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {genres.map((genre) => (
          <div 
            key={genre.genreId}
            onClick={() => navigate(`/genre/${genre.genreId}`)}
            className="group cursor-pointer bg-white border-4 border-black p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-[#FF3B30] transition-all"
          >
            <h3 className="font-black text-black oswald text-xl md:text-2xl uppercase italic group-hover:text-white transition-colors">
              {genre.title}
            </h3>
            <div className="mt-2 h-1 w-12 bg-black group-hover:bg-white transition-colors"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenrePage;
