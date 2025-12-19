
export interface Anime {
  id: string; // This is the slug
  title: string;
  thumbnail: string;
  banner: string;
  episode: string;
  status: 'ONGOING' | 'COMPLETED';
  year: number;
  rating: number;
  genre: string[];
  synopsis: string;
  likes?: string;
}

export interface DetailedEpisode {
  title: string;
  episode: string;
  date: string;
  slug: string;
}

export interface DetailedAnime extends Anime {
  info: {
    alternatif?: string;
    tipe?: string;
    jumlah_episode?: string;
    studio?: string;
    musim?: string;
  };
  episodes: DetailedEpisode[];
}

export interface Episode {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  date: string;
  year?: number;
  description?: string;
}
