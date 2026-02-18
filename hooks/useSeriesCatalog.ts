import { useEffect, useState } from 'react';
import { MOCK_DRAMAS } from '../constants';
import { getSeriesCatalog } from '../services/seriesApi';
import { Series } from '../types';

export const useSeriesCatalog = () => {
  const [series, setSeries] = useState<Series[]>(MOCK_DRAMAS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const data = await getSeriesCatalog();
        if (mounted && data.length > 0) {
          setSeries(data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  return { series, loading };
};
