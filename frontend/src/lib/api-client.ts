import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";

// Tolerate VITE_API_URL being set without the `/api` suffix or with a
// trailing slash (e.g. "https://host.onrender.com" or ".../api/") — every
// backend route lives under /api, so a misconfigured env var would
// otherwise silently 404 every single request.
function resolveBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_URL ?? "http://localhost:5000/api").replace(/\/+$/, "");
  return raw.endsWith("/api") ? raw : `${raw}/api`;
}

const BASE_URL = resolveBaseUrl();

const instance = axios.create({
  baseURL: BASE_URL,
  // Free-tier hosts (Render, etc.) spin the backend down after a period of
  // inactivity — the first request after that can take 30-50s to cold-start
  // before it even reaches route logic. 10s was tripping that every time.
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("trova-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Multiple requests can 401 at once (e.g. several components fetching on
// mount). Without sharing one in-flight refresh, each would call
// /auth/refresh independently — the backend rotates the refresh token on
// every call, so the second response invalidates the first's new token
// before it's even used, spuriously logging the user out.
let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ success: boolean; data: { accessToken: string } }>(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .then(({ data }) => data?.data?.accessToken ?? null)
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

instance.interceptors.response.use(
  (res) => {
    if (res.data?.success !== undefined) res.data = res.data.data;
    return res;
  },
  async (err) => {
    const orig = err.config as AxiosRequestConfig & { _retry?: boolean };
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        localStorage.setItem("trova-token", newToken);
        if (orig.headers) orig.headers.Authorization = `Bearer ${newToken}`;
        return instance(orig);
      }
      localStorage.removeItem("trova-token");
    }
    return Promise.reject(err);
  }
);

export const apiClient = {
  get:    <T>(url: string, cfg?: AxiosRequestConfig) => instance.get<T>(url, cfg).then(r => r.data as T),
  post:   <T>(url: string, data?: unknown, cfg?: AxiosRequestConfig) => instance.post<T>(url, data, cfg).then(r => r.data as T),
  patch:  <T>(url: string, data?: unknown, cfg?: AxiosRequestConfig) => instance.patch<T>(url, data, cfg).then(r => r.data as T),
  delete: <T>(url: string, cfg?: AxiosRequestConfig) => instance.delete<T>(url, cfg).then(r => r.data as T),
};
