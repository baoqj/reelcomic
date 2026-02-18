import { MOCK_DRAMAS } from '../constants';
import { Series } from '../types';

const asSeriesPayload = (rows: Series[]): Series[] => rows;

export const getSeriesCatalog = async (): Promise<Series[]> => {
  try {
    const response = await fetch('/api/series');
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }
    const payload = (await response.json()) as { data?: Series[] };
    if (!payload.data || payload.data.length === 0) {
      return MOCK_DRAMAS;
    }
    return asSeriesPayload(payload.data);
  } catch {
    return MOCK_DRAMAS;
  }
};
