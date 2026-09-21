import { useEffect, useState } from 'react';
import api from '../api/axios.js';

// Fetches a lightweight list (id + display name) from a given endpoint to
// populate <select> dropdowns for foreign-key style fields (e.g. picking a
// Category when creating a Product).
export default function useRefOptions(endpoint) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(!!endpoint);

  useEffect(() => {
    if (!endpoint) return;
    let active = true;
    setLoading(true);
    api
      .get(`/${endpoint}`, { params: { limit: 500 } })
      .then(({ data }) => {
        if (active) setOptions(data.data || []);
      })
      .catch(() => {
        if (active) setOptions([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [endpoint]);

  return { options, loading };
}
