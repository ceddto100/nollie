const API_BASE = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (path) => `${API_BASE}/api${path}`;
