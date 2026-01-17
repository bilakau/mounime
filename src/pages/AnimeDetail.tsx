import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DetailedAnime } from '../types';
import Loader from '../components/Loader';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useFavorites } from '../hooks/useFavorites';
import { ANIMEPLAY_API_BASE_URL } from '../constants';
import { authenticatedFetch } from '../utils/api';

const AnimeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<DetailedAnime | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();
  const batchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await authenticatedFetch(`${ANIMEPLAY_API_BASE_URL}/detail/${slug}`);
        const json = await res.json();
        
        if (json.status === 'success' && json.data?.data) {
          const d = json.data.data;
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
            recommended: d.recommendations?.map((r: any) => ({
                animeId: r.id,
                title: r.title,
                poster: r.image_url
            })) || [],
          };

          setAnime(detailed);
        } else {
           console.error("Invalid detail data");
        }
      } catch (err) {
        console.error('Detail Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading || !anime) return <Loader message="DECRYPTING ANIME DATA..." />;

  const handleWatch = (epSlug: string) => {
      navigate(`/watch/${slug}/${epSlug}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 pb-20">
      <Button variant="black" className="mb-4" onClick={() => navigate(-1)}>← Back</Button>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR (Poster + Info): Order 2 on Mobile, Order 1 on Desktop (Left) */}
        <div className="order-2 lg:order-1 lg:w-1/4 flex flex-col gap-6">
          {/* Poster */}
          <div className="border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,122,255,1)] bg-white sticky top-24 z-10">
            <img src={anime.thumbnail} className="w-full" alt={anime.title} />
          </div>

          {/* Detailed Info */}
          <div className="bg-white border-4 border-black p-6 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
            <h3 className="font-black oswald text-xl border-b-4 border-black pb-2 mb-4">Detailed Intel</h3>
            <div className="space-y-3 font-bold uppercase text-sm">
              <div className="flex justify-between border-b border-black/10 pb-1">
                <span className="text-gray-500">Japanese</span>
                <span className="text-right ml-4">{anime.info?.japanese || 'N/A'}</span>
              </div>
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
                <span className="text-gray-500">Duration</span>
                <span>{anime.info?.duration || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-1">
                <span className="text-gray-500">Aired</span>
                <span>{anime.info?.aired || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Score</span>
                <span className="text-blue-600 font-black">★ {anime.rating?.toFixed(2) || 'N/A'}</span>
              </div>
            </div>
            <div className="pt-4 border-t-4 border-black">
              <p className="font-black oswald mb-2">Genres</p>
              <div className="flex flex-wrap gap-2">
                {anime.genre?.map((g: any, idx: number) => <Badge key={idx} color="yellow">{g}</Badge>)}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT (Title/Synop/Episodes): Order 1 on Mobile, Order 2 on Desktop (Right) */}
        <div className="order-1 lg:order-2 lg:w-3/4 space-y-8">
          <div className="bg-[#FF3B30] p-6 md:p-8 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-white relative">
            <Badge color="black" className="absolute -top-3 -left-3 scale-125">Top Choice</Badge>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black oswald mb-4 transform -rotate-1 leading-tight">{anime.title}</h1>
            <p className="text-xs md:text-sm lg:text-base leading-relaxed font-bold bg-black/20 p-4 md:p-6 border-l-8 border-white italic whitespace-pre-line">
              {anime.synopsis}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {anime.episodes && anime.episodes.length > 0 && (
                <Button variant="yellow" className="text-lg px-6 md:px-10 w-full md:w-auto" onClick={() => handleWatch(anime.episodes[0].slug)}>Watch Ep 01</Button>
              )}
              <Button 
                variant={isFavorite(anime.id) ? "red" : "white"} 
                className="text-lg px-6 md:px-10 w-full md:w-auto" 
                onClick={() => toggleFavorite(anime)}
              >
                {isFavorite(anime.id) ? "✓ IN MY LIST" : "+ MY LIST"}
              </Button>
               {anime.info?.aired && (
                <div className="bg-white border-4 border-black px-4 py-2 text-black font-bold flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  AIRING: {anime.info.aired}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Episode List and Batch */}
            <div className="space-y-8">
              <div className="bg-white border-4 border-black p-4 md:p-6 text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b-8 border-black pb-2 gap-4">
                  <h2 className="text-3xl md:text-4xl font-black oswald italic">Episode List</h2>
                  {anime.batch && (
                    <button 
                      onClick={() => {
                        if (anime.batchData) {
                            batchRef.current?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                            window.open(anime.batch?.otakudesuUrl, '_blank');
                        }
                      }}
                      className="bg-black text-[#FFCC00] px-4 py-2 font-black oswald uppercase text-sm border-4 border-black shadow-[4px_4px_0px_0px_#FF3B30] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
                    >
                      Download Batch 📥
                    </button>
                  )}
                </div>
                <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {anime.episodes?.map((ep) => (
                      <div 
                        key={ep.slug} 
                        onClick={() => handleWatch(ep.slug)}
                        className="group flex items-center gap-4 border-4 border-black p-3 md:p-4 hover:bg-[#FFCC00] cursor-pointer transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-black text-[#FFCC00] flex items-center justify-center font-black oswald text-xl md:text-2xl italic shrink-0">
                          {ep.episode?.padStart(2, '0') || '??'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-black oswald uppercase text-xs md:text-sm line-clamp-1 group-hover:text-black">
                            {ep.title.replace(anime.title, '').replace('Subtitle Indonesia', '').trim() || `Episode ${ep.episode}`}
                          </h4>
                          <p className="text-[10px] font-bold text-gray-400 group-hover:text-black/60 uppercase italic">Released: {ep.date}</p>
                        </div>
                        <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors text-xs md:text-base">
                          ▶
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Batch Download Card */}
              {anime.batchData && (
                <div ref={batchRef} className="bg-[#FFCC00] border-4 border-black p-4 md:p-6 text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h2 className="text-2xl md:text-3xl font-black oswald italic mb-6 border-b-8 border-black pb-2">Batch Download</h2>
                  <div className="space-y-6">
                    {anime.batchData.downloadUrl.formats.map((format, fIdx) => (
                      <div key={fIdx} className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-black oswald text-lg mb-4 bg-black text-white p-2 inline-block transform -rotate-1">{format.title}</h3>
                        <div className="space-y-4">
                          {format.qualities.map((quality, qIdx) => (
                            <div key={qIdx} className="border-t-2 border-black pt-4 first:border-t-0 first:pt-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="bg-[#FF3B30] text-white px-2 py-0.5 font-black text-[10px] border-2 border-black">{quality.title}</span>
                                <span className="bg-blue-500 text-white px-2 py-0.5 font-black text-[10px] border-2 border-black">{quality.size}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {quality.urls.map((url, uIdx) => (
                                  <a
                                    key={uIdx}
                                    href={url.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-black text-white px-2 py-1 font-bold text-[9px] border-2 border-black hover:bg-white hover:text-black transition-colors"
                                  >
                                    {url.title}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Intel Section */}
              {anime.recommended && anime.recommended.length > 0 && (
                <div className="bg-white border-4 border-black p-6 text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="font-black oswald text-2xl mb-4 border-b-8 border-black pb-2 inline-block italic">Related Intel</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {anime.recommended.map((rel: any) => (
                      <div 
                        key={rel.animeId} 
                        onClick={() => navigate(`/detail/${rel.animeId}`)}
                        className="group cursor-pointer border-4 border-black p-2 hover:bg-[#FFCC00] transition-all transform hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <div className="aspect-[3/4] overflow-hidden border-2 border-black mb-2">
                          <img src={rel.poster} alt={rel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="font-black oswald text-[10px] uppercase line-clamp-2 leading-none">{rel.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnimeDetail;