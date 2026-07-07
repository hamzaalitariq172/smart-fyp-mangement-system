import { useState, useEffect, useCallback } from 'react';

const useFetch = (fetchFn, params = {}, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (overrideParams) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFn(overrideParams || params);
        setData(result.data);
        return result.data;
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchFn]
  );

  useEffect(() => {
    if (immediate) execute();
  }, [immediate, execute]);

  return { data, loading, error, execute, setData };
};

export default useFetch;
