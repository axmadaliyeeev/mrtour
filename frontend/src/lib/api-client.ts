import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// ── Request: attach JWT ────────────────────────────────
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("mrtour-token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response: refresh on 401 ──────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((token: string) => {
          if (original.headers) {
            (original.headers as Record<string, string>).Authorization =
              `Bearer ${token}`;
          }
          resolve(instance(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("mrtour-refresh-token")
          : null;

      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const newToken: string = data.accessToken;

      if (typeof window !== "undefined") {
        localStorage.setItem("mrtour-token", newToken);
      }

      refreshQueue.forEach((cb) => cb(newToken));
      refreshQueue = [];

      if (original.headers) {
        (original.headers as Record<string, string>).Authorization =
          `Bearer ${newToken}`;
      }

      return instance(original);
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem("mrtour-token");
        localStorage.removeItem("mrtour-refresh-token");
      }
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

// ── Typed convenience methods ─────────────────────────
export const apiClient = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get<T>(url, config).then((r) => r.data);
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return instance.post<T>(url, data, config).then((r) => r.data);
  },
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return instance.put<T>(url, data, config).then((r) => r.data);
  },
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete<T>(url, config).then((r) => r.data);
  },
};
