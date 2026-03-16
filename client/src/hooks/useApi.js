import { useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../utils/api';

const getToken = () => localStorage.getItem('admin_token');

export function useApi(path, { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl(path));
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      setData(json.data);
      return json.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    if (immediate) fetchData();
  }, [immediate, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export async function apiRequest(path, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(getApiUrl(path), options);
  const json = await res.json();

  if (!res.ok) throw new Error(json.error || json.message || `API error: ${res.status}`);
  return json;
}
