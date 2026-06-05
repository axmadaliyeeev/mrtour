import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("mrtour-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => {
    if (res.data?.success !== undefined) res.data = res.data.data;
    return res;
  },
  async (err) => {
    const orig = err.config as AxiosRequestConfig & { _retry?: boolean };
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      try {
        const { data } = await axios.post<{ success: boolean; data: { accessToken: string } }>(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = data?.data?.accessToken;
        if (newToken) {
          localStorage.setItem("mrtour-token", newToken);
          if (orig.headers) orig.headers.Authorization = `Bearer ${newToken}`;
        }
        return instance(orig);
      } catch {
        localStorage.removeItem("mrtour-token");
      }
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
