import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Badge from '../components/Badge';
import { DetailedAnime } from '../types';
import { ANIMEPLAY_API_BASE_URL } from '../constants';
import { authenticatedFetch } from '../utils/api';

interface StreamData {
  id: string;
  quality: string;
  streaming_url: string;
  download_url: string;
  file_size: number;
}

const WatchPage = () => {
  const { slug, episodeSlug } = useParams<{ slug: string, episodeSlug: string }>();
  const navigate = useNavigate();
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [animeDetail, setAnimeDetail] = useState<DetailedAnime | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStream, setCurrentStream] = useState<StreamData | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!episodeSlug || !slug) return;
      setLoading(true);
      try {
        // Fetch Episode Stream Data
        const epRes = await authenticatedFetch(`${ANIMEPLAY_API_BASE_URL}/watch/${episodeSlug}`);
        const epJson = await epRes.json();
        
        // Fetch Anime Detail (for episode list / next-prev)
        const detailRes = await authenticatedFetch(`${ANIMEPLAY_API_BASE_URL}/detail/${slug}`);
        const detailJson = await detailRes.json();

        if (epJson.status === 'success' && epJson.data?.data) {
          const streamList = epJson.data.data;
          setStreams(streamList);
          // Set highest quality as default
          setCurrentStream(streamList[0] || null);
        }

        if (detailJson.status === 'success' && detailJson.data?.data) {
          const d = detailJson.data.data;
          const detailed: DetailedAnime = {
            id: d.id,
            title: d.title,
            thumbnail: d.image_url,
            banner: d.image_url,
            episode: d.latest_episode?.toString() || '?',
            status: d.season_status?.toUpperCase() === 'COMPLETED' ? 'COMPLETED' : 'ONGOING',
            year: d.release_date ? new Date(d.release_date).getFullYear() : 2026,
            rating: d.rating ? parseFloat(d.rating) : 0,
            genre: d.genres?.map((g: any) => g.genre.name) || [],
            synopsis: d.synopsis || 'No synopsis available.',
            info: {
              japanese: d.title_japanese,
              tipe: d.type,
              jumlah_episode: d.total_episode,
              studio: d.studio?.name || 'N/A',
              score: d.rating,
              producers: 'N/A',
              duration: d.duration,
              aired: d.release_date ? new Date(d.release_date).toLocaleDateString() : 'N/A',
            },
            episodes: d.episodes?.map((ep: any) => ({
              title: ep.title_indonesian || `Episode ${ep.number}`,
              episode: ep.number?.toString(),
              date: ep.date_created ? new Date(ep.date_created).toLocaleDateString() : 'Recently',
              slug: ep.id
            })) || [],
          };
          setAnimeDetail(detailed);
        }
      } catch (err) {
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    window.scrollTo(0, 0);
  }, [slug, episodeSlug]);

  const getAdjacentEpisodes = () => {
    if (!animeDetail || !animeDetail.episodes || !episodeSlug) return { prev: null, next: null };
    
    const list = [...animeDetail.episodes].reverse(); // API usually returns newest first
    const currentIndex = list.findIndex(ep => ep.slug === episodeSlug);
    
    if (currentIndex === -1) return { prev: null, next: null };

    return {
      prev: currentIndex > 0 ? list[currentIndex - 1] : null,
      next: currentIndex < list.length - 1 ? list[currentIndex + 1] : null
    };
  };

  const { prev, next } = getAdjacentEpisodes();

  if (loading || streams.length === 0) return <Loader message="DECODING STREAM SIGNAL..." />;

  const currentEpisode = animeDetail?.episodes.find(ep => ep.slug === episodeSlug);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 pb-20">
      <div className="flex justify-between items-center border-b-8 border-black pb-6">
        <Button variant="black" onClick={() => navigate(`/detail/${slug}`)}>← RETURN TO INTEL</Button>
        <div className="hidden md:block bg-[#FFCC00] border-4 border-black px-4 py-2 font-black oswald text-black transform rotate-2 shadow-[4px_4px_0px_0px_black]">
           ENCRYPTED CONNECTION : STABLE
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="relative">
              <div className="aspect-video bg-black border-8 border-black shadow-[16px_16px_0px_0px_#FF3B30] relative overflow-hidden z-10 group">
                <iframe 
                  src={currentStream?.streaming_url} 
                  className="w-full h-full relative z-10" 
                  allowFullScreen 
                  title={animeDetail?.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>

                {!isUnlocked && (
                  <div 
                    className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-pointer group/unlock"
                    onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onClick={() => setIsUnlocked(true)}
                  >
                     <div className="bg-[#FFCC00] border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_black] transform group-hover/unlock:scale-110 group-hover/unlock:-rotate-2 transition-all">
                        <div className="flex flex-col items-center gap-4">
                           <span className="font-black oswald text-3xl md:text-5xl text-black">DECODE STREAM</span>
                           <span className="bg-black text-white px-4 py-1 font-bold text-xs animate-pulse">CLICK TO START SESSION</span>
                        </div>
                     </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 text-black mt-6 gap-4">
                {prev ? (
                  <button 
                    onClick={() => navigate(`/watch/${slug}/${prev.slug}`)}
                    className="bg-white border-4 border-black p-3 font-black oswald uppercase text-sm md:text-lg hover:bg-[#FFCC00] shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                  >
                    ← PREV
                  </button>
                ) : <div />}
                
                <button 
                  onClick={() => navigate(`/detail/${slug}`)}
                  className="bg-black text-white border-4 border-black p-3 font-black oswald uppercase text-sm md:text-lg hover:bg-gray-800 shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  LIST
                </button>

                {next ? (
                  <button 
                    onClick={() => navigate(`/watch/${slug}/${next.slug}`)}
                    className="bg-white border-4 border-black p-3 font-black oswald uppercase text-sm md:text-lg hover:bg-[#FFCC00] shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                  >
                    NEXT →
                  </button>
                ) : <div />}
              </div>

              <div className="absolute -inset-4 bg-[#FFCC00] -z-10 border-4 border-black transform rotate-1 opacity-20"></div>
            </div>

            <div className="bg-white border-8 border-black p-6 md:p-10 text-black shadow-[16px_16px_0px_0px_#007AFF] relative">
              <div className="relative mb-10">
                <div className="bg-[#FF3B30] text-white p-4 md:p-6 border-4 border-black transform -rotate-1 shadow-[8px_8px_0px_0px_black] inline-block mb-4">
                  <h1 className="text-xl md:text-3xl lg:text-4xl font-black oswald uppercase leading-none italic">
                    {animeDetail?.title} - {currentEpisode?.title}
                  </h1>
                </div>
                <div className="absolute -top-4 -right-4 bg-black text-[#FFCC00] px-3 py-1 font-black oswald transform rotate-3 border-2 border-white text-xs">
                  NOW_STREAMING
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="border-t-4 border-black pt-6">
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="font-black oswald text-2xl uppercase italic bg-[#FFCC00] px-4 py-1 border-4 border-black">Stream Quality</h3>
                    <div className="flex-1 h-1 bg-black"></div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {streams.map((stream) => (
                      <button
                        key={stream.id}
                        onClick={() => setCurrentStream(stream)}
                        className={`px-6 py-3 font-black oswald text-lg uppercase border-4 border-black transition-all cursor-pointer shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 ${
                          currentStream?.id === stream.id ? 'bg-[#FF3B30] text-white' : 'bg-white text-black hover:bg-[#FFCC00]'
                        }`}
                      >
                        {stream.quality} ({stream.file_size}MB)
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
             <div className="space-y-4">
                <div className="bg-black text-[#FFCC00] p-4 border-4 border-white shadow-[4px_4px_0px_0px_black] text-center">
                    <h3 className="font-black oswald text-xl italic uppercase">Episode List</h3>
                </div>
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] max-h-[300px] lg:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent">
                    {animeDetail?.episodes?.map((ep, idx) => (
                    <button
                        key={idx}
                        onClick={() => navigate(`/watch/${slug}/${ep.slug}`)}
                        className={`w-full text-left p-3 border-b-2 border-black font-black oswald text-sm uppercase flex items-center gap-3 transition-colors ${
                        ep.slug === episodeSlug ? 'bg-[#FF3B30] text-white' : 'text-black hover:bg-[#FFCC00]'
                        }`}
                    >
                        <span className="w-8 h-8 flex items-center justify-center border-2 border-current italic">{ep.episode}</span>
                        <span className="truncate">{ep.title}</span>
                    </button>
                    ))}
                </div>
             </div>

             <div className="bg-[#FFCC00] p-6 border-8 border-black shadow-[12px_12px_0px_0px_black] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '15px 15px' }}></div>
                <div className="relative z-10">
                  <div className="bg-black text-white p-4 border-4 border-white mb-8 transform rotate-1 shadow-[8px_8px_0px_0px_white]">
                    <h3 className="font-black oswald text-xl italic uppercase text-center">DOWNLOAD</h3>
                  </div>
                  <div className="space-y-4">
                    {streams.map((stream) => (
                      <a 
                        key={stream.id}
                        href={stream.download_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between bg-white text-black font-black oswald p-4 border-4 border-black hover:bg-black hover:text-white transition-all transform hover:-translate-x-1 shadow-[4px_4px_0px_0px_black]"
                      >
                        <span>{stream.quality}</span>
                        <span className="bg-[#007AFF] text-white px-2 py-1 text-[10px]">GET ({stream.file_size}MB)</span>
                      </a>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-12">
            <div className="bg-black text-white p-6 border-4 border-[#FF3B30] shadow-[8px_8px_0px_0px_#FF3B30]">
               <p className="font-black oswald text-xs uppercase italic leading-tight">
                 // WARNING: Secure connection established. High-speed data transfer in progress.
               </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;