const internalApiUrl = import.meta.env.VITE_INTERNAL_API_URL;

if (!internalApiUrl) {
  throw new Error('INTERNAL API URL is not configured');
}

export const env = {
  internalApiUrl,
};
