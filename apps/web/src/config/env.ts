const apiUrl = import.meta.env.VITE_API_BASE_URL;
const apiToken = import.meta.env.VITE_API_TOKEN;
const internalApiUrl =
  import.meta.env.VITE_INTERNAL_API_URL ?? 'http://localhost:3333';

if (!apiUrl) {
  throw new Error('API BASE URL is not configured');
}

if (!apiToken) {
  throw new Error('API TOKEN is not configured');
}

export const env = {
  apiUrl,
  apiToken,
  internalApiUrl,
};
