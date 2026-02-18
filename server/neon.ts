import { neon } from '@neondatabase/serverless';
import { requireEnv } from './env';

export const db = neon(requireEnv('DATABASE_URL'));

export interface SeriesRow {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  status: 'ongoing' | 'completed' | 'archived';
  release_year: number;
  total_episodes: number;
  poster_blob_url: string | null;
  cover_blob_url: string | null;
  average_rating: string;
  view_count: string;
}

export const getPublishedSeries = async (): Promise<SeriesRow[]> => {
  const rows = await db`
    select
      s.id,
      s.slug,
      s.title,
      s.synopsis,
      s.status,
      s.release_year,
      s.total_episodes,
      s.poster_blob_url,
      s.cover_blob_url,
      s.average_rating::text as average_rating,
      s.view_count::text as view_count
    from series s
    where exists (
      select 1
      from episodes e
      where e.series_id = s.id and e.is_published = true
    )
    order by s.created_at desc
    limit 100
  `;
  return rows as SeriesRow[];
};
