import { MOCK_DRAMAS } from '../constants';
import { Series } from '../types';

const mapDbRowsToSeries = (rows: any[]): Series[] =>
  rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    synopsis: row.synopsis,
    thumbnail: row.cover_blob_url || row.poster_blob_url || '',
    poster: row.poster_blob_url || row.cover_blob_url || '',
    rating: Number(row.average_rating || 0),
    views: Number(row.view_count || 0).toLocaleString(),
    tags: [],
    status: row.status === 'completed' ? 'completed' : 'ongoing',
    totalEpisodes: Number(row.total_episodes || 0),
    releaseYear: String(row.release_year || ''),
    cast: [],
    episodes: [],
  }));

export default async function handler(_req: any, res: any) {
  try {
    if (!process.env.DATABASE_URL) {
      res.status(200).json({ source: 'mock', data: MOCK_DRAMAS });
      return;
    }

    const { getPublishedSeries } = await import('../server/neon');
    const rows = await getPublishedSeries();
    if (rows.length === 0) {
      res.status(200).json({ source: 'mock', data: MOCK_DRAMAS });
      return;
    }

    res.status(200).json({ source: 'neon', data: mapDbRowsToSeries(rows) });
  } catch (error) {
    console.error('GET /api/series failed', error);
    res.status(200).json({ source: 'mock-fallback', data: MOCK_DRAMAS });
  }
}
