import React, { useEffect, useState, useMemo } from 'react';
import { Anime } from '../types';
import Loader from '../components/Loader';
import AnimeCard from '../components/AnimeCard';
import { ANIMEPLAY_API_BASE_URL } from '../constants';
import { authenticatedFetch } from '../utils/api';

type SeriesType = 'ALL' | 'ANIME' | 'DONGHUA';

const SeriesListPage = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [donghuaList, setDonghuaList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SeriesType>('ALL');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const mapApiData = (data: any[], type: 'Anime' | 'Donghua'): Anime[] => {
    if (!Array.isArray(data)) return [];
    return data.map((item: any) => ({
      id: item.seri.id,
      title: item.seri.title,
      thumbnail: item.seri.image_url || '',
      banner: item.seri.image_url || '',
      episode: item.number ? `EP ${item.number}` : '??',
      status: 'ONGOING',
      year: item.date_created ? new Date(item.date_created).getFullYear() : 2026,
      rating: item.seri.rating ? parseFloat(item.seri.rating) : 0,
      genre: [type],
      synopsis: `Latest Release: ${item.date_created ? new Date(item.date_created).toLocaleDateString() : 'Recently'}.`,
      likes: `${Math.floor(Math.random() * 50) + 1}K`
    }));
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [animeRes, donghuaRes] = await Promise.all([
          authenticatedFetch(`${ANIMEPLAY_API_BASE_URL}/listanime`),
          authenticatedFetch(`${ANIMEPLAY_API_BASE_URL}/listdonghua`)
        ]);

        const animeJson = await animeRes.json();
        const donghuaJson = await donghuaRes.json();
        
        if (animeJson.status === 'success') setAnimeList(mapApiData(animeJson.data, 'Anime'));
        if (donghuaJson.status === 'success') setDonghuaList(mapApiData(donghuaJson.data, 'Donghua'));
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    window.scrollTo(0, 0);
  }, []);

  const filteredList = useMemo(() => {
    let combined = [];
    if (filter === 'ALL') combined = [...animeList, ...donghuaList];
    else if (filter === 'ANIME') combined = animeList;
    else combined = donghuaList;

    // Sort by date or title? Let's keep original combined order or sort by title
    return combined;
  }, [filter, animeList, donghuaList]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentList = filteredList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1); // Reset page on filter change
  }, [filter]);

  if (loading) return <Loader message="MERGING DATABASES..." />;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-12">
      <header className="bg-black border-8 border-white p-8 md:p-12 shadow-[12px_12px_0px_0px_#FFCC00] transform -rotate-1 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 opacity-10 font-black text-8xl -translate-y-4 uppercase select-none">Catalog</div>
        <h1 className="text-4xl md:text-7xl font-black oswald italic relative z-10 uppercase">Series Catalog</h1>
        <div className="flex flex-wrap gap-4 mt-6 relative z-10">
            {(['ALL', 'ANIME', 'DONGHUA'] as SeriesType[]).map((t) => (
                <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-6 py-2 border-4 border-white font-black oswald uppercase transition-all transform hover:-translate-y-1 active:translate-y-0 ${
                        filter === t ? 'bg-[#FF3B30] text-white shadow-[4px_4px_0px_0px_white]' : 'bg-transparent text-gray-400 border-gray-600 hover:text-white hover:border-white'
                    }`}
                >
                    {t}
                </button>
            ))}
        </div>
      </header>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {currentList.map((item, idx) => (
            <AnimeCard key={`${item.id}-${idx}`} anime={item} />
          ))}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 pb-10">
            <button 
            onClick={() => {
                setPage(p => Math.max(1, p - 1));
                window.scrollTo(0, 0);
            }}
            disabled={page === 1}
            className={`px-8 py-3 font-black oswald border-4 border-black shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all ${page === 1 ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-white hover:bg-[#FFCC00] text-black'}`}
            >
            PREV
            </button>
            <div className="bg-black text-white px-6 py-3 border-4 border-black font-black oswald text-xl flex items-center justify-center min-w-[80px]">
            {page} / {totalPages}
            </div>
            <button 
            onClick={() => {
                setPage(p => Math.min(totalPages, p + 1));
                window.scrollTo(0, 0);
            }}
            disabled={page === totalPages}
            className={`px-8 py-3 font-black oswald border-4 border-black shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all ${page === totalPages ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-[#FF3B30] text-white hover:bg-red-600'}`}
            >
            NEXT
            </button>
        </div>
      )}
    </div>
  );
};

export default SeriesListPage;
